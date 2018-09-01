
<template>
  <q-page class="flex flex-center">
      <div class="row full-width">
        <div class="layout-padding col-8" >
          <q-chat-message v-for="item in inventory" :key="item.id"
            :text="[item.item]"
          /> <!-- :avatar="message.avatar" -->
        </div>
        <q-list highlight class="col-auto">
          <q-list-header>People</q-list-header>
          <q-item v-for="user in users" :key="user.id">
            <q-item-side :avatar="user.avatar" />
            <q-item-main>
              <q-item-tile label>{{user.email}}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-item-tile icon="chat_bubble" color="green" />
            </q-item-side>
          </q-item>
        </q-list>
      </div>
    <q-input
        class="row col-12 fixed-bottom chat-message"
        style="z-index: 1001; margin-top: 16px; margin-bottom: 8px;"
        v-model="message"
        v-on:keyup.enter="send"
        type="textarea"
        float-label="Enter your message"
        :min-rows="1"
      />
  </q-page>
</template>

<script>
import moment from 'moment'
import api from 'src/api'
import {
  QChatMessage
} from 'quasar'

export default {
  name: 'chat',
  components: {
    QChatMessage
  },
  props: ['user'],
  data () {
    return {
      message: '',
      messages: [],
      users: [],
      inventory: []
    }
  },
  computed: {
  },
  methods: {
    isSent (message) {
      return (message.userId === this.user._id)
    },
    messageDate (message) {
      return moment(message.createdAt).format('MMM Do, hh:mm:ss')
    },
    send () {
      if (this.$data.message) {
        api.service('messages').create({ text: this.$data.message }).then(() => {
          this.$data.message = ''
        })
      }
    }
  },
  mounted () {
    const messages = api.service('messages')
    const users = api.service('users')
    const inventory = api.service('inventory')
    // Get all users and messages
    messages.find({
      query: {
        $sort: { createdAt: -1 },
        $limit: 25
      }
    })
      .then((response) => {
        // We want the latest messages but in the reversed order
        this.$data.messages = response.data.reverse()
      })
    users.find()
      .then((response) => {
        this.$data.users = response.data
      })
    inventory.find({
      query: {
        $limit: 25
      }
    })
      .then((response) => {
        // We want the latest inventory but in the reversed order
        this.$data.inventory = response.data.reverse()
      })
    // Add new messages to the message list
    messages.on('created', message => {
      console.log('message received')
      this.$data.messages.unshift(message)
    })
    // Add new users to the user list
    users.on('created', user => {
      console.log('user received')
      this.$data.users = this.$data.users.concat(user)
    })
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">
  .chat-message .q-input-area {
    min-height: 19px !important;
    height: 19px !important;
  }
</style>