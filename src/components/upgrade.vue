<template>
  <div :class="templateClass">
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <div class="content">
          <article class="message is-primary">
            <div class="message-header">
              版本更新
            </div>
            <div class="message-body">
              {{ changeLog }}
              <p class="control" v-if="isNotLatest">
                <a class="button is-primary" @click="upgrade" :class="classes.upgradeButton">更新</a>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        templateClass: {
          'is-hidden': true
        },
        classes: {
          upgradeButton: {
            'is-loading': false
          }
        },
        changeLog: '已是最新版本',
        isNotLatest: false
      }
    },
    methods: {
      init: function () {
        this.$http.get('/api/changelog').then(function (response) {
          if (response.data.has_new_version) {
            this.changeLog = response.data
            this.isNotLatest = true
          }
        })
      },
      upgrade: function () {
        this.$http.get('/api/upgrade').then(function (response) {
          this.classes['is-loading'] = true
        })
      },
      show: function () {
        this.templateClass['is-hidden'] = false
        this.init()
      },
      hidden: function () {
        this.templateClass['is-hidden'] = true
      }
    }
  }
</script>

<style>
  @import "../assets/css/bulma.css";
</style>
