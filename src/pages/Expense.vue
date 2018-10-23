<!-- InventoryCheck.vue -->
<template>
  <q-page>
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
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="item"
        :pagination.sync="pagination"
        hide-bottom >
        <!--
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td key="qty" :props="props">{{ props.row.qty }}</q-td>
          <q-td key="item" :props="props">{{ props.row.item }}</q-td>
          <q-td key="unit" :props="props">{{ props.row.unit }}</q-td>
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
      </q-table>
      <br>
    </div>
    <br>
    <div class="row no-wrap">
      <q-input class="col" ref="newEntry" float-label="Qty" type="number" v-model="newItem.qty" />&nbsp;&nbsp;
      <q-input class="col" float-label="Item" v-model="newItem.item" > <q-autocomplete :static-data="{field: 'value', list: itemList}" /> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Unit" v-model="newItem.unit" @click="popupUnitList" > <q-autocomplete :static-data="{field: 'value', list: this.unitsList}" /> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Cost" type="number" v-model="newItem.cost" @keyup.enter="addItem"/>
    </div>
    <br>
    <div>
      &nbsp;&nbsp;<q-btn size="md" color="primary" label="confirm" @click="confirmInv" /> <!-- :disable not reading var -->
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
  QBtn,
  QDatetime
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
    QBtn,
    QDatetime
  },
  props: ['user'],
  data () {
    return {
      transaction:
      {
        date1: '',
        vendor: '',
        transNum: '',
        paymentAccount: '',
        transItems: [],
      },
      itemList: [],
      vendors: [],
      paymentTypes: [],
      checked: false,
      newItem: {
        qty: '',
        item: '',
        unit: '',
        cost: ''
      },
      unitsList: [],
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
          name: 'qty',
          required: true,
          label: 'Qty',
          align: 'left',
          field: 'qty'
        },
        {
          name: 'item',
          required: true,
          label: 'Item',
          align: 'left',
          field: 'item',
          sortable: true
        },
        {
          name: 'unit',
          required: true,
          label: 'Unit',
          align: 'left',
          field: 'unit'
        },
        {
          name: 'price',
          required: false,
          label: 'Price',
          align: 'left',
          field: 'price'
        },
        {
          name: 'amount',
          required: false,
          label: 'Amount',
          align: 'left',
          field: 'amount'
        },
        {
          name: 'gst',
          required: false,
          label: 'GST',
          align: 'left',
          field: 'gst'
        },
        {
          name: 'total',
          required: false,
          label: 'Total',
          align: 'left',
          field: 'total'
        },
        {
          name: 'expAccount',
          required: false,
          label: 'expAccount',
          align: 'left',
          field: 'expAccount'
        },
        {
          name: 'inv',
          required: false,
          label: 'Inv',
          align: 'left',
          field: 'inv'
        }
      ],
      visibleColumns: ['qty', 'item', 'unit', 'price', 'amount', 'gst', 'total', 'expAccount', 'inv']
    }
  },
  computed: {
  },
  methods: {
    validateVendor () {
      return true
    },
    addItem () {
      return true
    },
    popupUnitList () {
      return true
    },
    confirmInv () {
      let line = JSON.parse(JSON.stringify(this.$data.newItem))
      this.$data.transaction.transItems.push(line)
      for (let v in this.$data.newItem){
        this.$data.newItem[v] = ''
      }
      /*
      _.each(this.$data.newItem, function(value, key) {
        console.log(key,value)
        value = ''
        console.log(key,value)
      })
      */
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
          item.confirmed = false
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