<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code">
      <Row type="flex" justify="space-between" class="code">
        <Input v-model="form.code" :maxlength="4" placeholder="请输入验证码">
          <span slot="prepend">
            <Icon :size="14" type="ios-barcode"></Icon>
          </span>
        </Input>
        <img class="code-img" :src="imgSrc" @click="genCode">
      </Row>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" :loading="loading" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    codeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: 'Admin',
        password: '123456',
        code: '',
        randomNumber: ''
      },
      imgSrc: ''
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        code: this.codeRules
      }
    }
  },
  mounted() {
    this.genCode()
  },
  methods: {
    guid() {
      function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
    },
    genCode() {
      let uid = this.guid();
      this.form.randomNumber = uid;
      this.imgSrc = '/auth/image-code/' + uid
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            code: this.form.code,
            randomNumber: this.form.randomNumber
          })
        }
      })
    }
  }
}
</script>
<style>
  .code {
    flex-wrap: nowrap;
    align-items: center;
  }
  .code-img {
    width: 100px;
  }
</style>
