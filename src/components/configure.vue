<template>
  <div :class="classes.template">
    <div class="columns">
      <!--已添加数据库列表-->
      <div class="column is-one-third database">
        <nav class="panel">
          <p class="panel-heading has-addons">
            已添加数据库
            <a class="button right is-outlined is-success" @click="addInstance('open')">添加实例</a>
            <a class="button right is-info" @click="saveAll">保存全部</a>
            <p class="control">
              <input class="input" type="text" placeholder="搜索表" v-model="tableSearch">
            </p>
          </p>
          <div class="panel-block" v-for="database in databases">
            <div  class="">
              <ul class="">
                <li>
                  <label class="tag">{{ database.uid }}@{{ database.server }}:{{ database.port }}</label>
                  <span class="tag">{{ database.database }}</span>
                  <span class="tag is-success">{{ database.type }}</span>
                  <p class="control has-addons right center">
                    <a class="button is-small" @click="dbConfigure($index)">配置</a>
                    <a class="button is-small is-danger" @click="removeDatabase($index)">删除</a>
                  </p>
                  <ul v-if="database.editing" class="tree">
                    <li class="tree-input">
                      <input class="input" placeholder="数据源名称(可选)" v-model="database.ds_name">
                    </li>
                    <li v-for="table in database.append_table | filterBy tableSearch">
                      <p class="control tag is-info">
                        <label>
                          <input type="checkbox" checked @click="tableClicked($index, 'unchecked')">
                          {{ table.name }}
                        </label>
                      </p>
                      <a class="button is-small right" @click="tableEdit($index)">编辑</a>
                    </li>
                    <li v-for="table in database.tables | filterBy tableSearch">
                      <p class="control tag">
                        <label>
                          <input type="checkbox" @click="tableClicked($index, 'checked')">
                          {{ table.name }}
                        </label>
                      </p>
                      <a class="button is-small right is-hidden">编辑</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
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
            <p class="heading">预览及字段选择</p>
            <p class="control">
              <a class="button is-primary" @click="selectAll">全选</a>
            </p>
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
          </div>
        </nav>
        <nav class="panel">
          <p class="panel-heading">同步设置</p>
          <div class="panel-block" v-if="currentTable">
            <p class="control has-addons">
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
              <span>
                <input type="text" class="input" placeholder="值(最大值自增不需要填)" v-model="currentTable.index_field.value">
              </span>
            </p>
            <!--<p class="control">-->
              <!--<span class="help is-info">当前主键</span>-->
              <!--<span class="select">-->
                <!--<select v-model="currentTable.keys" aria-multiselectable="true">-->
                  <!--<option >sdf</option>-->
                  <!--<option >sdf</option>-->
                  <!--<option >sdf</option>-->
                <!--</select>-->
              <!--</span>-->
            <!--</p>-->
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
        <div v-if="visible.server">
          <label class="label">服务器地址</label>
          <p class="control">
            <input class="input is-success" type="text" placeholder="必填" v-model="newInstance.server.value">
            <i class="fa fa-check"></i>
            <span class="help is-success">{{newInstance.server.help}}</span>
          </p>
        </div>

        <div v-if="visible.port">
          <label class="label">服务器端口</label>
          <p class="control has-icon has-icon-right">
            <input class="input is-success" type="text" v-model="newInstance.port.value" placeholder="必填">
            <i class="fa fa-check"></i>
            <span class="help is-success">{{newInstance.port.help}}</span>
          </p>
        </div>

        <div v-if="visible.uid">
          <label class="label">用户名</label>
          <p class="control has-icon has-icon-right">
            <input class="input is-success" type="text" v-model="newInstance.uid.value">
            <i class="fa fa-check"></i>
            <span class="help is-success">{{newInstance.uid.help}}</span>
          </p>
        </div>

        <div v-if="visible.pwd">
          <label class="label">密码</label>
          <p class="control has-icon has-icon-right">
            <input class="input is-success" type="password" v-model="newInstance.pwd.value">
            <i class="fa fa-check"></i>
            <span class="help is-success">{{newInstance.pwd.help}}</span>
          </p>
        </div>

        <div v-if="visible.sid">
          <label class="label">SID</label>
          <p class="control has-icon has-icon-right">
            <input class="input is-success" type="text" v-model="newInstance.sid.value">
            <i class="fa fa-check"></i>
            <span class="help is-success">{{newInstance.sid.help}}</span>
          </p>
        </div>

        <div v-if="visible.odbc">
          <label class="label">数据源名称(仅限Windows 32)</label>
          <p class="control has-icon has-icon-right">
            <input class="input is-success" type="text" v-model="newInstance.server.value" placeholder="必填">
            <i class="fa fa-check"></i>
            <span class="help is-success">{{newInstance.server.help}}</span>
          </p>
        </div>

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
          <label class="radio">
            <input type="radio" name="question" value="ODBC" v-model="newInstance.type.value">
            ODBC
          </label>
        </p>

        <label class="label">数据库名</label>
        <div class="level">
          <p class="control has-icon has-icon-right level-left">
            <div class="level-item">
              <span class="select">
                <select v-model="newInstance.database.value">
                  <option v-for="database in newInstance.databases">{{database}}</option>
                </select>
              </span>
            </div>
            <div class="level-item">
              <label class="is-info is-success">{{ newInstance.successTip }}</label>
            </div>
          </p>
        </div>

      </section>
      <footer class="modal-card-foot">
        <a class="button is-primary" @click="connection" :class="[connectButtonClass,classes.newInstanceConnect]">测试连接</a>
        <a class="button is-primary right" @click="addInstance('confirm')" :class="[classes.newInstanceConfirm,disabled.newInstanceConfirm]">确认</a>
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
          },
          newInstanceConnect: {
            'is-loading': false
          },
          newInstanceConfirm: {
            'is-loading': false
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
            value: 'MYSQL',
            help: ''
          },
          sid: {
            value: ''
          },
          databases: [],
          connected: false,
          successTip: ''
        },
        databases: [
        ],
        currentDatabase: null,
        currentTable: null,
        tableSearch: ''
      }
    },
    computed: {
      connectButtonClass: function () {
        var disabled = false
        if (!(this.newInstance.server.value && this.newInstance.port.value) && this.newInstance.type.value !== 'ODBC') {
          disabled = true
        } else if (!(this.newInstance.server.value)) {
          disabled = true
        }
        return {
          'is-disabled': disabled
        }
      },
      visible: function () {
        var server = false
        var port = false
        var uid = false
        var pwd = false
        var sid = false
        var odbc = false
        var input = this.newInstance

        if (input.type.value === 'ODBC') {
          odbc = true
        } else if (input.type.value === 'ORACLE') {
          server = port = uid = pwd = sid = true
        } else {
          server = port = uid = pwd = true
        }

        return {
          server: server,
          port: port,
          uid: uid,
          pwd: pwd,
          sid: sid,
          odbc: odbc
        }
      },
      disabled: function () {
        var newInstanceConfirm = !this.newInstance.connected
        return {
          newInstanceConfirm: {
            'is-disabled': newInstanceConfirm
          }
        }
      }
    },
    ready: function () {
    },
    methods: {
      show: function () {
        this.classes.template['is-hidden'] = false
      },
      hidden: function () {
        this.classes.template['is-hidden'] = true
      },
      loadConfigure: function (from) {
        this.$http.get('/api/database').then(
          function (response) {
            for (var i = 0; i < response.data.length; i++) {
              var database = response.data[i]
              database.tables = []
              database.editing = false
              database.search = ''
              this.databases.push(database)
            }
            this.$parent.userOpt = '注销'
          },
          function (response) {
            if (from === 'init') {
              window.alert(response.data)
            } else {
              if (response.status === 401) {
                this.$parent.isLogin = false
                this.$parent.showLogin()
              }
            }
          }
        )
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
            window.alert(response.data)
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
            this.currentTable.keys = []
            for (var i in response.data.fields) {
              if (response.data.fields[i].key) {
                this.currentTable.keys.push(response.data.fields[i].name)
              }
            }
          }, function (response) {
            window.alert(response.data)
          })
        }
      },
      selectAll: function () {
        for (var i in this.currentTable.fields) {
          this.currentTable.select.push(this.currentTable.fields[i].name)
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
                sid: this.newInstance.sid.value,
                append_table: [],
                tables: [],
                ds_name: '',
                editing: false
              }
              if (data.database === '') {
                window.alert('请选择数据库')
              } else {
                this.classes.newInstanceConfirm['is-loading'] = true
                this.$http.post('/api/database', data).then(function (response) {
                  this.databases.push(response.data)
                  this.classes.newInstance['is-active'] = false
                  this.classes.newInstanceConfirm['is-loading'] = false
                }, function (response) {
                  window.alert(response.data)
                  this.classes.newInstanceConfirm['is-loading'] = false
                })
              }
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
        }, function (response) {
          window.alert(response.data)
        })
      },
      connection: function () {
        var data = {
          server: this.newInstance.server.value,
          port: this.newInstance.port.value,
          uid: this.newInstance.uid.value,
          pwd: this.newInstance.pwd.value,
          type: this.newInstance.type.value,
          database: this.newInstance.database.value,
          sid: this.newInstance.sid.value
        }
        if (isNaN(data.port)) {
          window.alert('端口必须为数字')
          this.newInstance.successTip = ''
        } else {
          this.newInstance.connected = false
          this.classes.newInstanceConnect['is-loading'] = true
          this.$http.post('/api/connect', data).then(function (response) {
            this.newInstance.databases = response.data
            this.newInstance.connected = true
            this.classes.newInstanceConnect['is-loading'] = false
            this.newInstance.successTip = '连接成功'
            this.newInstance.database.value = response.data[0]
          }, function (response) {
            window.alert(response.data)
            this.classes.newInstanceConnect['is-loading'] = false
          })
        }
      },
      saveAll: function () {
        this.$http.post('/api/save', JSON.stringify(this.databases)).then(function (response) {
          window.alert('保存成功')
        }, function (response) {
          window.alert(response.data)
        })
      }
    }
  }
</script>

<style>
  @import "../assets/css/bulma.css";
  .center{
    text-align: center;
  }

  .table-view {
    max-height: 300px;
    overflow: scroll;
    width: auto;
  }

  .right {
    float: right;
    margin-top: 0;
    margin-left: 8px;
  }

  /**
   * Framework starts from here ...
   * ------------------------------
   */

  .tree,
  .tree ul {
    margin:0 0 0 1em; /* indentation */
    padding:0;
    list-style:none;
    color:#369;
    position:relative;
  }

  .tree ul {margin-left:.5em} /* (indentation/2) */

  .tree:before,
  .tree ul:before {
    content:"";
    display:block;
    width:0;
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    border-left:1px solid;
  }

  .tree li {
    margin:0;
    padding:0.2em 1.5em; /* indentation + .5em */
    line-height:2em; /* default list item's `line-height` */
    font-weight:bold;
    position:relative;
  }

  .tree-input:before {
    margin-bottom: 20px;
    border-top:2px solid;
    margin-top:12px !important; /* border top width */
  }

  .tree li:before {
    content:"";
    display:block;
    width:15px; /* same with indentation */
    height:0;
    border-top:2px solid;
    margin-top:-2px; /* border top width */
    position:absolute;
    top:1em; /* (line-height/2) */
    left:0;
  }


  .tree li:last-child:before {
    background:#f5f7fa; /* same with body background */
    height:auto;
    top:1em; /* (line-height/2) */
    bottom:0;
  }
</style>
