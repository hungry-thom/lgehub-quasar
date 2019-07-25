
<template>
  <q-page>
      <div>
        <br>
        <q-btn :label="table" >
          <q-popover>
            <q-list link>
              <q-item v-for="t in tableNameList" :key="t" v-close-overlay @click.native="loadTable(t)">
                <q-item-main>
                  <q-item-tile label>{{ t }}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <q-table
          :data="tableData"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          row-key="id"
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
  QTableColumns,
  QPopover
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
    QPopover
  },
  props: ['user'],
  data () {
    return {
      table: '',
      tableNameList: ['atlantic', 'audit', 'ccard', 'checks', 'expenses', 'inventory', 'payable', 'pricelist','transfers'],
      tableData: [],
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
      month: '',
      columns: [
        {
          name: 'id',
          required: false,
          label: 'Id',
          align: 'left',
          field: 'id'
        }
      ],
      visibleColumns: ['checkDate', 'checkNum', 'vendor', 'amount', 'cashed', 'transNum', 'expenseId', 'id']
    }
  },
  computed: {
  },
  methods: {
    loadColumns (tableData) {
      // tableData comes as list of documents in table
      // console.log(tableData)
      // if we cycle through the first 25 documents, we should get a good sample of all fields
      this.$data.columns = []
      // this.$data.visibleColumns = []
      for (let x = 0; x < 26; x++){
        console.log(tableData[x])
        for(let property in tableData[x]) {
          if (tableData[x].hasOwnProperty(property)) {
            //console.log(property)
            //console.log(tableData[property])
            let col = {
              name: property,
              required: false,
              label: property,
              align: 'left',
              field: property,
              sortable: true
            }
            if ((_.findIndex(this.$data.columns, {name: property})) < 0) {
              this.$data.columns[this.$data.visibleColumns.indexOf(property)] =  col
              // this.$data.visibleColumns.push(property)
            }
          }
        }
      }
      console.log(this.$data.columns)
    },
    loadTable (tableName) {
      // load table 
      this.$data.table = tableName
      api.service(tableName).find()
        .then((resp) => {
          this.$data.tableData = resp.data
          this.loadColumns(resp.data)
        })
    },
    loadChecks () {
      // load table 
      // this.$data.month = monthName
      api.service('checks').find({
        query: {
          $sort: {
            checkDate: -1
          }
        }
      })
      .then((resp) => {
        console.log(resp)
        this.$data.tableData = resp.data
        // this.markUnverifiedRecords()
        // console.log(this.$data.tableData)
        this.loadColumns(this.$data.tableData)
      })
    },
    markUnverifiedRecords () {
      this.$data.tableData.forEach(row => {
        // code
      })
    },
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
    }
  },
  mounted () {
    this.loadChecks()
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