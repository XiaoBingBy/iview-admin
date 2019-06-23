<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form :loading="loading" @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.loading = true
      this.handleLogin({ userName, password }).then(res => {
        this.loading = false
        let { code } = res
        if (code === 200) {
          this.$Message.success('登录成功')
        }
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        }).catch(() => {
          this.loading = false
          this.$Message.warning('连接服务器失败')
        })
      }).catch(() => {
        this.loading = false
        this.$Message.warning('连接服务器失败')
      })
    }
  }
}
</script>

<style>

</style>
