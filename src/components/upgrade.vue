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
                <a class="button is-primary">更新</a>
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
        changeLog: '已是最新版本',
        isNotLatest: false
      }
    },
    methods: {
      init: function () {
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
