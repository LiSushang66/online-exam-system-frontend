<template>
  <div>
    <a-card :title="$t('Source Code')" :bordered="false" :head-style="{backgroundColor:'#f2f2f2',height:'56px',userSelect:'none'}">
      <template #extra>
        <div class="kk-flex">
          <a-tooltip>
            <template #title>{{ $t('reset') }}</template>
            <a-icon type="sync" style="font-size: 18px; cursor: pointer;" @click="resetCode" />
          </a-tooltip>
          <div style="margin-left: 20px;">
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="Java" @click="handleMenuClick('Java')">Java</a-menu-item>
                  <a-menu-item key="C++" @click="handleMenuClick('C++')">C++</a-menu-item>
                  <a-menu-item key="C" @click="handleMenuClick('C')">C</a-menu-item>
                  <a-menu-item key="Python" @click="handleMenuClick('Python')">Python</a-menu-item>
                  <a-menu-item key="Javascript" @click="handleMenuClick('Javascript')">Javascript</a-menu-item>
                  <a-menu-item key="Go" @click="handleMenuClick('Go')">Go</a-menu-item>
                </a-menu>
              </template>
              <a-button>
                {{ lang }}
                <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </div>
          <div style="margin-left: 15px;">
            <a-button type="primary" :loading="loading" @click="executeCode">{{ $t('execute') }}</a-button>
          </div>
        </div>
      </template>
      <div class="kk-class">
        <AceEditor ref="codeEditorRef" @handleSave="handleSave" />
      </div>
    </a-card>
  </div>
</template>

<script>
import AceEditor from '@/components/AceEditor/'
import { message } from 'ant-design-vue'

export default {
  name: 'CodeEditor',
  components: {
    AceEditor
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lang: 'Java',
      // 定义语言及对应的模板代码等
      langMap: {
        'Java': {
          selectLang: 'Java',
          editorLang: 'java',
          executeLang: 'java',
          codeTemplate: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // write your code
        
    }
}`
        },
        'C++': {
          selectLang: 'C++',
          editorLang: 'c_cpp',
          executeLang: 'c++',
          codeTemplate: `#include <iostream>
#include <cstdio>

using namespace std;

int main()
{
    // write your code
    
    return 0;
}`
        },
        'C': {
          selectLang: 'C',
          editorLang: 'c_cpp',
          executeLang: 'c',
          codeTemplate: `#include <stdio.h>

int main()
{
    // write your code
    
    return 0;
}`
        },
        'Python': {
          selectLang: 'Python',
          editorLang: 'python',
          executeLang: 'python',
          codeTemplate: `# write your code
`
        },
        'Javascript': {
          selectLang: 'Javascript',
          editorLang: 'javascript',
          executeLang: 'javascript',
          codeTemplate: `const fs = require('fs')
const data = fs.readFileSync('/dev/stdin')
// write your code
`
        },
        'Go': {
          selectLang: 'Go',
          editorLang: 'golang',
          executeLang: 'golang',
          codeTemplate: `package main

func main() {
    // write your code
    
}`
        }
      }
    }
  },
  mounted() {
    if (localStorage.getItem('lang')) {
      if (this.langMap[localStorage.getItem('lang')]) this.handleMenuClick(localStorage.getItem('lang'))
    } else this.handleMenuClick(this.lang)
    if (localStorage.getItem('code-' + this.lang)) this.$refs.codeEditorRef.setValue(localStorage.getItem('code-' + this.lang))
  },
  methods: {
    // 切换语言
    handleMenuClick(content) {
      this.lang = content
      if (this.$refs.codeEditorRef) {
        this.$refs.codeEditorRef.setLanguage(this.langMap[this.lang].editorLang)
        if (localStorage.getItem('code-' + this.lang)) this.$refs.codeEditorRef.setValue(localStorage.getItem('code-' + this.lang))
        else this.$refs.codeEditorRef.setValue(this.langMap[this.lang].codeTemplate)
        this.$refs.codeEditorRef.reset()
      }
    },

    // 执行代码
    executeCode() {
      const code = this.$refs.codeEditorRef.getValue()
      this.$emit('executeCode', code, this.langMap[this.lang])
    },

    // 重置代码
    resetCode() {
      if (this.$refs.codeEditorRef) this.$refs.codeEditorRef.setValue(this.langMap[this.lang].codeTemplate)
    },

    // 保存代码
    handleSave(code) {
      localStorage.setItem('lang', this.lang)
      localStorage.setItem('code-' + this.lang, code)
      message.success({ content: this.$t('saved'), key: this.$t('saved') })
    }
  }
}
</script>

<style scoped>
.kk-flex {
  display: flex;
  align-items: center;
}

.kk-class {
  height: calc(100vh - 106px);
  width: 100%;
}
</style>
