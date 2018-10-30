<!-- ExpenseHome.vue -->
<template>
  <q-page class="layout-padding">
    <div>
      <q-table
        :data="expenses"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="item"
        :pagination.sync="pagination"
        hide-bottom
        class="col" >
        <tr slot="header" slot-scope="props">
          <!-- 
          <q-th key="inv" :props="props">Inv</q-th>
          <q-th key="expAccount" :props="props">expAccount</q-th>
          -->
          <q-th key="date1" :props="props" class="bg-deep-purple-1">Date</q-th>
          <q-th key="vendor" :props="props" class="bg-deep-purple-1">Vendor</q-th>
          <q-th key="subTotal" :props="props" class="bg-deep-purple-1">Cost</q-th>
          <q-th key="gstTotal" :props="props" class="bg-deep-purple-1">prepaidGST</q-th>
          <q-th key="grandTotal" :props="props" class="bg-deep-purple-1">Total</q-th>
          <q-th key="paymentAccount" :props="props" class="bg-deep-purple-2">Payment</q-th>
        </tr>
        <template slot="body" slot-scope="props">
          <tr :props="props" @click="popup(props.row)">
            <!--
            <q-td key="inv" :props="props">{{ props.row.inv }}</q-td>
            <q-td key="expAccount" :props="props">expAccount</q-td>
            -->
            <q-td key="date1" :props="props" class="bg-deep-purple-1">{{ props.row.date1.toLocaleString('en-GB').slice(0,10) }}</q-td>
            <q-td key="vendor" :props="props" class="bg-deep-purple-1">{{ props.row.vendor }}</q-td>
            <q-td key="subTotal" :props="props" class="bg-deep-purple-1">{{ props.row.subTotal }}</q-td>
            <q-td key="gstTotal" :props="props" class="bg-deep-purple-1">{{ props.row.gstTotal }}</q-td>
            <q-td key="grandTotal" :props="props" class="bg-deep-purple-1">{{ props.row.grandTotal }}</q-td>
            <q-td key="paymentAccount" :props="props" class="bg-deep-purple-2">{{ props.row.paymentAccount }}</q-td>
          </tr>
        </template>
      </q-table>
      <q-btn flat round size="xl" color="secondary" @click="newExpense" icon="add_circle" />
    </div>
    <br>
    <!-- //////// START OF MODAL' ////////-->
    <q-modal v-model="expenseModal">
    <q-modal-layout> <!-- class="q-pa-sm" -->
      <q-toolbar slot="header">
        <q-btn
          flat
          icon="keyboard_backspace"
          @click="overlay"
        />
        <q-toolbar-title>
          Enter/Edit Expense
        </q-toolbar-title>
        &nbsp;&nbsp;<q-btn size="md" color="negative" label="Delete Expense" @click="deleteExpense()"/>
      </q-toolbar>
      <div slot="footer">
        <div class="q-pa-xs float-right">
          &nbsp;&nbsp;<q-btn size="md" color="primary" label="Cancel" @click="overlay"/>
          &nbsp;&nbsp;<q-btn size="md" color="primary" label="Submit" @click="submitExpense"/> <!-- :disable not reading var -->
        </div>
      </div>
    <div class="q-pa-sm">
    <div class="row no-wrap">
      <q-datetime class= "col" minimal color="orange" v-model="transaction.date1" type="date" float-label="Date" @input="selectDate"/>&nbsp;&nbsp;
      <q-input class= "col" ref="inputVendor" v-model="transaction.vendor" float-label="Vendor"  @blur="validateVendor"> <q-autocomplete :static-data="{field: 'value', list: vendorsList}" /></q-input>&nbsp;&nbsp;
      <q-input class= "col" ref="inputtransNum" v-model="transaction.transNum" float-label="Transaction Number"/>&nbsp;&nbsp;
      <q-input class= "col" v-model="transaction.paymentAccount" float-label="Payment Account" > <q-autocomplete :static-data="{field: 'value', list: paymentTypes}" /></q-input>
    </div>
    <div>
      <br>
      <q-table
        :data="transaction.transItems"
        :columns="modalColumns"
        :visible-columns="visibleModalColumns"
        row-key="item"
        :pagination.sync="pagination"
        hide-bottom >
        <tr slot="header" slot-scope="props">
          <q-th key="qty" :props="props" class="bg-deep-purple-1">Qty</q-th>
          <q-th key="item" :props="props" class="bg-deep-purple-1">Item</q-th>
          <q-th key="unit" :props="props" class="bg-deep-purple-1">Unit</q-th>
          <q-th key="price" :props="props" class="bg-deep-purple-1">Price</q-th>
          <q-th key="cost" :props="props" class="bg-deep-purple-1">Cost</q-th>
          <q-th key="gst" :props="props" class="bg-deep-purple-1">GST</q-th>
          <q-th key="total" :props="props" class="bg-deep-purple-2">Total</q-th>
          <q-th key="expAccount" :props="props">expAccount</q-th>
          <q-th key="inv" :props="props">Inv</q-th>
          <q-th key="expand" :props="props" width='25px'><q-btn size="sm" round dense color="secondary" icon="code" class="q-mr-xs" @click="expandCols" /></q-th>
        </tr>
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td key="qty" :props="props" class="bg-deep-purple-1">{{ props.row.qty || '-' }}</q-td>
          <q-td key="item" :props="props" class="bg-deep-purple-1">{{ props.row.item || '-' }}</q-td>
          <q-td key="unit" :props="props" class="bg-deep-purple-1" >{{ props.row.unit || '-' }}</q-td>
          <q-td key="price" :props="props" class="bg-deep-purple-1" >{{ props.row.price || '-' }}</q-td>
          <q-td key="cost" :props="props" class="bg-deep-purple-1" >{{ props.row.cost || '-' }}</q-td>
          <q-td key="gst" :props="props" class="bg-deep-purple-1" >{{ props.row.gst || '-' }}</q-td>
          <q-td key="total" :props="props" class="bg-deep-purple-2" >{{ props.row.total || '-' }}</q-td>
          <q-td key="expAccount" :props="props">
            {{ props.row.expAccount || '-' }}
            <q-popup-edit v-model="props.row.expAccount" title="Update" buttons>
              <q-input v-model="props.row.expAccount" />
            </q-popup-edit>
          </q-td>
          <q-td key="inv" :props="props">
            {{ props.row.inv || '-' }}
            <q-popup-edit v-model="props.row.expAccount" title="Update" buttons>
              <q-input v-model="props.row.expAccount" />
            </q-popup-edit>
          </q-td>
          <q-td key="expand" :props="props">
            <div class="row items-center justify-between no-wrap">
              <q-btn size="sm" round dense color="secondary" icon="delete" @click="deleteItemRow(props.row)" class="q-mr-xs" />
            </div>
          </q-td>
        </q-tr>
        <!--
          <q-td key="stock" :props="props">
            <div class="row items-center justify-between no-wrap">
              <div v-for="unit in props.row.stock" :key="unit.unit">{{ unit.unit }}:<br>&nbsp;&nbsp;<strong><font size="4">{{ unit.qty }}</font></strong>
                <q-popup-edit v-model="unit.qty" title="Update count" @save="updateCount(props.row)" buttons>
                  <q-input type="number" v-model="unit.qty" />
                </q-popup-edit>
              </div>
              <div>
                <q-checkbox v-model="confirmations[props.row.__index].confirmed" checked-icon="check_circle" unchecked-icon="remove_circle_outline" class="q-mr-md" />
                <q-btn size="sm" round dense color="secondary" icon="playlist_add" class="q-mr-xs" @click="addStockUnit(props.row)" />
                <q-btn size="sm" round dense color="secondary" icon="shopping_cart" class="q-mr-xs" />
              </div>
            </div>
          </q-td>
        </q-tr>
        -->
        <q-tr slot="bottom-row" slot-scope="props" align="left">
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td class="bg-deep-purple-2">{{ subTotal || '-' }}</q-td>
            <q-td class="bg-deep-purple-2">{{ gstTotal || '-' }}</q-td>
            <q-td class="bg-deep-purple-3">{{ grandTotal || '-' }}</q-td>
            <q-td></q-td>
            <q-td></q-td>
        </q-tr>
      </q-table>
      <br>
    </div>
    <br>
    <div class="row no-wrap">
      <q-input class="col" ref="newEntry" float-label="Qty" type="number" v-model="newItem.qty" />&nbsp;&nbsp;
      <q-input class="col" float-label="Item" v-model="newItem.item" > <q-autocomplete :static-data="{field: 'value', list: itemList}" :filter="myFilter"/> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Unit" v-model="newItem.unit" @click="popupUnitList" > <q-autocomplete :static-data="{field: 'value', list: computedUnitsList}" :filter="myFilter"/> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Cost" type="number" v-model="newItem.amount" />
    </div>
    <div class="row no-wrap">
      <q-input class="col" float-label="exp Account" v-model="newItem.expAccount" @keyup.enter="addItem"> <q-autocomplete :static-data="{field: 'value', list: expAccountList}" :filter="myFilter" /> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Inv Account" v-model="newItem.inv" @keyup.enter="addItem"/>&nbsp;&nbsp;
    </div>
    <br>
    <div class="row no-wrap">
      <div>
        <q-checkbox class="float-right" v-model="taxable" left-label label="Taxable" true-value="yes" false-value="no"/>
        <br>
        <q-checkbox v-model="gstIncluded" left-label label="GST Included" true-value="yes" false-value="no" :disable="gstIncludedVisibility" />
      </div>
      <div class="q-pa-xs">
        &nbsp;&nbsp;<q-btn size="md" color="primary" label="add Item" @click="addItem" />
      </div>
    </div>
    <br>
    </div>
  </q-modal-layout>
  </q-modal>
  <!-- //////  END OF MODAL  //////// -->
  </q-page>
</template>

<script>
import moment from 'moment'
import api from 'src/api'
import _ from 'lodash'
import fuzzysearch from 'fuzzysearch'
import {
  QChatMessage,
  QTable,
  QTr,
  QTd,
  QTh,
  QSearch,
  QPopupEdit,
  QCheckbox,
  QBtn,
  QDatetime,
  QAutocomplete,
  QModal,
  QModalLayout
} from 'quasar'

export default {
  name: 'chat',
  components: {
    QChatMessage,
    QTable,
    QTr,
    QTd,
    QTh,
    QSearch,
    QPopupEdit,
    QCheckbox,
    QBtn,
    QDatetime,
    QAutocomplete,
    QModal,
    QModalLayout
  },
  props: ['user'],
  data () {
    return {
      expenseModal: false,
      expenses: [],
      sales: [],
      transaction:
      {
        date1: '',
        vendor: '',
        transNum: '',
        paymentAccount: '',
        transItems: [],
      },
      itemList: [],
      vendorsList: [
      ],
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
        }
      ],
      expAccountList: [
        {
          value: 'COGS:HR:FOOD',
          label: 'COGS:HR:FOOD'
        },
        { 
          value: 'OPEXP:MS:CLEANING',
          label: 'OPEXP:MS:CLEANING'
        }
      ],
      checked: false,
      newItem: {
        qty: '',
        item: '',
        unit: '',
        amount: '',
        expAccount: '',
        inv: ''
      },
      unitsList: {},
      pricelist: [],
      taxable: 'yes',
      gstIncluded: 'yes',
      pagination: {
        sortBy: name, // String, column "item" property value
        descending: true,
        page: 1,
        rowsPerPage: 0 // current rows per page being displayed,
      },
      columns: [
        {
          name: 'id',
          required: false,
          label: 'Id',
          align: 'left',
          field: 'id'
        },
        {
          name: 'date1',
          required: true,
          label: 'Date',
          align: 'left',
          field: 'date1',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'paymentAccount',
          required: true,
          label: 'paymentAcct',
          align: 'left',
          field: 'paymentAccount',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'vendor',
          required: true,
          label: 'Vendor',
          align: 'left',
          field: 'vendor',
          sortable: true,
          classes: "bg-deep-purple-1"
        },
        {
          name: 'grandTotal',
          required: true,
          label: 'gTotal',
          align: 'left',
          field: 'grandTotal',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'subTotal',
          required: false,
          label: 'sTotal',
          align: 'left',
          field: 'subTotal',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'gstTotal',
          required: false,
          label: 'prepaidGST',
          align: 'left',
          field: 'gstTotal',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'expAccount',
          required: false,
          label: 'expAccount',
          align: 'left',
          field: 'expAccount',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'inv',
          required: false,
          label: 'Inv',
          align: 'center',
          field: 'inv'
        }
      ],
      visibleColumns: ['date1', 'paymentAccount', 'vendor', 'grandTotal', 'subTotal', 'gstTotal', 'expAccount', 'inv'],
      modalColumns: [
        {
          name: 'id',
          required: false,
          label: 'Id',
          align: 'left',
          field: 'id'
        },
        {
          name: 'qty',
          required: true,
          label: 'Qty',
          align: 'left',
          field: 'qty',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'item',
          required: true,
          label: 'Item',
          align: 'left',
          field: 'item',
          sortable: true,
          classes: "bg-deep-purple-1"
        },
        {
          name: 'unit',
          required: true,
          label: 'Unit',
          align: 'left',
          field: 'unit',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'price',
          required: false,
          label: 'Price',
          align: 'left',
          field: 'price',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'cost',
          required: false,
          label: 'Cost',
          align: 'left',
          field: 'cost',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'gst',
          required: false,
          label: 'GST',
          align: 'left',
          field: 'gst',
          classes: "bg-deep-purple-1"
        },
        {
          name: 'total',
          required: false,
          label: 'Total',
          align: 'left',
          field: 'total',
          classes: "bg-deep-purple-2"
        },
        {
          name: 'expAccount',
          required: false,
          label: 'expAccount',
          align: 'center',
          field: 'expAccount'
        },
        {
          name: 'inv',
          required: false,
          label: 'Inv',
          align: 'center',
          field: 'inv'
        },
        {
          name: 'expand',
          required: false,
          label: 'Expand',
          align: 'center',
          field: 'expand',
          style: 'width: 500px'
        }
      ],
      visibleModalColumns: ['qty', 'item', 'unit', 'price', 'cost', 'gst', 'total', 'expAccount', 'inv', 'expand']
    }
  },
  computed: {
    computedUnitsList () {
      return this.$data.unitsList[this.$data.newItem.item]
    },
    subTotal () {
      let t = 0
      this.$data.transaction.transItems.forEach(item => {
        console.log('t', t, item.cost)
        t += item.cost
      })
      return _.round(t,2)
    },
    gstTotal () {
      let g = 0
      this.$data.transaction.transItems.forEach(item => {
        console.log('g', g, item.gst)
        g += item.gst
      })
      return _.round(g,2)
    },
    grandTotal () {
      let gt = 0
      this.$data.transaction.transItems.forEach(item => {
        gt += item.total
      })
      return _.round(gt,2)
    },
    gstIncludedVisibility () {
      if (this.$data.taxable == 'yes') {
        return false
      } else {
        this.$data.gstIncluded = 'no'
        return true
      }
    }
  },
  methods: {
    selectDate (newVal) {
      console.log('newVal',newVal)
    },
    myFilter(terms, { field, list }) {
      const token = terms.toLowerCase();
      return list.filter(item => fuzzysearch(token, item[field].toLowerCase()));
    },
    popup(row) {
      // _.findIndex(this.$data.expenses, {})
      console.log(row)
      this.$data.transaction = row
      this.overlay()
      /*
      this.$q.notify({
        message: row.id,
        timeout: 3000,
        position: 'center'
      })
      */
    },
    newExpense () {
      this.$data.transaction = {
        date1: new Date(),
        vendor: '',
        transNum: '',
        paymentAccount: '',
        transItems: [],
      }
      this.overlay()
    },
    overlay () {
      console.log('overlaycalled')
      this.$data.newItem = {
        qty: '',
        item: '',
        unit: '',
        amount: '',
        expAccount: '',
        inv: ''
      }
      this.$data.expenseModal = !this.$data.expenseModal
    },
    deleteExpense() {
      console.log('delete expense')
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete this expense',
        ok: 'Delete',
        cancel: 'Cancel'
      }).then(() => {
        console.log('deleted', this.$data.transaction.id)
        api.service('expenses').remove(this.$data.transaction.id).then((response) => {
          console.log('executed')
          this.loadExpenses()
          //api.service('audit').create(response)
          this.overlay()
        })
      }).catch((err) => {
        console.log('cancelled',err)
        this.$q.notify('Disagreed...')
      })
    },
    deleteItemRow(row) {
      console.log('delete')
      console.log(row)
      let tmpIndex = _.findIndex(this.$data.transaction.transItems, {item: row.item})
      console.log(tmpIndex)
      this.$data.transaction.transItems.splice(tmpIndex, 1)
    },
    expandCols () {
      if (this.$data.visibleModalColumns.length == 10) {
        this.$data.visibleModalColumns = ['qty', 'item', 'unit', 'price', 'cost', 'gst', 'total', 'expand']
      } else {
        this.$data.visibleModalColumns = ['qty', 'item', 'unit', 'price', 'cost', 'gst', 'total', 'expAccount', 'inv', 'expand']
      }
    },
    validateVendor () {
      return true
    },
    popupUnitList () {
      return true
    },
    addItem () {
      let line = JSON.parse(JSON.stringify(this.$data.newItem))
      if (line.expAccount != '') {
        line.price = _.round((line.amount / line.qty), 2)
        if (this.$data.taxable == 'yes') {
          if (this.$data.gstIncluded == 'yes') {
            line.gst = _.round((line.amount / 9), 2)
            line.cost = _.round((line.amount / 1.125), 2)
          } else {
            line.gst = _.round((line.amount * 0.125), 2)
            line.cost = line.amount
          }
        } else {
          line.gst = 0
          line.cost = line.amount
        }
        line.total = _.round((line.gst + line.cost), 2)
        delete line['amount']
        this.$data.transaction.transItems.push(line)
        for (let v in this.$data.newItem){
          this.$data.newItem[v] = ''
        }
      } else {
        console.log('expAccount needs value')
      }
    },
    submitExpense () {
      // save computed values to transaction.object
      this.$data.transaction.subTotal = this.subTotal
      this.$data.transaction.gstTotal = this.gstTotal
      this.$data.transaction.grandTotal = this.grandTotal
      // check if this is an exsisting transaction 
      let tmpId = this.$data.transaction.id
      if (tmpId) {
        console.log('existing transaction', tmpId)
        // sdelete this.$data.transaction['id']
        api.service('expenses').update(tmpId, this.$data.transaction).then((response) => {
          console.log('sumbitted expense', response.id)
          delete response['id']
          api.service('audit').create(response)
        })
        // need to handle any edits to inv changes
        // probably need og copy to track changes
        // lookup inv record based on an id?
      } else {
        console.log('new transaction')
        api.service('expenses').create(this.$data.transaction).then((response) => {
          console.log('sumbitted expense', response.id)
          // submit expense to audit trail. better to use same id for expense and audit, or create expenseId?
          // probably expenseId to have seperate entries for edits (ie full trail)
          this.$data.transaction.expenseId = response.id
          let cleanTransactionData = JSON.parse(JSON.stringify(this.$data.transaction))
          this.updatePrices(cleanTransactionData)
          this.updateInventory(cleanTransactionData)
          // submit expense record for audit after price and inv methods for separate table keys
          this.$data.transaction.table = 'expenses'
          api.service('audit').create(this.$data.transaction)
        })
      }
      // moved updatePrices and Inventory to 'newTransaction' to use transaction.id
      // |-> no longer executed if loading existing transaction
      // close overlay
      this.overlay()
      // reload expenses list from rethinkdb
      api.service('expenses').find({
        query: {
          $sort: { date1: -1 }
        }
      }).then((response) => {
        this.$data.expenses = response.data
        console.log('exp resp', response.data)
      })
    },
    updateInventory (trans) {
      // first get inventory data (use store in future?)
      let inventoryData = []
      api.service('inventory').find().then((response) => {
        inventoryData = response.data
        console.log('inventoryData loaded', inventoryData)
      }).then((response) => {
        trans.transItems.forEach(item => {
          if (item.inv) {
            let tmpStock = []
            let dex = _.findIndex(inventoryData, {item: item.item}) //possible use of item.id (still need to load id to transItems)
            if ( dex < 0 ) {
              // item not in inventory. add new item
              console.log(item.item,' not in inventory ')
              let tmpObj = {
                item: item.item,
                stock: [
                  {
                    unit: item.unit,
                    qty: item.qty
                  }
                ]
              }
              api.service('inventory').create(tmpObj).then(response => {
                console.log('created new inventory item', response)
                // create audit trail
                let auditObj = {
                  table: 'inventory',
                  recordDate: trans.date1,
                  change: item.qty,
                  item: item.item,
                  unit: item.unit,
                  expenseId: trans.expenseId
                  // add user key
                }
                api.service('audit').create(auditObj)
              })
            } else {
              // update item inv
              console.log('item in inv', inventoryData)
              tmpStock = inventoryData[dex].stock // stock is a list
              let dex2 = _.findIndex(tmpStock, {unit: item.unit})
              if (dex2 < 0) {
                // no match, add unit to stock
                tmpStock.push({unit: item.unit, qty: item.qty})
              } else {
                let newQty = tmpStock[dex2].qty + item.qty // tmpStock[dex2].qty += item.qty
                tmpStock[dex2].qty = newQty 
              }
              // may not be needed // inventoryData[dex].stock = tmpStock
              // is it better to send entire inventory or item by item* (item by item leaves easier trail?)
              console.log(inventoryData[dex])
              api.service('inventory').patch(inventoryData[dex].id, {stock: tmpStock}).then((response) => {
                console.log(item.item, 'inventory updated +', item.unit, item.qty )
                // creat audit trail for inventory table
                let auditObj = {
                  table: 'inventory',
                  recordDate: trans.date1,
                  item: item.item,
                  unit: item.unit,
                  change: item.qty,
                  expenseId: trans.expenseId
                  // add user key
                }
                api.service('audit').create(auditObj)
              }) 
            }
          }
        }, this)
      })
    },
    updatePrices (trans) {
      // clean transaction data is being used
      console.log('updating prices',trans)
      console.log(this.$data.pricelist)
      trans.transItems.forEach(item => {
        // check if item is in pricelist
        let dex = _.findIndex(this.$data.pricelist, {item: item.item})
        console.log(item, dex)
        if (dex < 0) {
          console.log('item not in pricelist')
          // create new item
          let tmpObj = {
            item: item.item,
            taxable: item.taxable,
            vendors: [
              {
                unit: item.unit,
                cost: item.cost,
                updated: trans.date1,
                vendor: trans.vendor
              }
            ]
          }
          api.service('pricelist').create(tmpObj).then((response)=> {
            console.log('created new item')
            let auditObj = {
              table: 'priceList',
              recordDate: trans.date1,
              cost: item.cost,
              item: item.item,
              unit: item.unit,
              vendor: trans.vendor,
              expenseId: trans.expenseId
              // add user key
            }
            api.service('audit').create(auditObj)
          })
        } else {
          // item is in pricelist, check if unit/vendor are listed
          let tVendors = this.$data.pricelist[dex].vendors // is there reactivity? possibleBug*****
          let itemId = this.$data.pricelist[dex].id
          let d2 = _.findIndex(tVendors, {unit: item.unit, vendor: trans.vendor})
          if (d2 < 0) {
            // new unit/vendor
            console.log('newUnit/Vendor not found')
            let tmpObj = {
              unit: item.unit,
              cost: item.cost,
              updated: trans.date1,
              vendor: trans.vendor
            }
            tVendors.push(tmpObj)
            api.service('pricelist').patch(itemId, {vendors: tVendors}).then((response) => {
              console.log('added unit/vendor to pricelist')
              let auditObj = {
                table: 'priceList',
                recordDate: trans.date1,
                cost: item.cost,
                item: item.item,
                unit: item.unit,
                vendor: trans.vendor,
                expenseId: trans.expenseId
                // add user key
              }
              api.service('audit').create(auditObj)
            })
          } else {
            console.log(tVendors[d2].updated < trans.date1)
            // unit/Vendor is present, check if this record is more recent
            if (tVendors[d2].updated < trans.date1) {
              // record needs updating
              // first check if there is a price change
              console.log('newRecord')
              let diff = item.cost - tVendors[d2].cost
              console.log(diff)
              if (diff !== 0) {
                console.log(item.item, item.unit, 'price changed by', diff)
              }
              tVendors[d2] = { cost: item.cost , unit: item.unit, vendor: trans.vendor, updated: trans.date1 }
              console.log('new Vendors', tVendors[d2])
              // need to get item id, either by loading into transItems or lookup
              api.service('pricelist').patch(itemId, {vendors: tVendors }).then((response)=> {
                console.log('update pricelist', response)
                let auditObj = {
                  table: 'priceList',
                  recordDate: trans.date1,
                  cost: item.cost,
                  change: diff,
                  item: item.item,
                  unit: item.unit,
                  vendor: trans.vendor,
                  expenseId: trans.expenseId
                  // add user key
                }
                api.service('audit').create(auditObj)
              })
            }
          }
        }
      }, this)
    },
    loadExpenses() {
      api.service('expenses').find({
        paginate: false,
        query: {
          $sort: { date1: -1 },
          $limit: 50
        }
      }).then((response) => {
        this.$data.expenses = response.data
        console.log('exp resp', response.data)
      })
    }
  },
  mounted () {
    const inventory = api.service('inventory')
    // load expenses
    this.loadExpenses()
    // get pricelist data from rethinkdb
    api.service('pricelist').find({
      query: {
        $sort: { item: 1 }
      }
    }).then((response) => {
      // load pricelist data
      this.$data.pricelist = response.data
      let uniqueVendors = []
      response.data.forEach(item => {
        // create item list for autocomplete
        let o = {value: item.item, label: item.item}
        this.$data.itemList.push(o)
        //create list for each item units list for autocomplete
        this.$data.unitsList[item.item] = []
        let uniqueUnits = []
        item.vendors.forEach(unit => {
          // vendor list, for purposed of autocomplete list make sure values aren't repeated
          if (!uniqueVendors.includes(unit.vendor)) {
            let v = {value: unit.vendor, label: unit.vendor}
            this.$data.vendorsList.push(v)
            uniqueVendors.push(unit.vendor)
          }
          // units list, for purposed of autocomplete list make sure values aren't repeated
          if (!uniqueUnits.includes(unit.unit)) {
            let u = {value: unit.unit, label: unit.unit}
            this.$data.unitsList[item.item].push(u) //may have to load to temp list and push outside this loop
            uniqueUnits.push(unit.unit)
          }
        }, this)
        // list = someVar.filter((x, i, a) => a.indexOf(x) == i) //sete list with unique values
      })
    })
    /* //// 'created' service executed multiple time for one submission
    api.service('expenses').on('created', expense => {
      console.log('expense added', expense)
    })
    */
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