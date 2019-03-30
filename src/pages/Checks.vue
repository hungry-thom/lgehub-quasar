
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="month"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          row-key="date1"
          :pagination.sync="pagination"
          hide-bottom >
          <template slot="top-left" slot-scope="props">
            <q-search
              hide-underline
              color="secondary"
              v-model="filter"
              class="col-6"
            />
          </template>
          <template slot="top-right" slot-scope="props">
            <q-table-columns
              color="secondary"
              class="q-mr-sm"
              v-model="visibleColumns"
              :columns="columns"
            />
          </template>
        </q-table>
        <br>
      </div>
  </q-page>
</template>

<script>
import moment from 'moment'
import api from 'src/api'
import _ from 'lodash'
import {
  QChatMessage,
  QTable,
  QTr,
  QTd,
  QSearch,
  QPopupEdit,
  QCheckbox,
  QTableColumns
} from 'quasar'

export default {
  name: 'chat',
  components: {
    QChatMessage,
    QTable,
    QTr,
    QTd,
    QSearch,
    QPopupEdit,
    QCheckbox,
    QTableColumns
  },
  props: ['user'],
  data () {
    return {
      message: '',
      messages: [],
      users: [],
      filter: '',
      pagination: {
        sortBy: name, // String, column 'item' property value
        descending: true,
        page: 1,
        rowsPerPage: 0 // current rows per page being displayed,
      },
      month: [],
      columns: [
        {
          name: 'id',
          required: false,
          label: 'Id',
          align: 'left',
          field: 'id'
        }
      ],
      visibleColumns: []
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
    },
    addStockUnit (itemId) {
      console.log(itemId)
    },
    generateWeek () {
      let ima = moment()
      let week = {}
      this.$data.columns = []
      for (let n = 0; n < 7; n++) {
        week[ima.day(n).format('ddd')] = ima.format('DD-MMM') // {date: ima.format()} // would ima.day(n).format() be better?
        this.$data.columns.push({
          name: ima.format('ddd'),
          required: false,
          label: ima.format('ddd'),
          align: 'center',
          field: ima.format('ddd')
        })
        this.visibleColumns.push(ima.format('ddd'))
      }
      console.log(week)
      this.$data.month.push(week)
    },
    loadData () {
      api.service('checks').find({
        query: {
          cashed: '',
          $sort: checkDate
        }
      }).then((resp) => {
        this.$data.checksOutstanding = resp.data
        resp.data.forEach(chk => {
          for (let f in chk) {
              let tmpChk = {
              name: chk[f],
              required: false,
              label: chk[f],
              align: 'left',
              field: chk[f]
            }
          }
        })
      })
    }
  },
  mounted () {
    const messages = api.service('messages')
    const users = api.service('users')
    const priceList = api.service('pricelist')
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
   this.generateWeek()
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
  .h4 { 
    display: block;
    font-size: 1em;
    margin-top: 1.33em;
    margin-bottom: 1.33em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
  }
</style>