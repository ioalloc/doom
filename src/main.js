import Vue from 'vue'
import App from './App.vue'
import http from 'vue-resource'

Vue.use(http)

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: {App}
})
