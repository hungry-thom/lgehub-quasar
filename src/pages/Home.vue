<!-- InventoryCheck.vue -->
<template>
  <q-page>
    <div class="row no-wrap">
      <q-table
        :data="expenses"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="item"
        :pagination.sync="pagination"
        hide-bottom
        class="col" >
        <tr slot="header" slot-scope="props">
          <q-th key="paymentAccount" :props="props" class="bg-deep-purple-1">Payment</q-th>
          <q-th key="vendor" :props="props" class="bg-deep-purple-1">Vendor</q-th>
          <q-th key="grandTotal" :props="props" class="bg-deep-purple-1">Total</q-th>
          <q-th key="subTotal" :props="props" class="bg-deep-purple-1">Cost</q-th>
          <q-th key="gstTotal" :props="props" class="bg-deep-purple-1">prepaidGST</q-th>
          <q-th class="bg-deep-purple-2"></q-th>
          <q-th key="expAccount" :props="props">expAccount</q-th>
          <q-th key="inv" :props="props">Inv</q-th>
        </tr>
      </q-table>
      &nbsp;&nbsp;
      <q-table
        :data="sales"
        :columns="colSales"
        :visible-columns="visibleColSales"
        row-key="item"
        :pagination.sync="pagination"
        hide-bottom
        class="col" >
        <tr slot="header" slot-scope="props">
          <q-th key="inv" :props="props">Inv</q-th>
          <q-th key="expAccount" :props="props">expAccount</q-th>
          <q-th :props="props" class="bg-deep-purple-2"></q-th>
          <q-th key="gstTotal" :props="props" class="bg-deep-purple-1">payableGST</q-th>
          <q-th key="subTotal" :props="props" class="bg-deep-purple-1">Cost</q-th>
          <q-th key="grandTotal" :props="props" class="bg-deep-purple-1">Total</q-th>
          <q-th key="vendor" :props="props" class="bg-deep-purple-1">Customer</q-th>
          <q-th key="paymentAccount" :props="props" class="bg-deep-purple-1">Payment</q-th>
        </tr>
      </q-table>
      <br>
    </div>
    <br>
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
  QAutocomplete
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
    QAutocomplete
  },
  props: ['user'],
  data () {
    return {
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
      visibleColumns: ['paymentAccount', 'vendor', 'grandTotal', 'subTotal', 'gstTotal', 'expAccount', 'inv'],
      colSales: [
        {
          name: 'id',
          required: false,
          label: 'Id',
          align: 'left',
          field: 'id'
        },
        {
          name: 'inv',
          required: false,
          label: 'Inv',
          align: 'center',
          field: 'inv'
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
          name: 'gstTotal',
          required: false,
          label: 'prepaidGST',
          align: 'left',
          field: 'gstTotal',
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
          name: 'grandTotal',
          required: true,
          label: 'gTotal',
          align: 'left',
          field: 'grandTotal',
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
          name: 'paymentAccount',
          required: true,
          label: 'paymentAcct',
          align: 'left',
          field: 'paymentAccount',
          classes: "bg-deep-purple-1"
        },
      ],
      visibleColSales: [ 'inv', 'expAccount', 'gstTotal', 'subTotal', 'grandTotal', 'vendor', 'paymentAccount']
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
    deleteItemRow(row) {
      console.log('delete')
      console.log(row)
      let tmpIndex = _.findIndex(this.$data.transaction.transItems, {item: row.item})
      console.log(tmpIndex)
      this.$data.transaction.transItems.splice(tmpIndex, 1)
    },
    expandCols () {
      if (this.$data.visibleColumns.length == 10) {
        this.$data.visibleColumns = ['qty', 'item', 'unit', 'price', 'cost', 'gst', 'total', 'expand']
      } else {
        this.$data.visibleColumns = ['qty', 'item', 'unit', 'price', 'cost', 'gst', 'total', 'expAccount', 'inv', 'expand']
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
      this.$data.transaction.subTotal = this.subTotal
      this.$data.transaction.gstTotal = this.gstTotal
      this.$data.transaction.grandTotal = this.grandTotal
      api.service('expenses').create(this.$data.transaction).then((response) => {
          console.log('sumbitted expense', response.id)
          api.service('audit').create(response)
        })
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
        $sort: { item: -1}
      }
    })
      .then((response) => {
        // We want the latest inventory but in the reversed order
        this.$data.inventory = response.data.reverse()
        this.$data.inventory.forEach(item => {
          console.log(item)
          console.log('----------')
          let o = { value: item.item, label: item.item}
          this.$data.itemList.push(o)
          let og = JSON.parse(JSON.stringify(item.stock))
          // this.$data.confirmations.push( {item: item.item, confirmed: false, originalStock: og} )
        }, this) // this necessary?
        console.log(this.$data.confirmations)
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
    inventory.on('created', inv => {
      console.log('item received')
      // this.$data.inventory.push(inv)
    })
    /*
    inventory.on('updated', item => {
      console.log('item updated-feathers')
      console.log(item)
      let dex = _.findIndex(this.$data.inventory, {id: item.id})
      this.$data.inventory[dex].stock = item.stock
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