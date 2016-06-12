<template>
  <div class="modal {{ loginState }}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">请登录</p>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <p class="control">
          <input class="input" placeholder="企业域" v-model="userInfo.domain">
        </p>
        <p class="control">
          <input class="input" placeholder="用户名" v-model="userInfo.username">
        </p>
        <p class="control">
          <input class="input" type="password" placeholder="密码" v-model="userInfo.password">
        </p>
      </section>
      <footer class="modal-card-foot">
        <a class="button is-primary" @click="login">登录</a>
      </footer>
    </div>
  </div>
  <div class="modal {{ logoutState }}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">注销</p>
      </header>
      <section class="modal-card-body">
        <p class="control">
          确认要注销吗?
        </p>
      </section>
      <footer class="modal-card-foot">
        <a href="/api/logout" class="button is-warning">确认</a>
        <a class="button is-info" @click="close">取消</a>
      </footer>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        userInfo: {
          domain: '',
          username: '',
          password: ''
        },
        loginState: '',
        logoutState: ''
      }
    },
    methods: {
      login: function () {
        this.$http.post('/api/login', this.userInfo).then(function (response) {
          this.loginState = ''
          this.$parent.userOpt = '注销'
          this.$parent.initConfigure()
        }, function (response) {
          window.alert(response.data)
        })
      },
      show: function (type) {
        switch (type) {
          case '登录': {
            this.showLogin()
            break
          }
          case '注销': {
            this.logoutState = 'is-active'
            break
          }
        }
      },
      close: function () {
        this.loginState = ''
        this.logoutState = ''
      },
      showLogin: function () {
        this.loginState = 'is-active'
      }
    }
  }
</script>

<style>
  @import "../assets/css/bulma.css";
</style>
