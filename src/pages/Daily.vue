
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="month"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          row-key="account"
          :pagination.sync="pagination"
          hide-bottom >
          <template slot="body" slot-scope="props">
            <q-tr :props="props">
              <q-td key="account" :props="props">
                <q-checkbox color="primary" v-model="props.expand" unchecked-icon="add" checked-icon="remove" class="q-mr-md" /> <!-- @input="onExpand(props.row)"/> -->
                {{ props.row.account }}
              </q-td>
              <q-td key="total" :props="props">
                {{ props.row.total }}
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <q-table
                  :data="props.row.transactions"
                  :columns="expandedColumns"
                  :visible-columns="expandedVisibleColumns"
                  row-key="props.row.transactions.id"
                  hide-bottom >
                  <q-tr slot="header" slot-scope="props">
                    <q-th key="name" :props="props">Name</q-th>
                    <q-th key="transactionNum" :props="props">trans#</q-th>
                    <q-th key="amount" :props="props">Amount</q-th>
                    <q-th key="buttons" :props="props" width='25px'>
                      <!-- <q-btn size="sm" round dense color="secondary" icon="info" @click="overlay(props.row)" class="q-mr-xs" /> -->
                    </q-th>
                  </q-tr>
                </q-table>
              </q-td>
            </q-tr>
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
  QTh,
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
    QTh,
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
      month: [
        {
          account: 'sales',
          total: 500,
          transactions: [
            {
              name: 'cash',
              transactionNum: '432432',
              amount: 250,
              id: '5435jkl45345jkl'
            },
            {
              name: 'Laurie',
              transactionNum: '432433',
              amount: 250,
              id: '5435jhkl345jkl3'
            }
          ]
        },
        {
          account: 'expenses',
          total: 300,
          transactions: [
            {
              name: 'Madisco',
              transactionNum: '43452',
              amount: 150,
              id: '543kjl5kl34j5'
            },
            {
              name: 'Food&Bev',
              transactionNum: '478974',
              amount: 150,
              id: '453j5kl43jkl23'
            }
          ]
        }
      ],
      columns: [
        {
          name: 'account',
          required: false,
          label: 'account',
          align: 'left',
          field: 'account'
        },
        {
          name: 'total',
          required: false,
          label: 'total',
          align: 'left',
          field: 'total'
        }
      ],
      visibleColumns: ['account', 'total'],
      expandedColumns: [
        {
          name: 'id',
          required: false,
          label: 'id',
          align: 'left',
          field: 'id'
        },
        {
          name: 'name',
          required: false,
          label: 'name',
          align: 'left',
          field: 'name'
        },
        {
          name: 'transactionNum',
          required: false,
          label: 'transactionNum',
          align: 'left',
          field: 'transactionNum'
        },
        {
          name: 'amount',
          required: false,
          label: 'amount',
          align: 'left',
          field: 'amount'
        }
      ],
      expandedVisibleColumns: ['name', 'transactionNum', 'amount']
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