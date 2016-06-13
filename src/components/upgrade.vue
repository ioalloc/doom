<template>
  <div :class="templateClass">
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <div class="content">
          <article class="message is-primary">
            <div class="message-header">
              版本更新
            </div>
            <div class="message-body" v-if="isNotLatest">
              <div class="card is-fullwidth sky" v-for="changelog in changeLog">
                <header class="card-header">
                  <p class="card-header-title">
                    版本: {{ changelog.version }}
                  </p>
                </header>
                  <div class="card-content">
                    <li v-for="log in changelog.summary">{{ log }}</li>
                    <div class="content">
                      <small class="tag is-info sky">{{ changelog.release_date}}</small>
                    </div>
                  </div>
              </div>
              <p class="control" v-if="isNotLatest">
                <a class="button is-primary sky" @click="upgrade" :class="classes.upgradeButton">{{ button }}</a>
                <progress class="progress is-info sky" v-if="isUpgrading" value="{{ downloaded }}" max="{{ totalSize }}"></progress>
              </p>
            </div>
            <div class="message-body" v-else>
              <p>已是最新版</p>
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
            'is-loading': false,
            'is-disabled': false
          }
        },
        changeLog: '已是最新版本',
        button: '更新',
        isNotLatest: false,
        isUpgrading: false,
        downloaded: 0,
        totalSize: 0,
        timer: null
      }
    },
    computed: {
      process: function () {
        return this.downloaded / this.totalSize
      },
      isLatest: function () {
        return !this.isNotLatest
      }
    },
    methods: {
      init: function () {
        this.$http.get('/api/changelog').then(function (response) {
          if (response.data.has_new_version) {
            this.changeLog = response.data.changelog
            this.isNotLatest = true
          }
        })
      },
      upgrade: function () {
        this.$http.get('/api/upgrade').then(function (response) {
          this.classes.upgradeButton['is-loading'] = true
          this.isUpgrading = true
          this.timer = setTimeout(this.upgrading, 200)
        })
      },
      upgrading: function () {
        this.$http.get('/api/upgrading').then(function (response) {
          var isFinished = false
          for (var i in response.data) {
            var stat = response.data[i]
            if (stat === 'restart') {
              isFinished = true
              clearTimeout(this.timer)
              this.classes.upgradeButton['is-loading'] = false
              this.classes.upgradeButton['is-disabled'] = true
              this.button = '重启后生效'
            } else if (stat.status === 'downloading') {
              this.downloaded = stat.received
              this.totalSize = stat.size
            }
          }
          if (!isFinished) {
            this.timer = setTimeout(this.upgrading, 200)
          }
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
  .sky {
    margin-top: 10px;
  }
</style>
