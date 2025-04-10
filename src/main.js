/*
 * @Author: 暮安 14122148+muanananan@user.noreply.gitee.com
 * @Date: 2024-03-04 10:34:47
 * @LastEditors: 暮安 14122148+muanananan@user.noreply.gitee.com
 * @LastEditTime: 2024-04-25 15:06:09
 * @FilePath: \vue-admin-template\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import htmlToPdf from '@/utils/htmlToPdf'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css
import echarts from 'echarts'
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import axios from 'axios'
import { getToken } from './utils/auth'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // 引入样式
import 'quill/dist/quill.snow.css' // snow theme
import 'quill/dist/quill.bubble.css' // bubble theme

// 导入语言文件
import en from './locales/en_US.json'
import cn from './locales/zh_CN.json'
import hk from './locales/zh_HK.json'

import VueI18n from 'vue-i18n'
import $ from 'jquery'

// Element-UI
import 'element-ui/lib/theme-chalk/index.css'

// 如果是开发环境，关闭一些提示
if (process.env.NODE_ENV === 'development') {
  console.warn = function(message) {
    if (!message.includes('DOMNodeInserted')) {
      console.log(message)
    }
  }
}

// 定义白名单
Vue.prototype.$echarts = echarts
const whiteList = ['/login', '/register']

// 判断是否有token，如果有token，则允许访问，否则跳转到登录页面
router.beforeEach((to, from, next) => {
  // 获取token，这里以从localStorage获取为例
  const token = getToken('Authorization')

  // 检查当前访问的路由是否在白名单内
  if (whiteList.includes(to.path)) {
    // 如果在白名单内，不需要token，直接允许访问
    next()
  } else {
    // 如果不在白名单内，则需要检查token
    if (!token) {
      // 如果没有token，则跳转到登录页面，并携带前往的完整路径以便登录后重定向
      next({ path: '/login', query: { redirect: to.fullPath }})
    } else {
      // 如果有token，则允许访问
      next()
    }
  }
})

axios.defaults.withCredentials = true

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
Vue.use(htmlToPdf)
// 富文本
Vue.use(VueQuillEditor /* { default global options } */)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 国际化
let i18n = null

const initializeApp = (locale) => {
  Vue.use(VueI18n)
  Vue.use(ElementUI)
  Vue.use(Card)
  Vue.use(Dropdown)
  Vue.use(Menu)
  Vue.use(Button)
  Vue.use(Input)
  Vue.use(Spin)
  Vue.use(Tooltip)
  Vue.use(Upload)
  Vue.use(Icon)

  i18n = new VueI18n({
    locale: locale,
    fallbackLocale: 'en',
    messages: { en, cn, hk }
  })

  new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

const getCountry = () => {
  // 直接初始化应用，使用默认语言
  initializeApp('cn')
  // 异步获取地理位置信息
  $.ajax({
    url: 'https://ipapi.co/json/',
    type: 'get',
    timeout: 5000, // 设置5秒超时
    success(resp) {
      try {
        const countryCode = resp.country_code
        if (countryCode === 'CN') {
          // 更新为中文
          i18n.locale = 'cn'
        } else if (countryCode === 'HK' || countryCode === 'MO' || countryCode === 'TW') {
          // 更新为繁体中文
          i18n.locale = 'hk'
        } else {
          // 更新为英文
          i18n.locale = 'en'
        }
      } catch (error) {
        console.error('设置语言失败:', error)
      }
    },
    error(error) {
      console.error('获取地理位置失败:', error)
    }
  })
}

getCountry()

// Ant Design Vue
import 'ant-design-vue/dist/antd.css'
import { Card, Dropdown, Menu, Button, Input, Spin, Tooltip, Upload, Icon } from 'ant-design-vue'
