<template>
  <div>
    <a-card :title="$t('Run Results')" :head-style="{backgroundColor:'#f2f2f2',height:'56px',userSelect:'none'}" :body-style="{backgroundColor:'#fdfdfd'}">
      <div class="kk-class">
        <div>
          <a-card :title="$t('Input Data')" :head-style="{backgroundColor:'#f2f2f2',userSelect:'none'}">
            <template #extra>
              <div>
                <a-tooltip>
                  <template #title>{{ $t('Upload Input') }}</template>
                  <a-upload
                    :custom-request="parseInput"
                    :show-upload-list="false"
                  >
                    <a-icon type="import" style="font-size: 18px; cursor: pointer;" />
                  </a-upload>
                </a-tooltip>
              </div>
            </template>
          </a-card>
          <a-spin :spinning="loadingInput">
            <a-textarea v-model="input" auto-size size="large" placeholder="" allow-clear :max-length="input_max_len" />
          </a-spin>
        </div>
        <div style="height: 40px;" />
        <div>
          <a-card :title="$t('Output Result')" :head-style="{backgroundColor:'#f2f2f2',userSelect:'none'}">
            <template #extra>
              <div>
                <a-tooltip>
                  <template #title>{{ $t('Copy Output') }}</template>
                  <a-icon type="copy" style="font-size: 18px;" @click="doCopy(output)" />
                </a-tooltip>
              </div>
            </template>
            <a-spin :spinning="loading">
              <div class="kk-card-body">
                <pre>{{ !(output && output.length > 0) ? $t('No Output Result') : output }}</pre>
              </div>
            </a-spin>
          </a-card>
        </div>
        <div style="height: 40px;" />
        <div>
          <a-card :title="$t('Error Message')" :head-style="{backgroundColor:'#f2f2f2',userSelect:'none'}" :body-style="{color:'#f63636'}">
            <template #extra>
              <div>
                <a-tooltip>
                  <template #title>{{ $t('Copy Error') }}</template>
                  <a-icon type="copy" style="font-size: 18px;" @click="doCopy(stderr)" />
                </a-tooltip>
              </div>
            </template>
            <a-spin :spinning="loading">
              <div class="kk-card-body">
                <pre>{{ !(stderr && stderr.length > 0) ? $t('No Error Message') : stderr }}</pre>
              </div>
            </a-spin>
          </a-card>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import VueClipboard from 'vue-clipboard2'

export default {
  name: 'ResultInfo',
  components: {},
  props: {
    loading: {
      type: Boolean, // 指定类型为布尔值
      required: false, // 是否必需，默认为 false
      default: false // 默认值
    }
  },
  data() {
    return {
      input_max_len: 1024,
      input: '',
      output: '',
      stderr: '',
      loadingInput: false
    }
  },
  methods: {
    // 复制
    doCopy(content) {
      if (content && content.length > 0) {
        VueClipboard.copy(content).then(() => {
          message.success({ content: this.$t('copied'), key: this.$t('copied') })
        }).catch(() => {
          message.error({ content: this.$t('copy failed'), key: this.$t('copy failed') })
        })
      } else message.warning({ content: this.$t('contentless'), key: this.$t('contentless') })
    },

    parseInput(data) {
      const file = data.file
      const fileReader = new FileReader()
      fileReader.onload = () => {
        const content = fileReader.result
        this.input = content
        message.success({ content: this.$t('Read Input Successfully'), key: this.$t('Read Input Successfully') })
        this.loadingInput = false
      }
      fileReader.onerror = () => {
        message.error({ content: this.$t('Read Input Failed'), key: this.$t('Read Input Failed') })
        this.loadingInput = false
      }
      this.loadingInput = true
      fileReader.readAsText(file.slice(0, this.input_max_len))
    }
  }
}
</script>

<style scoped>
.global {
  background-color: #ff0000;
}

.kk-card-body {
  overflow-x: auto;
}

pre {
  margin: 0 0;
}

.kk-class {
  min-height: calc(100vh - 106px);
  width: 100%;
}
</style>
