<template>
  <div :class="classes.template">
    <div class="columns">
      <!--已添加数据库列表-->
      <div class="column is-one-third">
        <nav class="panel">
          <p class="panel-heading">
            已添加数据库
            <a class="button right is-info" @click="saveAll">保存全部</a>
          </p>
          <div class="panel-block" v-for="database in databases">
            <span class="tag">{{database.database}}</span>
            <label class="tag">{{ database.uid }}@{{ database.server }}:{{ database.port }}</label>
            <span class="tag is-success">{{ database.type }}</span>
            <p class="control has-addons right center">
              <a class="button is-small" @click="dbConfigure($index)">配置</a>
              <a class="button is-small is-danger" @click="removeDatabase($index)">删除</a>
            </p>
            <div v-if="database.editing">
              <table class="table">
                <thead>
                <th>
                  <p>选择表</p>
                </th>
                </thead>
                <tbody>
                <tr>
                  <td>
                    <p class="control has-addons">
                      <input class="input" type="text" placeholder="Find a repository">
                      <a class="button is-info center">
                        搜索
                      </a>
                    </p>
                  </td>
                </tr>
                <tr v-for="table in database.append_table">
                  <td>
                    <p class="control">
                      <label class="checkbox tag is-info">
                        <input type="checkbox" checked @click="tableClicked($index, 'unchecked')">
                        {{ table.name }}
                      </label>
                      <a class="button is-small right" @click="tableEdit($index)">编辑</a>
                    </p>
                  </td>
                </tr>
                <tr v-for="table in database.tables">
                  <td>
                    <p class="control">
                      <label class="checkbox tag">
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
          <div class="panel-block">
            <a class="button is-info add" @click="addInstance('open')">
              <span>添加实例</span>
            </a>
          </div>
        </nav>
      </div>
      <!--数据库配置详细页面-->
      <div class="column">
        <nav class="panel">
          <p class="panel-heading">
            表配置
          </p>
          <div class="panel-block" v-if="currentTable">
            <p>预览及字段选择</p>
            <table class="table is-bordered is-striped is-narrow">
              <thead>
                <th v-for="field in currentTable.fields">
                  <label class="checkbox tag">
                    <input type="checkbox" id="{{field.name}}" value="{{field.name}}" v-model="currentTable.select">
                    {{ field.name }}
                  </label>
                  <em class="">{{ field.type }}</em>
                </th>
              </thead>
            </table>
            <p>{{ currentTable.select }}</p>
          </div>
        </nav>
        <nav class="panel">
          <p class="panel-heading">同步设置</p>
          <div class="panel-block" v-if="currentTable">
            <p class="control">
              <span class="help is-info">增量条件</span>
              <span class="select">
                <select v-model="currentTable.index_field.name">
                  <option value="">请选择增量字段</option>
                  <option v-for="field in currentTable.fields">{{ field.name }}</option>
                </select>
              </span>
              <span class="select">
                <select v-model="currentTable.index_field.type">
                  <option value="">请选增量方式</option>
                  <option value="$value$">保存最大值自动递增</option>
                  <option value=">">大于</option>
                  <option value=">=">大于等于</option>
                  <option value="=">等于</option>
                  <option value="<">小于</option>
                  <option value="<=">小于等于</option>
                  <option value="like">相似</option>
                  <option value="<>">不等于</option>
                </select>
              </span>
            </p>
            <p class="control">
              <span class="help is-info">单次上传条数</span>
              <span class="">
                <input type="range" min="1000" max="50000" step="1000" v-model="currentTable.fetch_rows"/>
                {{ currentTable.fetch_rows }}
              </span>
            </p>
          </div>
        </nav>
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
            value: '127.0.0.1',
            help: ''
          },
          port: {
            value: '3306',
            help: ''
          },
          uid: {
            value: 'root',
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
            value: 'MYSQL',
            help: ''
          },
          databases: [],
          connected: false
        },
        databases: [
        ],
        currentDatabase: null,
        currentTable: null
      }
    },
    ready: function () {
      this.$http.get('/api/database').then(
        function (response) {
          for (var i = 0; i < response.data.length; i++) {
            var database = response.data[i]
            database.tables = []
            database.editing = false
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
        this.currentDatabase.editing = !this.currentDatabase.editing
        if (!this.currentDatabase.hasOwnProperty('loaded')) {
          var exists = []
          for (var i in this.currentDatabase.append_table) {
            exists.push(this.currentDatabase.append_table[i].name)
          }
          var data = {
            exists: exists,
            _id: this.currentDatabase._id
          }
          this.$http.post('/api/table/filter', data).then(function (response) {
            this.currentDatabase.tables = response.data
            this.currentDatabase.loaded = true
          }, function (response) {
            console.error(response.data)
          })
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
      tableEdit: function (index) {
        this.currentTable = this.currentDatabase.append_table[index]
        if (!this.currentTable.hasOwnProperty('index_field')) {
          this.currentTable.index_field = {name: ''}
        }
        if (!this.currentTable.hasOwnProperty('loaded')) {
          var params = {
            _id: this.currentDatabase._id,
            name: this.currentTable.name
          }
          this.$http.get('/api/table/preview', params).then(function (response) {
            this.currentTable.fields = response.data.fields
            this.currentTable.data = response.data.data
            this.currentTable.loaded = true
          }, function (response) {
            console.error(response.data)
          })
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
                append_table: [],
                tables: [],
                editing: false
              }

              this.$http.post('/api/database', data).then(function (response) {
                this.databases.push(response.data)
                this.classes.newInstance['is-active'] = false
              }, function (response) {
                console.error(response.data)
              })
            }
          }
        }
      },
      removeDatabase: function (index) {
        var removed = this.databases[index]
        this.$http.delete('/api/database', removed).then(function (response) {
          if (response.data === 'success') {
            this.databases.splice(index, 1)
            if (removed === this.currentDatabase) {
              this.currentDatabase = null
            }
          }
        }, function (resposnse) {
          console.error(resposnse.data)
        })
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
      },
      saveAll: function () {
        this.$http.post('/api/save', JSON.stringify(this.databases)).then(function (response) {
          console.info(response.data)
        }, function (response) {
          console.error(response.data)
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
    margin-top: 0px;
  }
  .add{
    width: 100%;
    margin-top: 0;
  }
</style>
