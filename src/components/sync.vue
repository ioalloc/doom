<template>
  <div :class="templateClass">
    <p>sync</p>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        templateClass: {
          'is-hidden': true
        }
      }
    },
    methods: {
      show: function () {
        this.templateClass['is-hidden'] = false
      },
      hidden: function () {
        this.templateClass['is-hidden'] = true
      }
    }
  }
</script>

<style>
</style>
