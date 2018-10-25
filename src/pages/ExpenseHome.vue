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
    <q-modal-layout class="q-pa-sm">
    <div class="row no-wrap">
      <q-datetime class= "col" minimal color="orange" v-model="transaction.date1" type="date" float-label="Date" />&nbsp;&nbsp;
      <q-input class= "col" ref="inputVendor" v-model="transaction.vendor" float-label="Vendor"  @blur="validateVendor"> <q-autocomplete :static-data="{field: 'value', list: vendors}" /></q-input>&nbsp;&nbsp;
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
      <q-input class="col" float-label="Unit" v-model="newItem.unit" @click="popupUnitList" > <q-autocomplete :static-data="{field: 'value', list: this.unitsList}" :filter="myFilter"/> </q-input>&nbsp;&nbsp;
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
    <div class="q-pa-xs">
      &nbsp;&nbsp;<q-btn size="md" color="primary" label="Cancel" @click="overlay"/>
      &nbsp;&nbsp;<q-btn size="md" color="primary" label="Submit" @click="submitExpense"/> <!-- :disable not reading var -->
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
      vendors: [
        {
          value: 'Helen',
          label: 'Helen'
        },
        { 
          value: 'Madisco',
          label: 'Madisco'
        }
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
      unitsList: [],
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
        date1: '',
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
        delete this.$data.transaction['id']
        api.service('expenses').update(tmpId, this.$data.transaction).then((response) => {
          console.log('sumbitted expense', response.id)
          delete response['id']
          api.service('audit').create(response)
        })
      } else {
        console.log('new transaction')
        api.service('expenses').create(this.$data.transaction).then((response) => {
          console.log('sumbitted expense', response.id)
          api.service('audit').create(response)
        })
      }
      this.overlay()
      // load expenses
      api.service('expenses').find({
        query: {
          $sort: { date1: -1 }
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
    api.service('expenses').find({
      query: {
        $sort: { date1: -1 }
      }
    }).then((response) => {
      this.$data.expenses = response.data
      console.log('exp resp', response.data)
    })
    // Get inventory (should change to priceList) for items, vendors, (and prices?)
    inventory.find({
      query: {
        $sort: { item: -1}
      }
    })
      .then((response) => {
        // We want the latest inventory but in the reversed order
        this.$data.inventory = response.data.reverse()
        this.$data.inventory.forEach(item => {
          let o = { value: item.item, label: item.item}
          this.$data.itemList.push(o)
          let og = JSON.parse(JSON.stringify(item.stock))
          // this.$data.confirmations.push( {item: item.item, confirmed: false, originalStock: og} )
        }, this) // this necessary?
        console.log(this.$data.confirmations)
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