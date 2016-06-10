<template>
  <div id="app">
    <nav class="nav has-shadow">
      <div class="nav-left">
        <a class="nav-item is-tab" href="#" @click="switchTab('configure')">
          配置
        </a>
        <a class="nav-item is-tab" href="#" @click="switchTab('sync')">
          同步
        </a>
        <a class="nav-item is-tab" href="#" @click="switchTab('crontab')">
          定时任务
        </a>
        <a class="nav-item is-tab" href="#" @click="switchTab('upgrade')">
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
          <a class="button is-danger">
            <span>关闭服务</span>
          </a>
          <a class="button is-warning" href="#" @click="userOptClicked">
            <span>{{ userOpt }}</span>
          </a>
          <a class="button is-info" href="https://www.bdp.cn">
            <span>官网</span>
          </a>
        </span>
      </div>
    </nav>
    <model v-ref:model></model>
    <configure v-ref:configure></configure>
    <crontab v-ref:crontab></crontab>
    <sync v-ref:sync></sync>
    <upgrade v-ref:upgrade></upgrade>
  </div>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>
          <strong>BDP数据同步客户端</strong> by <a href="https://www.bdp.cn">商业数据平台</a>
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

  export default {
    data () {
      return {
        currentTab: 'configure',
        userOpt: '登录'
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
    },
    methods: {
      initConfigure: function () {
        this.$refs['configure'].loadConfigure('init')
      },
      switchTab: function (tab) {
        if (this.currentTab != null) {
          this.$refs[this.currentTab].hidden()
        }
        this.$refs[tab].show()
        this.currentTab = tab
      },
      userOptClicked: function () {
        this.$refs['model'].show(this.userOpt)
      }
    }
  }
</script>

<style>
  @import "assets/css/bulma.css";
  .checkbox input {
    margin-right: 5px;
  }
  em {
    margin: auto;
  }
</style>
