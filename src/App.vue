<template>
  <div id="app">
    <nav class="nav has-shadow is-flex">
      <div class="nav-left">

        <a class="nav-item">
          <img src="assets/logo.png" alt="">
        </a>

        <a class="nav-item is-tab" :class="tabs.configure.class" @click="switchTab('configure')">
          配置
        </a>
        <a class="nav-item is-tab" :class="tabs.sync.class" @click="switchTab('sync')">
          同步
        </a>
        <a class="nav-item is-tab" :class="tabs.crontab.class" @click="switchTab('crontab')">
          定时任务
        </a>
        <a class="nav-item is-tab" :class="tabs.upgrade.class" @click="switchTab('upgrade')">
          升级
        </a>
      </div>

      <div class="nav-center">
        <a class="nav-item" href="#">
          bdp-sync
        </a>
        <a class="nav-item" href="#">
        </a>
      </div>

      <span class="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </span>

      <div class="nav-right nav-menu">

        <span class="nav-item">
          <a class="button is-danger" @click="shutdown">
            <span>关闭服务</span>
          </a>
          <a class="button is-warning" href="#" @click="userOptClicked">
            <span>{{ userOpt }}</span>
          </a>
          <a class="button is-info" target="_blank" href="https://www.bdp.cn">
            <span>官网</span>
          </a>
        </span>
      </div>
    </nav>
    <div class="main-page">
      <configure v-ref:configure></configure>
      <crontab v-ref:crontab></crontab>
      <sync v-ref:sync></sync>
      <upgrade v-ref:upgrade></upgrade>
      <model v-ref:model></model>
    </div>
  </div>
  <footer class="footer">
    <div class="">
      <div class="has-text-centered">
        <p>
          <strong>BDP数据同步客户端</strong> by <a target="_blank" href="https://www.bdp.cn">商业数据平台</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
  import model from './components/model.vue'
  import configure from './components/configure.vue'
  import crontab from './components/crontab.vue'
  import sync from './components/sync.vue'
  import upgrade from './components/upgrade.vue'
  import CONST from './const'

  export default {
    data () {
      return {
        userOpt: '登录',
        isLogin: true,
        classes: {
        },
        tabs: {
          configure: {
            name: 'configure',
            class: {
              'is-active': true
            }
          },
          sync: {
            name: 'sync',
            class: {
              'is-active': false
            }
          },
          crontab: {
            name: 'crontab',
            class: {
              'is-active': false
            }
          },
          upgrade: {
            name: 'upgrade',
            class: {
              'is-active': false
            }
          }
        },
        currentTab: null,
        state: CONST.state.idle
      }
    },
    components: {
      model: model,
      configure: configure,
      crontab: crontab,
      sync: sync,
      upgrade: upgrade
    },
    ready: function () {
      this.$refs['configure'].loadConfigure('ready')
      this.currentTab = this.tabs.configure
    },
    methods: {
      initConfigure: function () {
        this.$refs['configure'].loadConfigure('init')
      },
      switchTab: function (tab) {
        if (this.currentTab != null) {
          this.$refs[this.currentTab.name].hidden()
          this.currentTab.class['is-active'] = false
        }
        this.$refs[tab].show()
        this.currentTab = this.tabs[tab]
        this.currentTab.class['is-active'] = true
      },
      showLogin: function () {
        this.$refs['model'].show('登录')
      },
      userOptClicked: function () {
        if (this.state !== CONST.state.idle) {
          this.alert('当前正在' + this.state + ', 请稍后')
          return
        }
        this.$refs['model'].show(this.userOpt)
      },
      shutdown: function () {
        if (this.state !== CONST.state.idle) {
          this.alert('当前正在' + this.state + ', 请稍后')
          return
        }
        this.$http.get('/api/shutdown').then(function () {
          this.alert('已关闭')
        })
      },
      /**
       * 显示一个对话框, 并且返回用户的选择
       * @param title: 对话框标题
       * @param body: 对话内容
       * @param buttons: 需要有的按键
       * @param callback: 回调函数
       * @constructor
       *
       *
       * buttons: [
       *  {name: '确认', ret 'ok'},       //默认
       *  {name: '取消', ret: 'cancel'}
       * ]
       */
      MessageBox: function (title, body, buttons, callback) {
        this.$refs['model'].showMessageBox(title, body, buttons, callback)
      },
      alert: function (body) {
        this.MessageBox('提示', body, [{name: '确认', class: 'is-info'}], function () {})
      }
    }
  }
</script>

<style>
  @import "assets/css/bulma.css";

  html, body {
    height: 100%;
    width: 100%;
  }

  #app {
    height: 100%;
    padding-bottom: 60px;
    overflow: scroll;
  }

  .footer {
    background: #f5f7fa;
    position: absolute;
    bottom: 0;
    width: 100%;
    max-height: 10px;
  }

  .checkbox input {
    margin-right: 5px;
  }
  em {
    margin: auto;
  }

</style>
