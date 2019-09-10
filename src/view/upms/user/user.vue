<template>
  <div>
    <Card>
      <Row>
        <Form ref="formInline" inline :label-width="70">
          <Form-item label="用户名">
            <Input v-model="filter.querys[0].value" type="text" clearable placeholder="请输入用户名"/>
          </Form-item>
          <Form-item label="昵称">
            <Input v-model="filter.querys[1].value" type="text" clearable placeholder="请输入昵称"/>
          </Form-item>

          <Form-item class="mr-search">
            <Button type="primary" icon="ios-search" @click="handleSearch">搜索</Button>
            <Button @click="handleReset">重置</Button>
          </Form-item>
        </Form>
      </Row>

      <Row class="operation" type="flex" justify="space-between">
        <div class="operation-group">
          <Button type="primary" icon="md-add" @click="addUser">添加</Button>
          <Button icon="md-trash" @click="deleUser">删除</Button>
        </div>

        <Button icon="md-refresh" class="right" @click="handleSearch">刷新</Button>
      </Row>

      <Row>
        <Table border stripe :columns="table.columns" :data="table.data" :loading="table.loading"
               @on-selection-change="onSelectionChange">
        </Table>
      </Row>

      <Row type="flex" justify="center" class="page">
        <Page show-sizer :total="table.total" @on-change="onChange" @on-page-size-change="onPageSizeChange" />
      </Row>
    </Card>

    <Modal ref="addOrUpdateModal" v-model="view.showAddOrUpdateModal" :title="view.addOrUpdateTitle" :mask-closable="false" ok-text="提交" :loading="true" @on-ok="onOk" :width="600">
      <Form ref="addOrUpdateFormRef" :model="addOrUpdateUserDto" :rules="userRuleValidate" :label-width="80">
        <FormItem prop="username" label="用户名">
          <Input v-model="addOrUpdateUserDto.username"></Input>
        </FormItem>
        <FormItem prop="nickname" label="昵称">
          <Input v-model="addOrUpdateUserDto.nickname"></Input>
        </FormItem>
        <FormItem prop="phone" label="手机号">
          <Input v-model="addOrUpdateUserDto.phone"></Input>
        </FormItem>
        <FormItem prop="email" label="邮箱">
          <Input v-model="addOrUpdateUserDto.email"></Input>
        </FormItem>
        <FormItem label="状态">
          <i-switch size="large" v-model="addOrUpdateUserDto.status" :true-value="1" :false-value="0">
            <span slot="open">正常</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <FormItem label="角色">
          <Select
            v-model="addOrUpdateUserDto.roleIds"
            multiple
            filterable
            remote
            :remote-method="selectRemoteMethod"
            :loading="view.selectRemoteMethodLoading">
            <Option v-for="(item, index) in selectRoleDto" :value="item.id" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getUserList, apiAddUser, apiUpdateUser, apiUserRolesInfo, apiDeleteUser } from '@/api/upms/user'
import { apiQueryRole } from '@/api/upms/role'

export default {
  name: 'user',
  data () {
    return {
      view: {
        showAddOrUpdateModal: false,
        addOrUpdateTitle: '',
        isAddOrUpdate: false,
        selectRemoteMethodLoading: true
      },
      filter: {
        querys: [
          {
            column: 'username',
            type: 'eq',
            value: ''
          },
          {
            column: 'nickname',
            type: 'eq',
            value: ''
          }
        ],
        current: 1,
        pageSize: 10
      },
      table: {
        loading: false,
        total: 0,
        data: [],
        selectionData: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'ID',
            width: 170,
            key: 'id',
            align: 'center'
          },
          {
            title: '用户名',
            key: 'username',
            align: 'center'
          },
          {
            title: '昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'phone',
            width: 150,
            align: 'center'
          },
          {
            title: '邮箱',
            key: 'email',
            width: 150,
            align: 'center'
          },
          {
            title: '状态',
            key: 'status',
            width: 100,
            align: 'center',
            render: (h, params) => {
              if (params.row.status === 0) {
                return h('div', [
                  h('tag', {
                    props: {
                      color: 'warning'
                    }
                  }, '禁用')
                ])
              } else if (params.row.status === 1) {
                return h('div', [
                  h('tag', {
                    props: {
                      color: 'success'
                    }
                  }, '正常')
                ])
              }
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 150,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 130,
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.updateUser(params.row)
                      }
                    }
                  },
                  '修改'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.deletOneUser(params.row)
                        console.log(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ]
      },
      addOrUpdateUserDto: {
      },
      selectRoleDto: [],
      userRuleValidate: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getList()
    },
    handleSearch () {
      this.getList()
    },
    handleReset () {
      this.filter.querys[0].value = ''
      this.filter.querys[1].value = ''
    },
    getList () {
      this.table.loading = true
      getUserList(this.filter).then(res => {
        this.filter.current = res.data.current
        this.filter.pageSize = res.data.size
        this.table.data = res.data.records
        this.table.total = res.data.total
        this.table.loading = false
      })
    },
    onSelectionChange (e) {
      this.table.selectionData = e
    },
    onChange (current) {
      this.filter.current = current
      this.getList()
    },
    onPageSizeChange (pageSize) {
      this.filter.pageSize = pageSize
      this.getList()
    },
    async addUser () {
      this.view.addOrUpdateTitle = '添加用户'
      this.$refs.addOrUpdateFormRef.resetFields()
      this.addOrUpdateUserDto = {
        username: '',
        nickname: '',
        phone: '',
        email: '',
        status: 1,
        roleIds: []
      }
      await this.getApiQueryRole()
      this.view.isAddOrUpdate = true
      this.view.showAddOrUpdateModal = true
    },
    async updateUser (row) {
      this.view.addOrUpdateTitle = '修改用户'
      this.$refs.addOrUpdateFormRef.resetFields()
      await this.getApiQueryRole()
      // 调用接口查询数据
      await apiUserRolesInfo(row.id).then(res => {
        let { id, username, nickname, phone, email, status, roleIds } = res.data
        this.addOrUpdateUserDto = { id, username, nickname, phone, email, status, roleIds }
        this.view.isAddOrUpdate = false
        this.view.showAddOrUpdateModal = true
      })
    },
    onOk () {
      this.$refs.addOrUpdateFormRef.validate(valid => {
        if (valid) {
          if (this.view.isAddOrUpdate) {
            apiAddUser(this.addOrUpdateUserDto).then(res => {
              this.$Message.success('添加成功')
              this.view.showAddOrUpdateModal = false
              this.getList()
            })
          } else {
            apiUpdateUser(this.addOrUpdateUserDto).then(res => {
              this.$Message.success('修改成功')
              this.view.showAddOrUpdateModal = false
              this.getList()
            })
          }
        } else {
          this.$refs.addOrUpdateModal.buttonLoading = false
        }
      })
    },
    deleUser () {
      if (this.table.selectionData.length <= 0) {
        this.$Message.warning('请选择要删除的数据')
        return
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除所选的 ' + this.table.selectionData.length + ' 条数据?',
        onOk: () => {
          let ids = ''
          this.table.selectionData.forEach(function (e) {
            ids += e.id + ','
          })
          ids = ids.substring(0, ids.length - 1)
          apiDeleteUser(ids).then(res => {
            this.$Message.success('删除成功')
            this.init()
          })
        }
      })
    },
    deletOneUser: function (row) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除用户' + row.username + ' ?',
        onOk: () => {
          let ids = ''
          ids = row.id
          apiDeleteUser(ids).then(res => {
            this.$Message.success('删除成功')
            this.init()
          })
        }
      })
    },
    selectRemoteMethod: function (query) {
      this.getApiQueryRole(query)
    },
    getApiQueryRole (roleName = '') {
      this.view.selectRemoteMethodLoading = true
      apiQueryRole(roleName).then(res => {
        this.view.selectRemoteMethodLoading = false
        this.selectRoleDto = res.data
      })
    }
  }
}
</script>

<style scoped>
  .mr-search button {
    margin-right: 5px;
  }
  .operation .operation-group button {
    margin-right: 4px;
  }
  .operation {
    margin-bottom: 2vh;
  }
  .page {
    margin-top: 2vh;
  }
</style>
