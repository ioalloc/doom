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
          <a class="button is-warning" href="#">
            <span>注销</span>
          </a>
          <a class="button is-info" href="https://www.bdp.cn">
            <span>官网</span>
          </a>
        </span>
      </div>
    </nav>
    <login></login>
    <configure v-ref:configure></configure>
    <crontab v-ref:crontab></crontab>
    <sync v-ref:sync></sync>
    <upgrade v-ref:upgrade></upgrade>
  </div>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>
          <strong>Bulma</strong> by <a href="http://jgthms.com">Jeremy Thomas</a>. The source code is licensed
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
          is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
  import login from './components/login.vue'
  import configure from './components/configure.vue'
  import crontab from './components/crontab.vue'
  import sync from './components/sync.vue'
  import upgrade from './components/upgrade.vue'

  export default {
    data () {
      return {
        currentTab: 'configure'
      }
    },
    components: {
      login: login,
      configure: configure,
      crontab: crontab,
      sync: sync,
      upgrade: upgrade
    },
    methods: {
      switchTab: function (tab) {
        if (this.currentTab != null) {
          this.$refs[this.currentTab].hidden()
        }
        this.$refs[tab].show()
        this.currentTab = tab
      }
    }
  }
</script>

<style>
  @import "assets/css/bulma.css";
</style>
