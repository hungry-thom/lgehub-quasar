
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="vendorList"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          row-key="vendor"
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
          <template slot="body" slot-scope="props">
            <q-tr :props="props">
              <q-td key="vendor" :props="props">
                <q-checkbox color="primary" v-model="props.expand" unchecked-icon="add" checked-icon="remove" class="q-mr-md" />
                {{ props.row.vendor }}
              </q-td>
              <q-td key="total" :props="props">
                {{ props.row.total || '' }}
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <q-table
                  :data="props.row.invoices"
                  :columns="expandColumns"
                  :visible-columns="visibleExpandColumns"
                  row-key="props.row.invoice.expDate"
                  hide-bottom >
                </q-table>
              </q-td>
            </q-tr>
          </template>
          <template slot="bottom-row" slot-scope="props" >
          <q-tr align="left">
            <q-td class="bg-deep-purple-1">Grand Total:</q-td>
            <q-td class="bg-deep-purple-1">{{ grandTotal || '-' }}</q-td>
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
      payables: [],
      vendorList: [],
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
        },
        {
          name: 'vendor',
          required: false,
          label: 'vendor',
          align: 'left',
          field: 'vendor'
        },
        {
          name: 'total',
          required: false,
          label: 'total',
          align: 'left',
          field: 'total'
        }
      ],
      expandColumns: [
        {
          name: 'id',
          required: false,
          label: 'Id',
          align: 'left',
          field: 'id'
        },
        {
          name: 'vendor',
          required: false,
          label: 'vendor',
          align: 'left',
          field: 'vendor'
        },
        {
          name: 'amount',
          required: false,
          label: 'amount',
          align: 'left',
          field: 'amount'
        },
        {
          name: 'expDate',
          required: false,
          label: 'expDate',
          align: 'left',
          field: 'expDate'
        },
        {
          name: 'transNum',
          required: false,
          label: 'transNum',
          align: 'left',
          field: 'transNum'
        },
        {
          name: 'expenseId',
          required: false,
          label: 'expenseId',
          align: 'left',
          field: 'expenseId'
        }
      ],
      visibleColumns: ['vendor', 'total'],
      visibleExpandColumns: ['vendor', 'amount', 'expDate', 'transNum', 'expenseId']
    }
  },
  computed: {
    grandTotal () {
      let payables = this.$data.vendorList
      let gTotal = 0
      payables.forEach(vendor => {
        gTotal += vendor.total
      })
      return gTotal
    }
  },
  methods: {
    isSent (message) {
      return (message.userId === this.user._id)
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
      // would like to query for hasFields('paid').not() or similar, but nothing works
      // have to query for blank field (after creating with blank field)
      api.service('payable').find({
      query: {
        paid: ''
      }
    })
      .then((response) => {
        // we want to combine all payables for each vendor
        console.log(response.data.length)
        response.data.forEach(rec => {
          if (rec.vendor === 'RCimports') {
            console.log(rec.paid)
          }
          let dex = _.findIndex(this.$data.vendorList, {vendor: rec.vendor})
          if (dex < 0) {
            // create a new vendor entry
            console.log('check1')
            this.$data.vendorList.push({
              vendor: rec.vendor,
              total: rec.amount,
              invoices: [rec]
            })
          }
          else {
            // add data to vendor info
            console.log('check2')
            let v = this.$data.vendorList[dex]
            v.invoices.push(rec)
            v.total += rec.amount
          }
        })
        this.$data.payables = response.data.reverse()
      })
    }
  },
  mounted () {
    const payables = api.service('payable')
    const users = api.service('users')
    const priceList = api.service('pricelist')
    this.loadData()
    users.find()
      .then((response) => {
        this.$data.users = response.data
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