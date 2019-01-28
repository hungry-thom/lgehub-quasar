<!-- ExpenseHome.vue -->
<template>
  <q-page class="layout-padding">
    <div>
      <q-field helper="Search Options">
        <q-option-group
          inline
          type="radio"
          v-model="dateOption"
          :options="[
            { label: 'Date', value: 'date' },
            { label: 'Range', value: 'range',  },
            { label: 'noDate', value: 'noDate' }
          ]"
        />
        <q-option-group
          inline
          type="checkbox"
          v-model="searchOption"
          :options="[
            { label: 'Vendor', value: 'vendor' }
          ]"
        />
      </q-field>
    </div>
    <div class="row no-wrap">
      <q-datetime class= "col" minimal color="orange" stack-label="Date" v-model="startDate" type="date" :first-day-of-week="0" v-if="dateOption !== 'noDate'" />&nbsp;&nbsp;
      <q-datetime class= "col" minimal color="orange" stack-label="endDate" v-model="endDate" type="date" :first-day-of-week="0" v-if="dateOption.includes('range')" />&nbsp;&nbsp;
      <q-input class= "col" split minimal color="orange" v-model="searchVendor" stack-label="Vendor" v-if="searchOption.includes('vendor')"> <q-autocomplete :static-data="{field: 'value', list: vendorsList}" /></q-input>&nbsp;&nbsp;
      <q-input class= "col" minimal color="orange" stack-label="Item" v-model="searchItem" v-if="searchOption.includes('item')" />&nbsp;&nbsp;
      <!-- <q-datetime class= "col" minimal color="orange" v-model="endDate" type="date" float-label="EndDate" :first-day-of-week="0" />&nbsp;&nbsp; -->
      <q-btn label="search" color="secondary" @click="loadExpenses(startDate, startDate)" />
    </div>
    <br>
    <div>
      <q-table
        :data="expenses"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="item"
        :pagination.sync="pagination"
        :loading="loading"
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
    <q-modal v-model="expenseModal" :maximized="boolScreen" :no-backdrop-dismiss="true" >
    <q-modal-layout> <!-- class="q-pa-sm" -->
      <q-toolbar slot="header">
        <q-btn
          flat
          icon="keyboard_backspace"
          @click="overlay"
        />
        <q-btn
          flat
          icon="fullscreen"
          @click="toggleFullscreen"
        />
        <q-toolbar-title>
          Enter/Edit Expense
        </q-toolbar-title>
        &nbsp;&nbsp;<q-btn size="md" color="negative" label="Delete Expense" @click="deleteExpense()" v-if="transaction.id" />
      </q-toolbar>
      <div slot="footer">
        <div class="q-pa-xs float-right">
          &nbsp;&nbsp;<q-btn size="md" color="primary" label="Cancel" @click="overlay"/>
          &nbsp;&nbsp;<q-btn size="md" color="primary" label="Submit" @click="submitExpense"/> <!-- :disable not reading var -->
        </div>
      </div>
    <div class="q-pa-sm">
    <div class="row no-wrap">
      <q-datetime class= "col" minimal color="orange" v-model="transaction.date1" type="date" float-label="Date" @input="selectDate" :first-day-of-week="0" />&nbsp;&nbsp;
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
          <q-th key="category" :props="props">Category</q-th>
          <q-th key="taxable" :props="props" >Taxable</q-th> <!-- width='25px'><q-btn size="sm" round dense color="secondary" icon="code" class="q-mr-xs" @click="expandCols" /></q-th> -->
           <q-th key="expand" :props="props">Pricelist/Inv</q-th>
        </tr>
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td key="qty" :props="props" class="bg-deep-purple-1">
            {{ props.row.qty || '-' }}
            <q-popup-edit v-model="props.row.qty" title="update" @save="editItemValues(props.row)" :persistent="true" buttons>
              <q-input v-model="props.row.qty" type="number" />
            </q-popup-edit>
          </q-td>
          <q-td key="item" :props="props" class="bg-deep-purple-1">
            {{ props.row.item || '-' }}
            <q-popup-edit v-model="props.row.item" title="Update" :persistent="true" buttons>
              <q-input v-model="props.row.item" > <q-autocomplete :static-data="{field: 'value', list: itemList}" :filter="myFilter" /> </q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="unit" :props="props" class="bg-deep-purple-1" >
            {{ props.row.unit || '-' }}
            <q-popup-edit v-model="props.row.unit" title="Update" :persistent="true" buttons>
              <q-input v-model="props.row.unit" />
            </q-popup-edit>
          </q-td>
          <q-td key="price" :props="props" class="bg-deep-purple-1" >{{ props.row.price || '-' }}</q-td>
          <q-td key="cost" :props="props" class="bg-deep-purple-1" >
            {{ props.row.cost || '-' }}
            <q-popup-edit v-model="props.row.cost"  title="Update" @save="editCost(props.row)" :persistent="true" buttons>
              <q-input v-model="props.row.cost" type="number" />
            </q-popup-edit>
          </q-td>
          <q-td key="gst" :props="props" class="bg-deep-purple-1" >{{ props.row.gst || '-' }}</q-td>
          <q-td key="total" :props="props" class="bg-deep-purple-2" >
            {{ props.row.total || '-' }}
            <q-popup-edit v-model="props.row.total" title="update" @save="editItemValues(props.row)" :persistent="true" buttons>
              <q-input v-model="props.row.total" type="number" />
            </q-popup-edit>
          </q-td>
          <q-td key="expAccount" :props="props">
            {{ props.row.expAccount || '-' }}
            <q-popup-edit v-model="props.row.expAccount" title="Update" :persistent="true" buttons>
              <q-input v-model="props.row.expAccount" > <q-autocomplete :static-data="{field: 'value', list: expAccountList}" :filter="myFilter" /> </q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="category" :props="props">
            {{ props.row.category || '-' }}
            <q-popup-edit v-model="props.row.category" title="Update" :persistent="true" buttons>
              <q-input v-model="props.row.category" > <q-autocomplete :static-data="{field: 'value', list: categoryList}" :filter="myFilter" /> </q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="taxable" :props="props">
            {{ props.row.taxable || '-' }}
            <q-popup-edit v-model="props.row.taxable" title="Update" @save="editItemValues(props.row)" buttons>
              <q-checkbox v-model="props.row.taxable" label="Taxable" true-value="yes" false-value="no" />
            </q-popup-edit>
          </q-td>
          <q-td key="expand" :props="props">
            <div class="row items-center justify-between no-wrap">
              <q-checkbox v-model="props.row.add2Pricelist" checked-icon="attach_money" unchecked-icon="money_off" />
              <q-checkbox v-model="props.row.add2Inventory" checked-icon="assignment" unchecked-icon="no_sim" class="q-mr-sm" />
              <q-btn size="sm" round dense color="secondary" icon="delete" @click="deleteItemRow(props.row)" class="q-mx-xs" />
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
      <q-input class="col" float-label="Item" v-model="newItem.item" @blur="linkCategory" > <q-autocomplete :static-data="{field: 'value', list: itemList}" :filter="myFilter"/> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Unit" v-model="newItem.unit" @click="popupUnitList" > <q-autocomplete :static-data="{field: 'value', list: computedUnitsList}" :filter="myFilter"/> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Cost" type="number" v-model="newItem.amount" @keyup.enter="addItem" />
      <div class="q-pt-md">
        <q-checkbox v-model="newItem.taxable" label="Taxable" true-value="yes" false-value="no" />
        <br>
        <q-checkbox v-model="gstIncluded" label="GST Included" true-value="yes" false-value="no" :disable="gstIncludedVisibility" />
      </div>
    </div>
    <div class="row no-wrap">
      <q-input class="col" float-label="exp Account" v-model="newItem.expAccount" @keyup.enter="addItem" > <q-autocomplete :static-data="{field: 'value', list: expAccountList}" :filter="myFilter" /> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Category" v-model="newItem.category" @keyup.enter="addItem"> <q-autocomplete :static-data="{field: 'value', list: categoryList}" :filter="myFilter" /> </q-input>&nbsp;&nbsp;
      <div class="q-pt-md">
        <q-checkbox v-model="newItem.add2Inventory" label="add2Inventory" tabindex=-1 /><br>
        <q-checkbox v-model="newItem.add2Pricelist" label="add2Pricelist" tabindex=-1 /><br>
      </div>
    </div>
    <br>
    <div class="row no-wrap">
      <div class="q-pl-md">
        &nbsp;&nbsp;<q-btn size="md" color="primary" label="add Item" @click="addItem" />
      </div>
      <div class="q-pl-md">
        <q-checkbox v-model="lockAccount" label="Lock Account" /><br>
        <q-checkbox v-model="lockCategory" label="Lock Category" /><br>
      </div>
    </div>
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
  QDatetimePicker,
  QAutocomplete,
  QModal,
  QModalLayout,
  QOptionGroup,
  QField
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
    QDatetimePicker,
    QAutocomplete,
    QModal,
    QModalLayout,
    QOptionGroup,
    QField
  },
  props: ['user'],
  data () {
    return {
      loading: true,
      dateOption: 'date',
      searchOption: [''],
      searchVendor: '',
      searchItem: '',
      lockAccount: true,
      lockCategory: true,
      boolScreen: false,
      startDate: '',
      endDate: '',
      expenseModal: false,
      expenses: [],
      sales: [],
      transaction:
      {
        date1: '',
        vendor: '',
        transNum: '',
        paymentAccount: '',
        transItems: []
      },
      itemList: [],
      categoryList: [],
      itemCategory: [],
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
      expAccountList: [
        {
          value: 'COGS:restaurant',
          label: 'COGS:restaurant'
        },
        {
          value: 'COGS:meatshop',
          label: 'COGS:meatshop'
        },
        {
          value: 'COGS:farm',
          label: 'COGS:farm'
        },
        {
          value: 'COGS:lge',
          label: 'COGS:lge'
        },
        {
          value: 'opExp:restaurant',
          label: 'opExp:restaurant'
        },
        { 
          value: 'opExp:meatshop',
          label: 'opExp:meatshop'
        },
        { 
          value: 'opExp:farm',
          label: 'opExp:farm'
        },
        { 
          value: 'opExp:lge',
          label: 'opExp:lge'
        },
        { 
          value: 'employee',
          label: 'employee'
        }
      ],
      checked: false,
      newItem: {
        qty: '',
        item: '',
        unit: '',
        amount: '',
        expAccount: '',
        category: '',
        taxable: 'yes',
        add2Inventory: false,
        add2Pricelist: true
      },
      unitsList: {},
      pricelist: [],
      inventoryData: [],
      gstIncluded: 'yes',
      pagination: {
        sortBy: name, // String, column 'item' property value
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
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'paymentAccount',
          required: true,
          label: 'paymentAcct',
          align: 'left',
          field: 'paymentAccount',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'vendor',
          required: true,
          label: 'Vendor',
          align: 'left',
          field: 'vendor',
          sortable: true,
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'grandTotal',
          required: true,
          label: 'gTotal',
          align: 'left',
          field: 'grandTotal',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'subTotal',
          required: false,
          label: 'sTotal',
          align: 'left',
          field: 'subTotal',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'gstTotal',
          required: false,
          label: 'prepaidGST',
          align: 'left',
          field: 'gstTotal',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'expAccount',
          required: false,
          label: 'expAccount',
          align: 'left',
          field: 'expAccount',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'category',
          required: false,
          label: 'Category',
          align: 'center',
          field: 'category'
        }
      ],
      visibleColumns: ['date1', 'paymentAccount', 'vendor', 'grandTotal', 'subTotal', 'gstTotal', 'expAccount', 'category'],
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
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'item',
          required: true,
          label: 'Item',
          align: 'left',
          field: 'item',
          sortable: true,
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'unit',
          required: true,
          label: 'Unit',
          align: 'left',
          field: 'unit',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'price',
          required: false,
          label: 'Price',
          align: 'left',
          field: 'price',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'cost',
          required: false,
          label: 'Cost',
          align: 'left',
          field: 'cost',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'gst',
          required: false,
          label: 'GST',
          align: 'left',
          field: 'gst',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'total',
          required: false,
          label: 'Total',
          align: 'left',
          field: 'total',
          classes: 'bg-deep-purple-2'
        },
        {
          name: 'expAccount',
          required: false,
          label: 'expAccount',
          align: 'center',
          field: 'expAccount'
        },
        {
          name: 'category',
          required: false,
          label: 'Category',
          align: 'center',
          field: 'category'
        },
        {
          name: 'taxable',
          required: false,
          label: 'Taxable',
          align: 'center',
          field: 'taxable'
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
      visibleModalColumns: ['qty', 'item', 'unit', 'price', 'cost', 'gst', 'total', 'expAccount', 'category', 'taxable', 'expand']
    }
  },
  computed: {
    computedUnitsList () {
      if (this.$data.unitsList[this.$data.newItem.item]) {
        return this.$data.unitsList[this.$data.newItem.item]
      } else {
        return []
      }
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
      if (this.$data.newItem.taxable === 'yes') {
        return false
      } else {
        this.$data.gstIncluded = 'no'
        return true
      }
    }
  },
  methods: {
    editCost (row) {
      if (row.taxable === 'yes') {
        row.gst = _.round((row.cost * 0.125), 2)
      } else {
        row.gst = 0
      }
      row.total = _.round((row.gst + row.cost), 2)
      row.price = _.round((row.cost / row.qty), 2)
    },
    editItemValues (row) {
      if (row.taxable === 'yes') {
        row.cost = _.round((row.total / 1.125), 2)
        row.gst = _.round((row.cost * 0.125), 2)
      } else {
        row.cost = row.total
        row.gst = 0
      }
      row.price = _.round((row.cost / row.qty), 2)
    },
    toggleFullscreen () {
      this.$data.boolScreen = !this.$data.boolScreen
      console.log('fullscreen', this.$data.boolScreen)
    },
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
      this.$data.transaction = JSON.parse(JSON.stringify(row))
      this.overlay()
      /*
      this.$q.notify({
        message: row.id,
        timeout: 3000,
        position: 'center'
      })
      */
    },
    linkCategory () {
      let n = _.findIndex(this.$data.itemCategory, {item: this.$data.newItem.item})
      if (n > -1) {
        this.$data.newItem.category = this.$data.itemCategory[n].category
        console.log('link', this.$data.itemCategory[n])
        if (this.$data.itemCategory[n].inventory) {
          this.$data.newItem.add2Inventory = true 
        } else {
          this.$data.newItem.add2Inventory = false
        }
      } else {
        this.$data.newItem.add2Inventory = false
      }
      if (this.computedUnitsList) {
        if (this.computedUnitsList.length === 1) {
          console.log(this.computedUnitsList)
          this.$data.newItem.unit = this.computedUnitsList[0].label
        }
      }
      let x = _.findIndex(this.$data.pricelist, {item: this.$data.newItem.item})
      if (x > -1) {
        this.$data.newItem.taxable = this.$data.pricelist[x].taxable
      }
    },
    newExpense () {
      let carryOver = this.$data.transaction.add2Pricelist // maintain value
      this.$data.transaction = {
        date1: this.$data.startDate, // may have to alter with new search options
        vendor: '',
        transNum: '',
        paymentAccount: '',
        transItems: [],
        add2Pricelist: carryOver
      }
      this.overlay()
    },
    overlay () {
      console.log('overlaycalled',this.$data.newItem.add2Inventory, this.$data.transaction.add2Pricelist)
      this.$data.newItem = {
        qty: '',
        item: '',
        unit: '',
        amount: '',
        expAccount: '',
        category: '',
        taxable: 'yes',
        add2Inventory: false,
        add2Pricelist: true
      }
      this.$data.expenseModal = !this.$data.expenseModal
      this.$refs.inputVendor.focus()
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
      let tmpIndex = _.findIndex(this.$data.transaction.transItems, {item: row.item, qty: row.qty, cost: row.cost})
      console.log(tmpIndex)
      this.$data.transaction.transItems.splice(tmpIndex, 1)
    },
    expandCols () {
      if (this.$data.visibleModalColumns.length === 10) {
        this.$data.visibleModalColumns = ['qty', 'item', 'unit', 'price', 'cost', 'gst', 'total', 'expand']
      } else {
        this.$data.visibleModalColumns = ['qty', 'item', 'unit', 'price', 'cost', 'gst', 'total', 'expAccount', 'category', 'expand']
      }
    },
    validateVendor () {
      return true
    },
    popupUnitList () {
      return true
    },
    addItem () {
      console.log('start',this.$data.newItem.taxable)
      let line = JSON.parse(JSON.stringify(this.$data.newItem))
      // check if unit is correct format
      if (!line.unit.includes('-')) {
        this.$q.notify({
          message: 'Unit missing dash -',
          timeout: 3000,
          position: 'center'
        })
      } else {
        // make sure account is entered
        if (line.expAccount !== '') {
          if (this.$data.newItem.taxable === 'yes') {
            if (this.$data.gstIncluded === 'yes') {
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
          line.price = _.round((line.cost / line.qty), 2)
          line.total = _.round((line.gst + line.cost), 2)
          delete line['amount']
          this.$data.transaction.transItems.push(line)
          console.log('line Item', line)
          // clear fields for new item
          let tempItem = {
            qty: '',
            item: '',
            unit: '',
            amount: '',
            taxable: this.$data.newItem.taxable,
            add2Inventory: this.$data.newItem.add2Inventory,
            add2Pricelist: this.$data.newItem.add2Pricelist
          }
          if (this.$data.lockAccount) {
            tempItem.expAccount = this.$data.newItem.expAccount
          } else {
            tempItem.expAccount = ''
          }
          if (this.$data.lockCategory) {
            tempItem.category = this.$data.newItem.category
          } else {
            tempItem.category = ''
          }
          this.$data.newItem = tempItem
        } else {
          console.log('expAccount needs value')
          this.$q.notify({
            message: 'expAccount needs value',
            timeout: 3000,
            position: 'center'
          })
        }
        this.$refs.newEntry.focus()
        console.log('end',this.$data.newItem.taxable)
      }
    },
    submitExpense () {
      console.log('test', this.$data.newItem.qty && this.$data.newItem.item && this.$data.newItem.unit && this.$data.newItem.amount)
      console.log(this.$data.newItem.qty, this.$data.newItem.item, this.$data.newItem.unit, this.$data.newItem.amount)
      if (this.$data.newItem.qty && this.$data.newItem.item && this.$data.newItem.unit && this.$data.newItem.amount) {
        this.$q.notify({
          message: 'new Item data not added to list',
          timeout: 3000,
          position: 'center'
        })
      } else {
        // save computed values to transaction.object
        this.$data.transaction.subTotal = this.subTotal
        this.$data.transaction.gstTotal = this.gstTotal
        this.$data.transaction.grandTotal = this.grandTotal
        // check if this is an exsisting transaction 
        let tmpId = this.$data.transaction.id
        if (tmpId) {
          // if transaction is modified, changes need to be recorded
          // if account changed, original acct needs to be reversed
          console.log('existing transaction', tmpId)
          // sdelete this.$data.transaction['id']
          api.service('expenses').update(tmpId, this.$data.transaction).then((response) => {
            console.log('sumbitted expense', response.id)
            delete response['id']
            api.service('audit').create(response) // no indication that this was an update?
            // what payable account asset - liability
            // whether it is asset or liability, will still be a creditEntry
            journalObject.credit.push({
              account: this.$data.transaction.paymentAccount,
              amount: this.$data.transaction.grandTotal
            })
            let gstMonth = moment(this.$data.transaction.date1).format('MMM')  
            if (this.$data.transaction.gstTotal) {
              journalObject.debit.push({
                account: 'preGst'+ gstMonth,
                amount: this.$data.transaction.gstTotal
              })
            }
            this.$data.transaction.transItems.forEach((item) => {
              journal.Object.debit.push({
                account: item.expAccount,
                amount: item.trans
              })
            })
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
            // can choose to not register to pricelist
            this.updatePrices(cleanTransactionData)
            // inventory updata is based line by line
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
        // this.loadExpenses(this.$data.startDate, this.$data.endDate)
        this.$data.startDate = this.$data.transaction.date1
        this.loadExpenses()
      }
    },
    updateInventory (trans) {
      // first get inventory data (use store in future?)
      trans.transItems.forEach(item => {
        if (item.add2Inventory) {
          let actualUnit = ''
          let actualQty = 0
          // need to break out unit if entered as a case
          let i = item.unit.search('x')
          if (i > -1) {
            // multiple number before 'x' to get qty
            actualQty = item.qty * item.unit.substr(0,i)
            // get the actual unit
            actualUnit = item.unit.substr(i + 1)
          } else {
            actualUnit = item.unit
            actualQty = item.qty
          }
          let tmpStock = []
          let dex = _.findIndex(this.inventoryData, {item: item.item}) //possible use of item.id (still need to load id to transItems)
          if ( dex < 0 ) {
            // item not in inventory. add new item
            console.log(item.item,' not in inventory ')
            let tmpObj = {
              item: item.item,
              lastConf: new Date().toISOString(),
              category: item.category,
              stock: [
                {
                  unit: actualUnit,
                  qty: actualQty
                }
              ]
            }
            this.inventoryData.push(tmpObj)
            api.service('inventory').create(tmpObj).then(response => {
              console.log('created new inventory item', response)
              // create audit trail
              let auditObj = {
                table: 'inventory',
                type: 'expense',
                recordDate: trans.date1,
                change: actualQty,
                item: item.item,
                unit: actualUnit,
                expenseId: trans.expenseId,
                user: this.$props.user.email
              }
              api.service('audit').create(auditObj)
            })
          } else {
            // update item inv
            console.log('item in inv', this.inventoryData)
            tmpStock = this.inventoryData[dex].stock // stock is a list
            let dex2 = _.findIndex(tmpStock, {unit: actualUnit})
            if (dex2 < 0) {
              // no match, add unit to stock
              tmpStock.push({unit: actualUnit, qty: actualQty})
            } else {
              let newQty = tmpStock[dex2].qty + actualQty // tmpStock[dex2].qty += actualQty
              tmpStock[dex2].qty = newQty 
            }
            // may not be needed // inventoryData[dex].stock = tmpStock
            // is it better to send entire inventory or item by item* (item by item leaves easier trail?)
            console.log(this.inventoryData[dex])
            api.service('inventory').patch(this.inventoryData[dex].id, {stock: tmpStock}).then((response) => {
              console.log(item.item, 'inventory updated +', actualUnit, actualQty )
              // creat audit trail for inventory table
              let auditObj = {
                table: 'inventory',
                type: 'expense',
                recordDate: trans.date1,
                item: item.item,
                unit: actualUnit,
                change: actualQty,
                expenseId: trans.expenseId,
                user: this.$props.user.email
              }
              api.service('audit').create(auditObj)
            }) 
          }
        }
      }, this)
    },
    updatePrices (trans) {
      // clean transaction data is being used
      console.log('updating prices',trans)
      console.log(this.$data.pricelist)
      trans.transItems.forEach(item => {
        if (item.add2Pricelist) {
          // check if item is in pricelist
          let dex = _.findIndex(this.$data.pricelist, {item: item.item})
          console.log(item, dex)
          // make sure item.item is not discount
          if (item.item.toLowerCase() !== 'discount') {
            if (dex < 0) {
              console.log('item not in pricelist')
              // create new item
              let tmpObj = {
                item: item.item,
                taxable: item.taxable,
                category: item.category,
                vendors: [
                  {
                    unit: item.unit,
                    price: item.price,
                    updated: trans.date1,
                    vendor: trans.vendor
                  }
                ]
              }
              this.$data.pricelist.push(tmpObj) //this should prevent new items getting added twice
              api.service('pricelist').create(tmpObj).then((response)=> {
                console.log('created new item')
                let auditObj = {
                  table: 'priceList',
                  type: 'expense',
                  recordDate: trans.date1,
                  price: item.price,
                  item: item.item,
                  unit: item.unit,
                  vendor: trans.vendor,
                  expenseId: trans.expenseId,
                  user: this.$props.user.email
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
                  price: item.price,
                  updated: trans.date1,
                  vendor: trans.vendor
                }
                tVendors.push(tmpObj)
                api.service('pricelist').patch(itemId, {vendors: tVendors}).then((response) => {
                  console.log('added unit/vendor to pricelist')
                  let auditObj = {
                    table: 'priceList',
                    type: 'expense',
                    recordDate: trans.date1,
                    price: item.price,
                    item: item.item,
                    unit: item.unit,
                    vendor: trans.vendor,
                    expenseId: trans.expenseId,
                    user: this.$props.user.email
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
                  let diff = item.price - tVendors[d2].price
                  console.log(diff)
                  if (diff !== 0) {
                    console.log(item.item, item.unit, 'price changed by', diff)
                  }
                  tVendors[d2] = { price: item.price , unit: item.unit, vendor: trans.vendor, updated: trans.date1 }
                  console.log('new Vendors', tVendors[d2])
                  // need to get item id, either by loading into transItems or lookup
                  api.service('pricelist').patch(itemId, {vendors: tVendors }).then((response)=> {
                    console.log('update pricelist', response)
                    let auditObj = {
                      table: 'priceList',
                      type: 'expense',
                      recordDate: trans.date1,
                      price: item.price,
                      change: diff,
                      item: item.item,
                      unit: item.unit,
                      vendor: trans.vendor,
                      expenseId: trans.expenseId,
                      user: this.$props.user.email
                    }
                    api.service('audit').create(auditObj)
                  })
                }
              }
            }
          } // skip everything if item is discount
        } // else -do not add to pricelist
      }, this)
    },
    loadExpenses() {
      this.$data.loading = true
      // create query based on search options
      // date
      let queryStr = '{'
      if (this.$data.dateOption !== 'noDate') {
        let sDate = moment(new Date(this.$data.startDate))
        sDate.startOf('day')
        queryStr = `${queryStr} "date1": { "$gte": "${sDate.format()}"`
      }
      if (this.$data.dateOption === 'range') {
        let eDate = moment(new Date(this.$data.endDate))
        eDate.endOf('day')
        queryStr = `${queryStr}, "$lte": "${eDate.format()}" }`
      } else if (this.$data.dateOption !== 'noDate') {
        let eDate = moment(new Date(this.$data.startDate))
        eDate.endOf('day')
        queryStr = `${queryStr}, "$lte": "${eDate.format()}" }`
      }
      if (this.$data.dateOption !== 'noDate' && this.$data.searchOption.length !== 0){
        queryStr = `${queryStr},`
      }
      if (this.$data.searchOption.includes('vendor')) {
        queryStr = `${queryStr} "vendor": "${this.$data.searchVendor}",`
      }
      queryStr = `${queryStr} "$sort": { "date1": -1}, "$limit": 200 }`
      console.log(queryStr)
      let queryObj = JSON.parse(queryStr)
      if (this.$data.dateOption === 'noDate' && this.$data.searchOption[0] === '') {
        this.$q.notify({
          message: 'Select a field to search',
          timeout: 3000,
          position: 'center'
        })
      } else {
        api.service('expenses').find({
          paginate: false,
          query: queryObj
        }).then((response) => {
          this.$data.expenses = response.data
          console.log('exp resp', response.data)
          this.$data.loading = false
        }).catch((err) => {
          this.$q.notify({
            message: `Error: ${err}`,
            timeout: 3000,
            position: 'center'
          })
          this.$data.loading = true
          console.log(err)
          if (err.code === 401) {
            console.log('code check', err.code)
            // console.log(this.$data.showDialog) // = true
            this.$router.push({ name: 'signin' })
          }
        })
      }
    },
    loadPricelistData(skipNum) {
      // there will be a problem if docs exceed 200
      api.service('pricelist').find({
        query: {
          $sort: { item: 1 },
          $limit: 500, // maximum is 200
          $skip: skipNum * 200
        }
      }).then((response) => {
        // this.$data.itemCategory = [] // moved to loadData(), kept clearing on multiple loads
        // let uniqueVendors = [] // moved to loadData(), kept clearing on multiple loads
        response.data.forEach(item => {
          this.$data.pricelist.push(item)
          this.$data.itemCategory.push({item:item.item, category:item.category})
          let check = _.findIndex(this.$data.categoryList, {value: item.category})
          console.log('check',this.$data.categoryList, item.category)
          if (check < 0) {
            let c = {value: item.category, label: item.category}
            this.$data.categoryList.push(c)
          }
          // create item list for autocomplete
          ///// Item and unit autocomplete list will be handled by inventory date, no
          let o = {value: item.item, label: item.item}
          this.$data.itemList.push(o)
          //create list for each item units list for autocomplete
          this.$data.unitsList[item.item] = []
          
          let uniqueUnits = []
          item.vendors.forEach(unit => {
            // vendor list, for purposed of autocomplete list make sure values aren't repeated
            if (!this.$data.uniqueVendors.includes(unit.vendor)) {
              let v = {value: unit.vendor, label: unit.vendor}
              this.$data.vendorsList.push(v)
              this.$data.uniqueVendors.push(unit.vendor)
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
        console.log('response0', response.data.length)
        // handle more than 200
        if (response.data.length > 199) {
          console.log('rerun load pricelist')
          this.$data.skipCycles++
          this.loadPricelistData(this.$data.skipCycles)
        } else {
          console.log('LOAD INVENTORYDATA?!!!!!!!!!!!!!')
          this.inventoryData = []
          this.loadInventoryData(0)
        }
      })
    },
    loadInventoryData (skipNum) {
      // temp function, eventually all will be handled by pricelist data
      api.service('inventory').find({
        query: {
          $sort: { item: 1 },
          $limit: 500, // maximum is 200
          $skip: skipNum * 200
        }
      }).then((response) => {
        // code: this.$data.itemCategory = []
        console.log(response)
        response.data.forEach(item => {
          this.inventoryData.push(item)
          // code: this.$data.itemCategory.push({item:item.item, category:item.category})
          // create item list for autocomplete
          let d = _.findIndex(this.$data.itemList, {value: item.item})
          if (item.item === 'BalsamicVinegar') { // REMOVE
            console.log('WHat', d, item)
          }
          if (d < 0) {
            let o = {value: item.item, label: item.item}
            this.$data.itemList.push(o)
            //create list for each item units list for autocomplete
            this.$data.unitsList[item.item] = []
            //let uniqueUnits = []
            item.stock.forEach(unit => {
              let u = {value: unit.unit, label: unit.unit}
              this.$data.unitsList[item.item].push(u)
            }, this)
            this.$data.itemCategory.push({item: item.item, category: item.category, inventory: true})
            if (item.item === 'BalsamicVinegar') { // REMOVE
              console.log('WHat2', _.findIndex(this.$data.itemCategory, {item: item.item}), this.$data.itemCategory)
            }
            let check = _.findIndex(this.$data.categoryList, {value: item.category})
            console.log('check',this.$data.categoryList, item.category)
            if (check < 0) {
              let c = {value: item.category, label: item.category}
              this.$data.categoryList.push(c)
            }
          } else {
            let ind = _.findIndex(this.$data.itemCategory, {item: item.item})
            if (ind > -1) {
              console.log('inventory true', item.item)
              this.$data.itemCategory[ind].inventory = true
            }
          }
          // list = someVar.filter((x, i, a) => a.indexOf(x) == i) //sete list with unique values
        })
        if (response.data.length > 199) {
          console.log('rerun load pricelist')
          skipNum++
          this.loadInventoryData(skipNum)
        }
      })
    },
    loadData () {
      this.$data.pricelist = []
      this.$data.skipCycles = 0
      this.$data.itemCategory = []
      this.$data.uniqueVendors = []
      this.loadPricelistData(this.$data.skipCycles)
    }
  },
  mounted () {
    const inventory = api.service('inventory')
    // load expenses
    this.$data.startDate = new Date()
    this.$data.endDate = this.$data.startDate // new Date()
    this.loadExpenses(this.$data.startDate, this.$data.startDate)
    this.loadData()
    /* //// 'created' service executed multiple time for one submission
    api.service('expenses').on('created', expense => {
      console.log('expense added', expense)
      // check if expense is already added, in cases where created service is executed multiple times
      let i = _.findIndex(this.$data.expenses, {id: expense.id})
      if (i > -1) {
        this.$data.expenses[i] = expense
      } else {
        this.$data.expenses.push(expense)
      }
    })
    api.service('expenses').on('updated', expense => {
      console.log('expense added', expense)
      // check if expense is already added, in cases where created service is executed multiple times
      let i = _.findIndex(this.$data.expenses, {id: expense.id})
      if (i > -1) {
        this.$data.expenses[i] = expense
      } else {
        this.$data.expenses.push(expense)
      }
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