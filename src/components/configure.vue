<template>
  <div :class="classes.template">
    <div class="columns">
      <!--已添加数据库列表-->
      <div class="column is-one-third">
        <table class="table">
          <thead>
            <tr>
              <th>实例</th>
              <th>类型</th>
              <th>数据库</th>
              <th><p class="center">操作</p></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="database in databases">
              <td>
                <a>{{ database.server }}:{{ database.port }}</a>
              </td>
              <td>{{ database.type }}</td>
              <td>{{ database.database }}</td>
              <td>
                <a class="button is-small" @click="dbConfigure($index)">配置</a>
                <a class="button is-small is-danger" @click="removeDatabase($index)">删除</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="center">
          <a class="button is-info add" @click="addInstance('open')">
            <span>添加实例</span>
          </a>
        </div>
      </div>
      <!--数据库配置详细页面-->
      <div class="column">
        <div class="columns tile">
          <div class="column is-3">
            <table class="table">
              <thead>
                <th>
                  <p>选择表</p>
                </th>
              </thead>
              <tbody v-if="currentDatabase">
                <tr>
                  <td>
                    <p class="control has-addons">
                      <input class="input" type="text" placeholder="Find a repository">
                      <a class="button is-info">
                        搜索
                      </a>
                    </p>
                  </td>
                </tr>
                <tr v-for="table in currentDatabase.append_table">
                  <td>
                    <p class="control">
                      <label class="checkbox">
                        <input type="checkbox" checked @click="tableClicked($index, 'unchecked')">
                          {{ table.name }}
                      </label>
                      <a class="button is-small right" @click="tableEdit($index)">编辑</a>
                    </p>
                  </td>
                </tr>
                <tr v-for="table in currentDatabase.tables">
                  <td>
                    <p class="control">
                      <label class="checkbox">
                        <input type="checkbox" @click="tableClicked($index, 'checked')">
                        {{ table.name }}
                      </label>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--添加新数据库对话框-->
  <div class="modal" :class="classes.newInstance">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">添加新数据库实例</p>
        <button class="delete" @click="addInstance('cancel')"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <label class="label">服务器地址</label>
        <p class="control">
          <input class="input is-success" type="text" placeholder="" v-model="newInstance.server.value">
          <i class="fa fa-check"></i>
          <span class="help is-success">{{newInstance.server.help}}</span>
        </p>

        <label class="label">服务器端口</label>
        <p class="control has-icon has-icon-right">
          <input class="input is-success" type="text" v-model="newInstance.port.value">
          <i class="fa fa-check"></i>
          <span class="help is-success">{{newInstance.server.help}}</span>
        </p>

        <label class="label">用户名</label>
        <p class="control has-icon has-icon-right">
          <input class="input is-success" type="text" v-model="newInstance.uid.value">
          <i class="fa fa-check"></i>
          <span class="help is-success">{{newInstance.server.help}}</span>
        </p>

        <label class="label">密码</label>
        <p class="control has-icon has-icon-right">
          <input class="input is-success" type="text" v-model="newInstance.pwd.value">
          <i class="fa fa-check"></i>
          <span class="help is-success">{{newInstance.server.help}}</span>
        </p>

        <label class="label">类型</label>
        <p class="control">
          <label class="radio">
            <input type="radio" name="question" value="MYSQL" v-model="newInstance.type.value">
            MYSQL
          </label>
          <label class="radio">
            <input type="radio" name="question" value="MSSQL" v-model="newInstance.type.value">
            MSSQL
          </label>
          <label class="radio">
            <input type="radio" name="question" value="ORACLE" v-model="newInstance.type.value">
            ORACLE
          </label>
        </p>

        <label class="label">数据库名</label>
        <p class="control has-icon has-icon-right">
          <span class="select">
            <select v-model="newInstance.database.value">
              <option v-for="database in newInstance.databases">{{database}}</option>
            </select>
          </span>
        </p>

      </section>
      <footer class="modal-card-foot">
        <a class="button is-primary" @click="connection">测试连接</a>
        <a class="button is-primary right" @click="addInstance('confirm')">确认</a>
        <a class="button" @click="addInstance('cancel')">取消</a>
      </footer>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        classes: {
          template: {
            'is-hidden': false
          },
          newInstance: {
            'is-active': false
          }
        },
        newInstance: {
          server: {
            value: '',
            help: ''
          },
          port: {
            value: '',
            help: ''
          },
          uid: {
            value: '',
            help: ''
          },
          pwd: {
            value: '',
            help: ''
          },
          database: {
            value: '',
            help: ''
          },
          type: {
            value: '',
            help: ''
          },
          databases: [],
          connected: false
        },
        databases: [
        ],
        currentDatabase: null
      }
    },
    ready: function () {
      this.$http.get('/api/configure').then(
        function (response) {
          this.databases = []
          for (var i = 0; i < response.data.db.length; i++) {
            var database = response.data.db[i]
            database.tables = []
            this.databases.push(database)
          }
        },
        function (response) {
          console.error(response.data)
        }
      )
    },
    methods: {
      show: function () {
        this.classes.template['is-hidden'] = false
      },
      hidden: function () {
        this.classes.template['is-hidden'] = true
      },
      dbConfigure: function (index) {
        this.currentDatabase = this.databases[index]
        var tables = this.currentDatabase.tables
        if (typeof (tables) === 'undefined') {
          tables = []
        }
        if (tables.length <= 0) {
          console.info(tables)
        }
      },
      tableClicked: function (index, state) {
        var table
        if (state === 'checked') {
          table = this.currentDatabase.tables.splice(index, 1)
          this.currentDatabase.append_table = this.currentDatabase.append_table.concat(table)
        } else if (state === 'unchecked') {
          table = this.currentDatabase.append_table.splice(index, 1)
          this.currentDatabase.tables = this.currentDatabase.tables.concat(table)
        }
      },
      addInstance: function (action) {
        switch (action) {
          case 'open': {
            this.classes.newInstance['is-active'] = true
            break
          }
          case 'cancel': {
            this.classes.newInstance['is-active'] = false
            break
          }
          case 'confirm': {
            if (this.newInstance.connected === true) {
              var data = {
                server: this.newInstance.server.value,
                port: this.newInstance.port.value,
                uid: this.newInstance.uid.value,
                pwd: this.newInstance.pwd.value,
                type: this.newInstance.type.value,
                database: this.newInstance.database.value,
                append_table: [{name: 'sds'}],
                tables: []
              }

              this.databases.push(data)
              this.classes.newInstance['is-active'] = false
            }
          }
        }
      },
      removeDatabase: function (index) {
        var removed = this.databases.splice(index, 1)[0]
        if (removed === this.currentDatabase) {
          this.currentDatabase = null
        }
      },
      connection: function () {
        var data = {
          server: this.newInstance.server.value,
          port: this.newInstance.port.value,
          uid: this.newInstance.uid.value,
          pwd: this.newInstance.pwd.value,
          type: this.newInstance.type.value,
          database: this.newInstance.database.value
        }
        this.newInstance.connected = false
        this.$http.post('/api/connect', data).then(function (response) {
          this.newInstance.databases = response.data
          this.newInstance.connected = true
        },
        function (response) {
          window.alert(response.data)
        })
      }
    }
  }
</script>

<style>
  .center{
    text-align: center;
  }
  .right {
    float: right;
  }
  .add{
    width: 100%;
    margin-top: 0;
  }
</style>
