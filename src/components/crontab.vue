<template>
  <div :class="templateClass">
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <div class="content">
          <article class="message is-primary">
            <div class="message-header">
              创建定时任务
            </div>
            <div class="message-body">
              <label class="label">小时</label>
              <p class="control">
                <input class="input is-primary" type="text" v-model="hour">
              </p>
              <label class="label">分钟</label>
              <p class="control">
                <input class="input is-primary" type="text" v-model="minute">
              </p>
              <label class="label">任务名</label>
              <p class="control">
                <input class="input is-primary" type="text" v-model="taskName">
              </p>
              <a class="button is-primary" @click="createTask">创建</a>
              <table class="table  table-bordered  table-hover" v-if="posix">
                <tr>
                  <th>时</th>
                  <th>分</th>
                  <th>执行周期(说明)</th>
                </tr>
                <tr>
                  <td>*/2</td>
                  <td>0</td>
                  <td>每2小时0分执行一次</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>25</td>
                  <td>8时25分执行一次</td>
                </tr>
                <tr>
                  <td>8,12,23</td>
                  <td>25</td>
                  <td>8时25分、12时25和23时25分执行一次</td>
                </tr>
                <tr>
                  <td>8-12</td>
                  <td>25</td>
                  <td>8时、9时、10时、11时和12时的25分分别执行一次</td>
                </tr>
              </table>
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
        hour: 0,
        minute: 0,
        platform: null,
        taskName: 'bdp'
      }
    },
    computed: {
      windows: function () {
        return this.platform === 'nt'
      },
      posix: function () {
        return this.platform === 'posix'
      }
    },
    methods: {
      init: function () {
        this.$http.get('/api/info').then(function (response) {
          this.platform = response.data.platform
          this.taskName = response.data.taskName
        })
      },
      show: function () {
        this.templateClass['is-hidden'] = false
        this.init()
      },
      hidden: function () {
        this.templateClass['is-hidden'] = true
      },
      createTask: function () {
        this.$http.post('/api/crontab', {hour: this.hour, minute: this.minute}).then(function (response) {
          window.alert('创建成功')
        }, function (response) {
          window.alert(response.data)
        })
      }
    }
  }
</script>

<style>
  @import "../assets/css/bulma.css";
</style>
