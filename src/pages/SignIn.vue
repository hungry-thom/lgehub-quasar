<template>
  <q-page class="flex flex-center">
    <q-dialog v-model="showDialog" :title="title" @ok="onOk" @hide="onHide" @show="onFocus" >
      <div slot="body">
        <div class="row q-mb-md">
          <q-input
            v-model="email" type="email" name="email" stack-label="E-mail" class="full-width" ref="mail"
          />
        </div>
        <div class="row">
          <q-input
            v-model="password" type="password" name="email" stack-label="Password" class="full-width" @keyup.enter="onOk"
          />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import auth from 'src/auth'
import {
  QInput
} from 'quasar'

export default {
  data () {
    return {
      showDialog: true,
      email: null,
      password: null,
      title: null
    }
  },
  components: {
    QInput
  },
  computed: {
  },
  methods: {
    onFocus () {
      this.$refs.mail.focus()
    },
    goHome() {
      // this.$router.push({ name: 'home' })
      setTimeout(() => {
        this.$router.go(-1)
      }, 150)
      console.log('hide')
      // this.$q.loading.hide()
    },
    onHide() {
      // Workaround needed because of timing issues (sequencing of 'hide' and 'ok' events) ...
      // does not execute on 'keydown:Enter'
      setTimeout(() => {
        console.log('timeout')
        this.goHome()
      }, 10)
      console.log('does onHide() execute with onOk()?')
    },
    onOk(data) {
      this.$q.loading.show({
        // delay: 10 // ms
      })
      if (this.isRegistration()) {
        this.register(this.email, this.password)
          .then(() => {
            return this.login(this.email, this.password)
          })
          .then(_ => {
            this.$q.notify({type: 'positive', message: 'You are now logged in'})
          })
          .catch(_ => {
            this.$q.notify({type: 'positive', message: 'Cannot register, please check your e-mail or password'})
            this.goHome()
          })
      } else {
        this.login(this.email, this.password)
          .then(_ => {
            this.$q.notify({type: 'positive', message: 'You are now logged in'})
            this.$q.loading.hide()
            // this.goHome()
          })
          .catch(_ => {
            this.$q.notify({type: 'positive', message: 'Cannot sign in, please check your e-mail or password'})
            this.goHome()
          })
      }
    },
    isRegistration () {
      return this.$route.name === 'register'
    },
    register (email, password) {
      return auth.register(email, password)
    },
    login (email, password) {
      return auth.login (email, password)
    }
  },
  mounted () {
    this.title = this.isRegistration() ? 'Register' : 'Sign In'
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">
</style>