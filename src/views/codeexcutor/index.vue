<template>
  <div class="app-container">
    <div class="code-executor-container">
      <div class="editor-section">
        <CodeEditor :loading="loading" @executeCode="executeCode" />
      </div>
      <div class="result-section">
        <ResultInfo ref="resultInfoRef" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import { getTokenInfo } from '@/utils/jwtUtils'
import { getExecuteKey, executeCode } from '@/api/codeexecutor'

import ResultInfo from './ResultInfo.vue'
import CodeEditor from './CodeEditor.vue'

export default {
  name: 'CodeExecutor',
  components: {
    CodeEditor,
    ResultInfo
  },
  data() {
    return {
      loading: false,
      AccessKey: '',
      SecretKey: '',
      base_url: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    // 检查用户角色
    try {
      const userInfo = getTokenInfo()
      if (userInfo.roleId !== 1) { // 1 表示学生角色
        this.$router.push('/404')
        return
      }
    } catch (error) {
      this.$router.push('/404')
      return
    }
  },
  mounted() {
    this.getExecuteKey()
    setInterval(() => {
      this.getExecuteKey()
    }, 40 * 60 * 1000)
  },
  methods: {
    // 获取执行密钥
    getExecuteKey() {
      if (localStorage.getItem('AccessKey') && localStorage.getItem('SecretKey')) {
        this.AccessKey = localStorage.getItem('AccessKey')
        this.SecretKey = localStorage.getItem('SecretKey')
      }
      getExecuteKey().then(resp => {
        if (resp.code === 200) {
          this.AccessKey = resp.data.AccessKey
          this.SecretKey = resp.data.SecretKey
          localStorage.setItem('AccessKey', resp.data.AccessKey)
          localStorage.setItem('SecretKey', resp.data.SecretKey)
        }
      }).catch(error => {
        message.error({ content: '获取API密钥失败：' + error.message, key: error.message })
        // 如果请求失败，使用默认的测试密钥
        this.AccessKey = 'testAccessKey'
        this.SecretKey = 'testSecretKey'
      })
    },

    // 执行代码
    executeCode(code, langInfo) {
      this.loading = true

      // 构造请求数据
      const formData = new FormData()
      formData.append('code', code)
      formData.append('lang', langInfo.executeLang)

      if (this.$refs.resultInfoRef.input && this.$refs.resultInfoRef.input.length > 0) {
        formData.append('inputs', this.$refs.resultInfoRef.input)
      }

      // 打印请求数据，用于调试
      console.log('Request Data:', {
        code: code,
        lang: langInfo.executeLang,
        inputs: this.$refs.resultInfoRef.input
      })

      executeCode(formData).then(resp => {
        console.log('Response:', resp) // 打印响应数据，用于调试
        if (resp.code !== 200) {
          message.error({ content: resp.info || '执行失败', key: resp.info || '执行失败' })
        } else if (resp.data.executeType === '执行成功') {
          this.$refs.resultInfoRef.output = resp.data.stdout[0]
          this.$refs.resultInfoRef.stderr = resp.data.stderr[0]
          message.success({ content: '执行成功', key: '执行成功' })
        } else {
          this.$refs.resultInfoRef.output = ''
          this.$refs.resultInfoRef.stderr = resp.data.executeDetail
          message.warning({ content: resp.data.executeType, key: resp.data.executeType })
        }
        if (code && code.length > 0) {
          localStorage.setItem('code-' + langInfo.selectLang, code)
          localStorage.setItem('lang', langInfo.selectLang)
        }
      }).catch(error => {
        console.error('Error:', error) // 打印错误信息，用于调试
        message.error({ content: '执行代码失败：' + error.message, key: error.message })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.code-executor-container {
  display: flex;
  height: calc(100vh - 130px);
  margin: -20px;
  overflow: hidden;
}

.editor-section {
  flex: 1;
  border-right: 1px solid var(--border-color-base);
  min-width: 45%;
  max-width: 55%;
}

.result-section {
  flex: 1;
  min-width: 45%;
  max-width: 55%;
}

::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
