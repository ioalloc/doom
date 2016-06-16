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
          <input class="input" type="password" placeholder="密码" v-model="userInfo.password" @keyup.enter="login">
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
        <a class="button is-warning" @click="logout">确认</a>
        <a class="button is-info" @click="close">取消</a>
      </footer>
    </div>
  </div>

  <div class="modal" :class="messageBox.class">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ messageBox.title }}</p>
      </header>
      <section class="modal-card-body">
        <p class="control">
          {{ messageBox.body }}
        </p>
      </section>
      <footer class="modal-card-foot">
        <a v-for="button in messageBox.buttons" class="button {{ button.class }}" @click="messageBoxClicked($index)">{{ button.name }}</a>
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
        logoutState: '',
        messageBox: {
          title: '',
          body: '',
          class: {
            'is-active': false
          },
          callback: function (ret) {},
          buttons: [
            {
              name: '确认',
              class: 'is-info',
              ret: 'ok'
            }
          ]
        }
      }
    },
    methods: {
      login: function () {
        this.$http.post('/api/login', this.userInfo).then(function (response) {
          this.loginState = ''
          this.$parent.userOpt = '注销'
          this.$parent.initConfigure()
        }, function (response) {
          this.$parent.alert('登录失败, 请检查信息是否正确')
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
      logout: function () {
        this.$http.get('/api/logout').then(function (response) {
          window.location.href = '/'
        }, function (response) {
          this.$parent.alert(response.data)
        })
      },
      showLogin: function () {
        this.loginState = 'is-active'
      },
      showMessageBox: function (title, body, buttons, callback) {
        this.messageBox.title = title
        this.messageBox.body = body
        this.messageBox.buttons = buttons
        this.messageBox.callback = callback
        this.messageBox.class['is-active'] = true
      },
      messageBoxClicked: function (index) {
        let ret = this.messageBox.buttons[index].ret
        this.messageBox.class['is-active'] = false
        this.messageBox.callback(ret)
      }
    }
  }
</script>

<style>
  @import "../assets/css/bulma.css";
</style>
