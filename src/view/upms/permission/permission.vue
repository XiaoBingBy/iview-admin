<template>
  <div>
    <Card>
      <Row class="operation">
        <div class="operation-group">
          <Button type="primary" icon="md-add" @click="addPermission(0)">添加一级菜单</Button>
          <Button type="primary" icon="md-add" @click="addPermission(1)">添加子节点</Button>
          <Button icon="ios-trash" @click="deletePermission">删除菜单</Button>
          <Button icon="md-barcode"  @click="init">刷新</Button>
        </div>
      </Row>

      <Row type="flex" justify="start">
        <Col span="6">
          <Alert show-icon v-if="!view.updatePermissionLoading">当前选择：{{view.selectTitle}}</Alert>
          <Alert show-icon v-if="view.updatePermissionLoading">暂无选择：</Alert>
          <div class="tree-z" style="position: relative">
            <Tree ref="tree" :data="dataTree" empty-text="暂无数据" show-checkbox @on-select-change="onSelectChangeTree"></Tree>
            <Spin  size="large" fix v-if="view.treeLoading">
              <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
              <div>加载中</div>
            </Spin>
          </div>
        </Col>
        <Col span="14">
          <Form ref="updateFormRef" :model="updatePermissionDto" :rules="permissionRuleValidate" :label-width="80" v-if="!view.updatePermissionLoading">
            <div style="display: flex;justify-content: start;">
              <FormItem label="ID">
                <Input v-model="updatePermissionDto.id" :disabled="true"></Input>
              </FormItem>
              <FormItem label="类型">
                <RadioGroup v-model="updatePermissionDto.type">
                  <Radio :label="1" :disabled="updatePermissionDto.type == 2">
                    <Icon type="md-menu" size="16"/>
                    <span>菜单</span>
                  </Radio>
                  <Radio :label="2" :disabled="updatePermissionDto.type == 1">
                    <Icon type="logo-youtube" size="16"/>
                    <span>按钮</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="排序号">
                <InputNumber v-model="updatePermissionDto.sort"></InputNumber>
              </FormItem>
            </div>
            <FormItem prop="title" label="标题">
              <Input v-model="updatePermissionDto.title"></Input>
            </FormItem>
            <FormItem prop="name" label="英文名" v-if="updatePermissionDto.type == 1">
              <Input v-model="updatePermissionDto.name"></Input>
            </FormItem>
            <FormItem prop="path" label="前端路由" v-if="updatePermissionDto.type == 1">
              <Input v-model="updatePermissionDto.path"></Input>
            </FormItem>
            <FormItem prop="component" label="前端组件" v-if="updatePermissionDto.type == 1">
              <Input v-model="updatePermissionDto.component"></Input>
            </FormItem>
            <FormItem prop="icon" label="图标" v-if="updatePermissionDto.type == 1">
              <Input v-model="updatePermissionDto.icon"></Input>
            </FormItem>
            <FormItem prop="permCode" label="权限编码" v-if="updatePermissionDto.type == 2">
              <Input v-model="updatePermissionDto.permCode"></Input>
            </FormItem>
            <FormItem prop="description" label="备注">
              <Input v-model="updatePermissionDto.description" type="textarea"/>
            </FormItem>
            <div style="display: flex;justify-content: space-between;">
              <FormItem label="是否隐藏菜单" :label-width="100" v-if="addPermissionDto.type == 1">
                <RadioGroup v-model="updatePermissionDto.hideInMenu?1:0">
                  <Radio :label="1">
                    是
                  </Radio>
                  <Radio :label="0">
                    否
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="是否隐藏面包屑" :label-width="100" v-if="addPermissionDto.type == 1">
                <RadioGroup v-model="updatePermissionDto.hideInBread?1:0">
                  <Radio :label="1">
                    是
                  </Radio>
                  <Radio :label="0">
                    否
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="是否缓存" :label-width="100" v-if="addPermissionDto.type == 1">
                <RadioGroup v-model="updatePermissionDto.notCache?1:0">
                  <Radio :label="1">
                    是
                  </Radio>
                  <Radio :label="0">
                    否
                  </Radio>
                </RadioGroup>
              </FormItem>
            </div>
            <Form-item>
              <Button type="primary" :loading="view.updateButtonLoading" style="margin-right: 5px;" @click="updatePermission">修改保存</Button>
            </Form-item>
          </Form>
          <Spin size="large" fix v-if="view.updatePermissionLoading">
            <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
            <div>暂无操作</div>
          </Spin>
        </Col>
      </Row>
    </Card>

    <Modal ref="addModal" v-model="view.showAddModal" title="添加权限" :mask-closable="false" ok-text="提交" :loading="true" @on-ok="onOk" :width="600">
      <Form ref="addFormRef" :model="addPermissionDto" :rules="permissionRuleValidate" :label-width="80">
        <div style="display: flex;justify-content: start;">
          <FormItem label="类型">
            <RadioGroup v-model="addPermissionDto.type">
              <Radio :label="1" :disabled="addPermissionDto.type == 2">
                <Icon type="md-menu" size="16"/>
                <span>菜单</span>
              </Radio>
              <Radio :label="2" :disabled="addPermissionDto.type == 1">
                <Icon type="logo-youtube" size="16"/>
                <span>按钮</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="排序号">
            <InputNumber v-model="addPermissionDto.sort"></InputNumber>
          </FormItem>
        </div>
        <FormItem prop="title" label="标题">
          <Input v-model="addPermissionDto.title"></Input>
        </FormItem>
        <FormItem prop="name" label="英文名" v-if="addPermissionDto.type == 1">
          <Input v-model="addPermissionDto.name"></Input>
        </FormItem>
        <FormItem prop="path" label="前端路由" v-if="addPermissionDto.type == 1">
          <Input v-model="addPermissionDto.path"></Input>
        </FormItem>
        <FormItem prop="component" label="前端组件" v-if="addPermissionDto.type == 1">
          <Input v-model="addPermissionDto.component"></Input>
        </FormItem>
        <FormItem prop="icon" label="图标" v-if="addPermissionDto.type == 1">
          <Input v-model="addPermissionDto.icon"></Input>
        </FormItem>
        <FormItem prop="permCode" label="权限编码" v-if="addPermissionDto.type == 2">
          <Input v-model="addPermissionDto.permCode"></Input>
        </FormItem>
        <FormItem prop="description" label="备注">
          <Input type="textarea" v-model="addPermissionDto.description"/>
        </FormItem>
        <div style="display: flex;justify-content: space-between;">
          <FormItem label="是否隐藏菜单" :label-width="100" v-if="addPermissionDto.type == 1">
            <RadioGroup v-model="addPermissionDto.hideInMenu">
              <Radio :label="1">
                是
              </Radio>
              <Radio :label="0">
                否
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否隐藏面包屑" :label-width="100" v-if="addPermissionDto.type == 1">
            <RadioGroup v-model="addPermissionDto.hideInBread">
              <Radio :label="1">
                是
              </Radio>
              <Radio :label="0">
                否
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否缓存" :label-width="100" v-if="addPermissionDto.type == 1">
            <RadioGroup v-model="addPermissionDto.notCache">
              <Radio :label="1">
                是
              </Radio>
              <Radio :label="0">
                否
              </Radio>
            </RadioGroup>
          </FormItem>
        </div>
      </Form>
      <!--<div slot="footer">-->
      <!--<Button type="primary">提交</Button>-->
      <!--</div>-->
    </Modal>
  </div>
</template>

<script>
import { apiGetPermissionTree, apiAddPermission, apiUpdatePermission, apiDeletePermissions } from '@/api/upms/permission'

  export default {
    name: "permission",
    data() {
      return {
        view: {
          treeLoading: true, // tree 加载动画
          updatePermissionLoading: true, // 修改权限加载动画
          selectTitle: '', // 选中 title
          showAddModal: false, // 显示添加Modal
          updateButtonLoading: false
        },
        dataTree: [],
        updatePermissionDto: {},
        addPermissionDto: {},
        permissionRuleValidate: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入英文名', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '请输入前端路由', trigger: 'blur' }
          ],
          component: [
            { required: true, message: '请输入前端组件', trigger: 'blur' }
          ],
          icon: [
            { required: true, message: '请输入图标', trigger: 'blur' }
          ],
          permCode: [
            { required: true, message: '请输入权限编码', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.initPermissionTree()
      },
      initPermissionTree() {
        this.view.updatePermissionLoading = true
        this.view.treeLoading = true
        apiGetPermissionTree().then(res => {
          this.dataTree = res.data
          this.view.treeLoading = false
        })
      },
      onSelectChangeTree(e) {
        let permissionTree = e[0]
        if (permissionTree) {
          this.view.updatePermissionLoading = false
          this.view.selectTitle = permissionTree.title
          this.updatePermissionDto = permissionTree
          this.$refs.updateFormRef.resetFields();
        } else {
          this.view.updatePermissionLoading = true
        }
      },
      deletePermission() {
        if (this.$refs.tree.getCheckedNodes().length <= 0) {
          this.$Message.warning('请选择要删除的数据')
          return
        }
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除所选的 ' + this.$refs.tree.getCheckedNodes().length + ' 条数据?',
          onOk: () => {
            let ids = ''
            this.$refs.tree.getCheckedNodes().forEach(function (e) {
              ids += e.id + ','
            })
            ids = ids.substring(0, ids.length - 1)
            apiDeletePermissions(ids).then(res => {
              this.$Message.success('删除成功')
              this.initPermissionTree()
            })
          }
        })
      },
      addPermission(e) {
        this.$refs.addFormRef.resetFields();
        this.addPermissionDto = {
          id: '',
          type: 1,
          sort: 0,
          title: '',
          name: '',
          path: '',
          component: '',
          icon: '',
          permCode: '',
          description: '',
          hideInMenu: 0,
          hideInBread: 0,
          notCache: 0
        };
        if (e === 0) { // 一级菜单
          this.addPermissionDto.pid = 0
          this.addPermissionDto.type = 1
        } else if (e === 1) { // 子节点
          let selectedNodes = this.$refs.tree.getSelectedNodes()[0]
          if (!selectedNodes) {
            this.$Message.warning('请选择子节点')
            return
          }
          if (selectedNodes.type === 2) {
            this.$Message.warning('按钮下不允许添加')
            return
          }
          this.addPermissionDto.pid = selectedNodes.id
          if (selectedNodes.pid === '0') {
            this.addPermissionDto.type = 1
          } else {
            this.addPermissionDto.type = 2
          }
        }
        this.view.showAddModal = true
      },
      onOk() {
        this.$refs.addFormRef.validate(valid => {
          if (valid) {
            apiAddPermission(this.addPermissionDto).then(res => {
              this.$Message.success('添加成功')
              this.view.showAddModal = false
              this.initPermissionTree()
            })
          } else {
            this.$refs.addModal.buttonLoading = false
          }
        })
      },
      updatePermission() {
        this.$refs.updateFormRef.validate(valid => {
          if (valid) {
            apiUpdatePermission(this.updatePermissionDto).then(res => {
              this.$Message.success('修改成功')
              this.initPermissionTree()
            })
          }
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

  .tree-z {
    min-height: 500px;
    max-height: 500px;
    overflow: auto;
  }

  .tree-z::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .tree-z::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
  }

  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
