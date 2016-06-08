<template>
  <div class="modal {{ state }}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">请登录</p>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <p class="control">
          <input class="input" placeholder="企业域" v-model="domain">
        </p>
        <p class="control">
          <input class="input" placeholder="用户名" v-model="username">
        </p>
        <p class="control">
          <input class="input" type="password" placeholder="密码" v-model="password">
        </p>
      </section>
      <footer class="modal-card-foot">
        <a class="button is-primary" @click="login">登录</a>
      </footer>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        domain: '',
        username: '',
        password: '',
        state: 'is-active'
      }
    },
    methods: {
      login: function () {
        this.state = ''
      }
    }
  }
</script>

<style>
  @import "../assets/css/bulma.css";
</style>
