
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
              <q-td><q-btn icon="payment" size="sm" color="secondary" @click="paymentOverlay(props.row)"/></q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <q-table
                  :data="props.row.invoices"
                  :columns="expandColumns"
                  :visible-columns="visibleExpandColumns"
                  row-key="props.row.invoice.expDate"
                  :pagination.sync="pagination"
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
      <div>
        <!-- //////// START OF tranaction MODAL READONLY' ////////-->
        <q-modal v-model="paymentModal" :no-backdrop-dismiss="true" >
        <q-modal-layout > <!-- class="q-pa-sm" -->
          <q-toolbar slot="header">
            <q-btn
              flat
              icon="keyboard_backspace"
              v-close-overlay
            />
            <q-toolbar-title>
              Transaction
            </q-toolbar-title>
          </q-toolbar>
          <div slot="footer">
            <div class="q-pa-xs float-right">
              &nbsp;&nbsp;<q-btn size="md" color="primary" :label="paymentTotal.str" />
              &nbsp;&nbsp;<q-btn size="md" color="primary" label="Submit" @click="submitPayment(transaction)"/> <!-- :disable not reading var -->
            </div>
          </div>
        <div class="q-pa-sm">
        <div class="row no-wrap" >
          <q-datetime class="col" minimal color="orange" v-model="transaction.date1" type="date" float-label="Date" :first-day-of-week="0" />&nbsp;&nbsp;
          <q-input class="col" :readonly="true" ref="inputVendor" v-model="transaction.vendor" float-label="Vendor" ></q-input>&nbsp;&nbsp;
          <q-input class="col" ref="inputtransNum" v-model="transaction.transNum" float-label="Transaction Number"/>&nbsp;&nbsp;
          <q-input class="col" v-model="transaction.paymentAccount" float-label="Payment Account" ><q-autocomplete :static-data="{field: 'value', list: paymentTypes}" /></q-input>
        </div>
        <div>
          <br>
          <q-table
            :data="transaction.transItems"
            :columns="modalColumns"
            :visible-columns="visibleModalColumns"
            row-key="expDate"
            :pagination.sync="pagination" 
            selection="multiple"
            :selected.sync="transaction.selected"
            hide-bottom >
            <q-tr slot="body" slot-scope="props" :props="props">
              <q-td key="selected">
                <q-checkbox v-model="props.selected"/>
              </q-td>
              <q-td key="expDate" :props="props" >
                {{ props.row.expDate || '-' }}
              </q-td>
              <q-td key="transNum" :props="props" >
                {{ props.row.transNum || '-' }}
              </q-td>
              <q-td key="amount" :props="props" >
                {{ props.row.amount || '-' }}
              </q-td>
              <q-td key="paidBox" :props="props">
                <q-checkbox v-model="props.row.paidBox" @input="clickBox(props)"/>
              </q-td>
            </q-tr>
            <q-tr slot="bottom-row" slot-scope="props" align="left">
                <q-td></q-td>
                <q-td></q-td>
                <q-td></q-td>
                <q-td class="bg-deep-purple-3">{{ vendorTotal || '-' }}</q-td>
                <q-td></q-td>
            </q-tr>
          </q-table>
          <br>
        </div>
        </div>
      </q-modal-layout>
      </q-modal>
      <!-- //////  END OF MODAL  //////// -->
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
  QModal,
  QModalLayout,
  QDatetime,
  QAutocomplete
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
    QModal,
    QModalLayout,
    QDatetime,
    QAutocomplete
  },
  props: ['user'],
  data () {
    return {
      selection: 'multiple',
      tselected: [],
      transaction: {
          date1: '',
          vendor: '',
          transNum: '',
          paymentAccount: '',
          transItems: [],
          selected: []
        },
      paymentTypes: [
        {
          value: 'cashMS',
          label: 'cashMS'
        },
        {
          value: 'cashHR',
          label: 'cashHR'
        },
        {
          value: 'ccardScotia',
          label: 'ccardScotia'
        },
        {
          value: 'checkAtl#',
          label: 'checkAtl#'
        },
        {
          value: 'cashAtl',
          label: 'cashAtl'
        },
        {
          value: 'payableAcct',
          label: 'payableAcct'
        }
      ],
      paymentModal: false,
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
          field: 'expDate',
          sortable: true
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
      visibleExpandColumns: ['vendor', 'amount', 'expDate', 'transNum', 'expenseId'],
      modalColumns: [],
      visibleModalColumns: ['expDate', 'transNum', 'amount', 'paidBox']
    }
  },
  computed: {
    vendorTotal () {
      const invoices = this.$data.transaction.transItems
      let gTotal = 0
      invoices.forEach(inv => {
        gTotal += inv.amount
      })
      return _.round(gTotal, 2)
    },
    paymentTotal () {
      const invoices = this.$data.transaction.selected
      let payTotal = 0
      invoices.forEach(inv => {
        payTotal += inv.amount
      })
      const str = `Total: $${_.round(payTotal, 2)}`
      return {
        str: str,
        num: _.round(payTotal, 2)
      }
    },
    grandTotal () {
      let payables = this.$data.vendorList
      let gTotal = 0
      payables.forEach(vendor => {
        gTotal += vendor.total
      })
      return _.round(gTotal, 2)
    }
  },
  methods: {
    submitPayment (transaction) {
      console.log('submit', transaction)
      if (transaction.selected.length === 0) {
        this.$q.notify({
          message: `No invoices selected`,
          timeout: 3000,
          position: 'center'
        })
      } else {
        for (let select of transaction.selected) {
          // console.log('sel', select)
          // console.log('patched1', select)
          select.paid = transaction.date1
          api.service('payable').patch(select.id, {
            paid: transaction.date1
          })
          console.log('patched2', select) // not printing to console?
        }
        transaction['amount'] = this.paymentTotal.num
        
        let cleanTransactionData = JSON.parse(JSON.stringify(transaction))
        delete cleanTransactionData['transItems']
        cleanTransactionData['table'] = 'payable'
        api.service('audit').create(cleanTransactionData).then(resp => {
          console.log('audit Success', resp)
          cleanTransactionData['expenseId'] = resp.id
          if (cleanTransactionData.paymentAccount.includes('checkAtl#')) {
            console.log('amt',cleanTransactionData)
            this.updateChecks(cleanTransactionData)
          }
        })
        this.loadData()
        this.$data.paymentModal = false
      }
    },
    updateChecks (trans) {
      // service call
      let checkInfo = {
        checkDate: trans.date1,
        checkNum: trans.paymentAccount.substr(9), // 'checkAtl#9999' -> 9999
        vendor: trans.vendor,
        amount: trans.amount,
        cashed: '',
        transNum: trans.transNum,
        expenseId: trans.id
      }
      api.service('checks').find({
        query: {
          checkNum: checkInfo.checkNum,
          vendor: checkInfo.vendor
        }
      })
      .then(queryCheck => {
        if (queryCheck.data.length > 0) {
          const existingCheck = queryCheck.data[0]
          checkInfo.amount += existingCheck.amount
          api.service('checks').update(existingCheck.id, checkInfo) // api.update replaces entire object
        } else {
          api.service('checks').create(checkInfo).then((response) => {
            // response
            console.log('checkAddedTODB', response)
          }).catch((err) => {
            // error
            console.log(`Error: ${err}`)
            this.$q.notify({
              message: `Checks Error: ${err}`,
              timeout: 3000,
              position: 'center'
            })
          })
        }
      })
    },
    clickBox (row) {
      console.log('r', row)
      // paidBox doesn't render new value on click, need to refresh modal
      this.$data.paymentModal = false
      this.$data.paymentModal = true
    },
    paymentOverlay (vendor) {
      console.log('payment', vendor)
      this.$data.modalColumns = []
      console.log('paidbox', vendor)
      for (let col in vendor.invoices[0]) {
        let tmpCol = {
          name: col,
          required: false,
          label: col,
          align: 'left',
          field: col,
          sortable: true
        }
        if (this.$data.visibleModalColumns.includes(col)) {
          this.$data.modalColumns[this.$data.visibleModalColumns.indexOf(col)] = tmpCol
        } else {
          this.$data.modalColumns.push(tmpCol)
        }
      }
      this.$data.transaction = {
          date1: moment().toISOString(true),
          vendor: vendor.vendor,
          transNum: '',
          paymentAccount: '',
          transItems: vendor.invoices,
          selected: []
        }
        this.$data.paymentModal = true
    },
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
        this.$data.vendorList = []
        response.data.forEach(rec => {
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
            v.total = _.round(v.total, 2)
            if (rec.vendor === 'Midway') {
              console.log("MIDWAY", this.$data.vendorList[dex])
            }
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