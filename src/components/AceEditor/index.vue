<template>
  <div ref="aceEditorRef" class="kk-code-editor" />
</template>

<script>
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/ext-searchbox'
import 'ace-builds/src-noconflict/theme-chrome'

// 引入语言高亮样式
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-golang'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-c_cpp'

// 引入智能提示
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/snippets/java'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/snippets/golang'
import 'ace-builds/src-noconflict/snippets/python'
import 'ace-builds/src-noconflict/snippets/c_cpp'

export default {
  name: 'AceEditor',
  data() {
    return {
      aceEditor: null
    }
  },
  mounted() {
    this.aceEditor = ace.edit(this.$refs.aceEditorRef, {
      autoScrollEditorIntoView: false,
      copyWithEmptySelection: false,
      showPrintMargin: false,
      highlightActiveLine: true,
      // fontFamily: 'monospace',
      fontSize: '14px',
      enableBasicAutocompletion: true, // 启用基本自动补全
      enableSnippets: true, // 启用代码片段
      enableLiveAutocompletion: true, // 启用实时自动补全
      theme: 'ace/theme/chrome', // 主题
      mode: 'ace/mode/java' // 高亮
    })

    // 查找替换
    this.aceEditor.find('needle', {
      backwards: false,
      wrap: false,
      caseSensitive: false,
      wholeWord: false,
      regExp: false
    })
    this.aceEditor.findNext()
    this.aceEditor.findPrevious()

    // 监听保存键 ctrl+s
    this.$refs.aceEditorRef.addEventListener('keydown', this.CtrlS)
  },
  beforeDestroy() {
    if (this.$refs.aceEditorRef) this.$refs.aceEditorRef.removeEventListener('keydown', this.CtrlS)
  },
  methods: {
    // 赋值内容
    setValue(text) {
      if (this.aceEditor) this.aceEditor.setValue(text)
      if (this.aceEditor) this.aceEditor.selection.clearSelection()
    },

    // 获取代码
    getValue() {
      if (this.aceEditor) return this.aceEditor.getValue()
      else return ''
    },

    // 保存代码
    CtrlS(event) {
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case 's':
            event.preventDefault()
            this.$emit('handleSave', this.aceEditor.getValue())
            break
        }
      }
    },

    // 清空撤销历史
    reset() {
      if (this.aceEditor) this.aceEditor.getSession().getUndoManager().reset()
    },

    // 设置语言
    setLanguage(lang) {
      if (this.aceEditor) this.aceEditor.getSession().setMode(`ace/mode/${lang}`)
    }
  }
}
</script>

<style scoped>
.kk-code-editor {
  height: 100%;
  width: 100%;
  border: 1px solid #ececec;
}
</style>
