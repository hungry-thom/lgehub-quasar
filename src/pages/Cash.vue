
<template>
  <q-page>
      <div>
        <br>
        <template>
          <q-tree
            :nodes="bankData"
            node-key="label"
          />
        </template>
        <br>
      </div>
  </q-page>
</template>

<script>
import moment from 'moment'
import api from 'src/api'
import _ from 'lodash'
let EXCEL = require('exceljs/dist/es5/exceljs.browser')
import {
  QChatMessage,
  QTable,
  QTr,
  QTd,
  QSearch,
  QPopupEdit,
  QCheckbox,
  QTableColumns,
  QTree
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
    QTableColumns,
    QTree
  },
  props: ['user'],
  data () {
    return {
      bankData: [],
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
      let tree = []
      /* tree should look like this
        { label: 'creditPending: xxxx.xx' },
        { label: 'onRecord: xxxxx.xx' },
        { 
          label: 'OutstandingChecks: xxxxx.xx',
          children: [
            { label: 'total: xxxxx.xx; date: xx-xxx-xx; vendor: xxxxxxx; transNum: xxxxxxxx' },
            { label: 'total: xxxxx.xx; date: xx-xxx-xx; vendor: xxxxxxx; transNum: xxxxxxxx' },
            ...
          ]
        },
        { label: subTotal: xxxxx.xx }
        {
          label: payables: xxxxx.xx
          children: [
            {
              label: 'total: xxxxx.xx; vendor: xxxxxxx'
              children: [
                { label: 'total: xxxxx.xx; date: xx-xxx-xx; transNum: xxxxxxxx' },
                { label: 'total: xxxxx.xx; date: xx-xxx-xx; transNum: xxxxxxxx' }
              ]
            },
            {
              label: 'total: xxxxx.xx; vendor: xxxxxxx'
              children: [
                { label: 'total: xxxxx.xx; date: xx-xxx-xx; transNum: xxxxxxxx' },
                { label: 'total: xxxxx.xx; date: xx-xxx-xx; transNum: xxxxxxxx' }
              ]
            }
            ...
          ]
        }
      ]
      */
      // get creditPending
      tree.push({ label: 'creditPending: xxxx.xx' })
      // get bank info (onRecord amount & date)
      tree.push({ label: 'onRecord: 20,000.00' })
      // get outstandingChecks
      api.service('checks').find({
        query: {
          cashed: ''
        }
      }).then((resp1) => {
        if (resp1.data.length > 0) {
          let tmpCkList = []
          let ckTotal = 0
          resp1.data.forEach((check) => {
            ckTotal += check.amount
            tmpCkList.push({
              label: `amount: ${check.amount};  vendor: ${check.vendor};  check#: ${check.checkNum};  date: ${check.checkDate.toLocaleString('en-GB').slice(0,10)}`
            })
          })
          tree.push({
            label: `outstandingChecks: ${ckTotal}`,
            children: tmpCkList
          })
          tree.push({ label: `subTotal: ${200000-ckTotal}`})
        }
        api.service('payable').find({
          query: {
            paid: ''
          }
        }).then((resp2) => {
          if (resp2.data.length > 0) {
            let gTotal = 0
            let vendors = []
            resp2.data.forEach((invoice) => {
              gTotal += invoice.amount
              let dex = _.findIndex(vendors, {vendor: invoice.vendor})
              if (dex < 0) {
                vendors.push({
                  vendor: invoice.vendor,
                  total: invoice.amount,
                  list: [{ label: `amount: ${invoice.amount}; date: ${invoice.expDate.toLocaleString('en-GB').slice(0,10)}`}]
                })
              } else {
                vendors[dex].total += invoice.amount
                vendors[dex].list.push({ label: `amount: ${invoice.amount}; date: ${invoice.expDate.toLocaleString('en-GB').slice(0,10)}`})
              }
            })
            // tree.push({label: `payables: ${gTotal}`})
            let tmpPayList = []
            vendors.forEach((ven) => {
              tmpPayList.push({
                label: `total: ${ven.total};  vendor: ${ven.vendor}`,
                children: ven.list
              })
            })
            tree.push({
              label: `payables: ${gTotal}`,
              children: tmpPayList
            })
            this.$data.bankData = tree
          }//
        })
      })
    } // end of loadData method
  },
  mounted () {
    const messages = api.service('messages')
    const users = api.service('users')
    const priceList = api.service('pricelist')
    // Get all users and messages
    this.loadData()
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