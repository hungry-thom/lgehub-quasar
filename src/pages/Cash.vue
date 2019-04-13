
<template>
  <q-page>
      <div>
        <br>
          <!--
          <q-tree
            :nodes="bankData"
            node-key="label"
          />
          -->
          <q-list separator>
            <q-collapsible indent icon="mail" label="creditPending  :    xxxx.xx"></q-collapsible>
            <q-item>
              <q-item-side icon="mail" />
              <q-item-main :label="onRecordLabel" label-lines="1" />
            </q-item>
            <q-collapsible indent icon="receipt" :label="outstandingChecksLabel">
              <div>
                <q-table
                  :data="outstandingChecks"
                  :columns="outstandingChecksColumns"
                  :visible-columns="visibleColumns"
                  row-key="id"
                  :pagination.sync="pagination"
                  hide-bottom
                  class="col" >
                </q-table>
              </div>
              <!-- <q-collapsible label="Today"></q-collapsible> -->
            </q-collapsible>
          </q-list>
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
  QTree,
  QCollapsible
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
    QTree,
    QCollapsible
  },
  props: ['user'],
  data () {
    return {
      atlanticData: [],
      outstandingChecks: [],
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
      outstandingChecksColumns: [
        {
          name: 'amount',
          required: false,
          label: 'amount',
          align: 'left',
          field: 'amount'
        },
        {
          name: 'vendor',
          required: false,
          label: 'vendor',
          align: 'left',
          field: 'vendor'
        },
        {
          name: 'checkNum',
          required: false,
          label: 'checkNum',
          align: 'left',
          field: 'checkNum'
        },
        {
          name: 'cashed',
          required: false,
          label: 'cashed',
          align: 'left',
          field: 'cashed'
        },
        {
          name: 'checkDate',
          required: false,
          label: 'checkDate',
          align: 'left',
          field: 'checkDate'
        },
        {
          name: 'expenseId',
          required: false,
          label: 'expenseId',
          align: 'left',
          field: 'expenseID'
        },
        {
          name: 'id',
          required: false,
          label: 'id',
          align: 'left',
          field: 'id'
        },
        {
          name: 'transNum',
          required: false,
          label: 'transNum',
          align: 'left',
          field: 'transNum'
        }
      ],
      visibleColumns: ['amount', 'vendor', 'checkNum','checkDate'],
      pagination: {
        sortBy: name, // String, column 'item' property value
        descending: true,
        page: 1,
        rowsPerPage: 0 // current rows per page being displayed,
      }
    }
  },
  computed: {
    onRecordLabel () {
      try {
        let lastRec = this.$data.atlanticData.records.length - 1
        let balance = this.$data.atlanticData.records[lastRec].Balance
        let format = (balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        let lbl = `onRecord: ${format}`
        return lbl
      }
      catch (err) {
        console.warn("error!", err)
      }
    },
    outstandingChecksLabel () {
      let checkTotal = 0
      this.$data.outstandingChecks.forEach((check) => {
        checkTotal += check.amount
      })
      let format = (checkTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      let lbl =  `outstandingChecks: ${format}`
      return lbl
    }
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
    async loadData () {
      /************ GET OUTSTANDING CHECK DATA ***************/
      let checksResp = await api.service('checks').find({query: {cashed: '', $sort: { checkDate: 1 }}}).catch((err) => {console.log('Error!', err)})
      console.log(checksResp.data)
      this.$data.outstandingChecks = checksResp.data
      /************* Get atlantic month data ***************/
      let atlanticResp = await api.service('atlantic').find({query: {month: 'Apr19'}}).catch((err) => {console.log(err)})
      this.$data.atlanticData = atlanticResp.data[0] // only one result
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