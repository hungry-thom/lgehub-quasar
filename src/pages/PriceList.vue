
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="pricelist"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          row-key="item"
          :pagination.sync="pagination"
          :loading="loading" >
          <template slot="top-left" slot-scope="props">
            <q-search
              hide-underline
              color="secondary"
              v-model="filter"
              class="col-6"
            />
          </template>
          <template slot="top-right" slot-scope="props">
            <q-btn-dropdown color="primary" :label="categoryValue" >
              <q-list link>
                <q-item v-for="n in categoryArray" :key="`1.${n}`" v-close-overlay @click.native="showNotification(n)">
                  <q-item-main>
                    <q-item-tile label>{{ n }}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </template>
          <template slot="body" slot-scope="props">
            <q-tr :props="props" @dblclick.native="overlay(props.row)">
              <!-- <q-tooltip :delay="1000">Double Click to add to {{ props.row.item }} </q-tooltip> -->
              <q-td key="item" :props="props">
                <q-checkbox color="primary" v-model="props.expand" unchecked-icon="add" checked-icon="remove" class="q-mr-md" />
                {{ props.row.item }}
              </q-td>
              <q-td key="taxable" :props="props">
                taxable: {{ props.row.taxable }}
              </q-td>
              <q-td key="customLabel" :props="props">
                {{ props.row.customLabel || '' }}
                <q-btn size="sm" round dense color="secondary" icon="playlist_add" @click="customValueDialog(props.row)" class="q-mr-xs" />
              </q-td>
              <q-td key="track" :props="props">
                <q-btn size="sm" round color="secondary" icon="history" @click="priceOverlay(props.row)" class="q-mr-xs" />
                <q-btn size="sm" round color="secondary" icon="add" @click="overlay(props.row)" class="q-mr-xs" />
              </q-td>
              <!--<q-tooltip>I'd like to eat "{{ props.row.name }}"</q-tooltip>-->
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <q-table
                  :data="props.row.vendors"
                  :columns="columns2"
                  :visible-columns="visibleColumns2"
                  row-key="props.row.vendors.vendor"
                  hide-bottom >
                  <q-tr slot="header" slot-scope="props">
                    <q-th key="vendor" :props="props">Vendor</q-th>
                    <q-th key="unit" :props="props">Unit</q-th>
                    <q-th key="price" :props="props">Price</q-th>
                    <q-th key="compValue" :props="props">compValue</q-th>
                    <q-th key="compBase" :props="props">compBase</q-th>
                    <q-th key="custom" :props="props">custom</q-th>
                    <q-th key="buttons" :props="props" width='25px'>
                      <!-- <q-btn size="sm" round dense color="secondary" icon="info" @click="overlay(props.row)" class="q-mr-xs" /> -->
                    </q-th>
                  </q-tr>
                  <q-tr slot="body" slot-scope="props" :props="props">
                    <q-td key="vendor" :props="props">{{ props.row.vendor }}</q-td>
                    <q-td key="unit" :props="props">{{ props.row.unit }}</q-td>
                    <q-td key="price" :props="props">{{ props.row.price }}</q-td>
                    <q-td key="compValue" :props="props">{{ props.row.compValue }}</q-td>
                    <q-td key="compBase" :props="props">{{ props.row.compBase }}</q-td>
                    <q-td key="custom" :props="props">{{ props.row.custom }}</q-td>
                    <q-td key="buttons" :props="props">
                      <q-btn size="sm" color="secondary" round dense icon="edit" @click="overlay(props.row)"/>
                    </q-td>
                  </q-tr>
                </q-table>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <br>
      </div>
      <!-- //////// START OF add stock MODAL  ////////-->
      <q-modal v-model="addItemModal">
        <q-modal-layout>
          <q-toolbar slot="header">
            <q-btn
              flat
              icon="keyboard_backspace"
              v-close-overlay
            />
            <q-toolbar-title>
              Add Item
            </q-toolbar-title>
          </q-toolbar>
          <div  class="q-pa-sm" >
          <q-field
            icon="add_circle"
            :label="modalMeta.label"
            orientation="vertical" >
            <q-input class= "col" minimal color="orange" float-label="Vendor" v-model="modalValues.vendor" /> <!-- add autocomplete -->
            <q-input class= "col" minimal color="orange" float-label="Unit" v-model="modalValues.unit" />
            <q-input minimal color="orange" float-label="Price" type="number" v-model="modalValues.price" />
          <br>
          <q-btn v-close-overlay label="addNew" color="secondary" @click="addStockUnit" />&nbsp;&nbsp;
          <q-checkbox v-model="modalMeta.wGST" label="gst included" />
          </q-field>
          </div>
        </q-modal-layout>
      </q-modal>
      <!-- //////// START OF priceTrack MODAL  ////////-->
      <q-modal v-model="priceTrackModal">
        <q-modal-layout>
          <q-toolbar slot="header">
            <q-btn
              flat
              icon="keyboard_backspace"
              v-close-overlay
            />
            <q-toolbar-title>
              Track price
            </q-toolbar-title>
          </q-toolbar>
          <div class="q-pa-sm" >
            <q-table
              :data="priceTrackData"
              :columns="ptColumns"
              :filter="ptFilter"
              :visible-columns="ptVisibleColumns"
              row-key="recordDate"
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
                  v-model="ptVisibleColumns"
                  :columns="ptColumns"
                />
              </template>
              <q-tr slot="body" slot-scope="props" :props="props">
                <q-td key="price" :props="props">{{ props.row.price }}</q-td>
                <q-td key="unit" :props="props">{{ props.row.unit }}</q-td>
                <q-td key="vendor" :props="props">{{ props.row.vendor }}</q-td>
                <q-td key="recordDate" :props="props">{{ props.row.recordDate }}</q-td>
                <q-td key="expenseId" :props="props" @click.native="loadExpenseId(props.row.expenseId)" >{{ props.row.expenseId }}</q-td>
                <q-td key="user" :props="props">{{ props.row.user }}</q-td>
              </q-tr>
            </q-table>
          </div>
        </q-modal-layout>
      </q-modal>
  </q-page>
</template>

<script>
import moment from 'moment'
import api from 'src/api'
import convert from 'convert-units'
import _ from 'lodash'
import {
  QChatMessage,
  QTable,
  QTr,
  QTd,
  QTh,
  QTableColumns,
  QSearch,
  QPopupEdit,
  QCheckbox,
  QBtnDropdown,
  QContextMenu,
  QField,
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
    QTableColumns,
    QSearch,
    QPopupEdit,
    QCheckbox,
    QBtnDropdown,
    QContextMenu,
    QField,
    QModal,
    QModalLayout
  },
  props: ['user'],
  data () {
    return {
      loading: true,
      ptFilter: '',
      priceTrackModal: false,
      priceTrackData: [],
      addItemModal: false,
      modalMeta: {
        label: '',
        item: '',
        wGST: true
      },
      modalValues: {
        price: 0,
        unit: '',
        vendor: ''
      },
      categoryArray: [],
      categoryValue: 'DryFood',
      message: '',
      messages: [],
      users: [],
      pricelist: [
        //sample doc
        {
          id:  'adaaa2a3-2634-45ec-befd-f38c7e22e13f' ,
          item:  'Balsamic' ,
          taxable:  'yes' ,
          vendors: [
            {
              unit: '1-gal',
              vendor: 'Helen',
              price: 43 ,
              updated:  '2018-08-16T19:51:25.991Z'
            },
            {
              unit: '1-gal',
              vendor: 'Madisco',
              price: 34 ,
              updated:  '2018-07-18T18:23:17.697Z'
            }
          ]
        }
      ],
      filter: '',
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
          name: 'item',
          required: true,
          label: 'Item',
          align: 'left',
          field: 'item',
          sortable: true
        },
        {
          name: 'taxable',
          required: false,
          label: 'Taxable',
          align: 'left',
          field: 'taxable'
        },
        {
          name: 'customLabel',
          required: false,
          label: 'custom',
          align: 'left',
          field: 'customLabel'
        },
        {
          name: 'units',
          required: false,
          label: 'Units',
          align: 'left',
          field: 'unit'
        },
        {
          name: 'track',
          required: false,
          label: '',
          align: 'left',
          field: 'track'
        }
      ],
      visibleColumns: ['item', 'taxable', 'customLabel', 'track'],
      columns2: [
        {
          name: 'vendor',
          required: true,
          label: 'vendor',
          align: 'left',
          field: 'vendor'
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
          required: true,
          label: 'Price',
          align: 'left',
          field: 'price',
          sortable: true
        },
        {
          name: 'compValue',
          required: true,
          label: 'compValue',
          align: 'left',
          field: 'compValue',
          sortable: true
        },
        {
          name: 'compBase',
          required: true,
          label: 'compBase',
          align: 'left',
          field: 'compBase',
          sortable: true
        },
        {
          name: 'updated',
          required: false,
          label: 'updated',
          align: 'left',
          field: 'updated'
        },
        {
          name: 'custom',
          required: false,
          label: 'custom',
          align: 'left',
          field: 'custom'
        },
        {
          name: 'buttons',
          required: false,
          label: 'buttons',
          align: 'left',
          field: 'buttons'
        }
      ],
      visibleColumns2: ['vendor', 'unit', 'price', 'compValue', 'compBase', 'custom', 'buttons' ],
      ptColumns: [
        {
          name: 'price',
          required: false,
          label: 'price',
          align: 'left',
          field: 'price'
        },
        {
          name: 'unit',
          required: false,
          label: 'unit',
          align: 'left',
          field: 'unit'
        },
        {
          name: 'vendor',
          required: false,
          label: 'vendor',
          align: 'left',
          field: 'vendor'
        },
        {
          name: 'recordDate',
          required: false,
          label: 'recordDate',
          align: 'left',
          field: 'recordDate'
        },
        {
          name: 'expenseId',
          required: false,
          label: 'expenseId',
          align: 'left',
          field: 'expenseId'
        },
        {
          name: 'user',
          required: false,
          label: 'user',
          align: 'left',
          field: 'user'
        }
      ],
      ptVisibleColumns: ['price', 'unit', 'vendor', 'recordDate', 'expenseId', 'user']
    }
  },
  computed: {
  },
  methods: {
    loadExpenseId (expId) {
      console.log('push1', expId)
      this.$router.push({path: `expense/${expId}`})
    },
    customValueDialog (row) {
      // needs input for custom value, on enter-> custom Field is filled with data
      this.$q.dialog({
        title: 'CustomValue',
        message: `Enter a custom value for ${row.item}`,
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        color: 'secondary'
      })
      .then(data => {
        this.$q.notify(`You typed: "${data}"`)
        console.log(row)
        // custom label
        row.customLabel = data
        // parse entered value eg '1-gal' or '4x1-gal'
        // customQty, customBase
        let customUnit = ''
        let caseQty = null
        let i = data.search('x')
        if (i > -1) {
          customUnit = data.substr(i + 1)
          caseQty = data.substr(0,i)
        } else {
          console.log('data', data)
          customUnit = data
        }
        // parse qty and base
        console.log('check')
        console.log(customUnit)
        let i2 = customUnit.search('-')
        console.log('check1')
        let customQty = customUnit.substr(0,i2)
        if (caseQty) {
          customQty = customQty * caseQty
        }
        let customBase = customUnit.substr(i2 + 1)
        let customValue = ''
        console.log('check2')
        row.vendors.forEach(ven => {
          ven.customLabel = data
          if (ven.compBase === customBase) {
            console.log('check3', ven.compBase, customBase, ven.compBase === customBase)
            console.log('cust', customValue, customQty, ven.compValue)
            customValue = customQty * ven.compValue
            console.log(customValue)
          } else {
            // need to check for compatibility
            console.log('check4')
            let customConversion = convert(customQty).from(customBase).to(ven.compBase)
            customValue = customConversion * ven.compValue
          }
          ven.custom = customValue
          console.log(row)
          console.log('custom', customValue, customBase, customQty)
        })
      }).catch((err) => {
        this.$q.notify(err)
      })
    },
    priceOverlay (row) {
      // queries audit db for item and loads data to popup modal with datatable
      console.log('priceOverlay')
      api.service('audit').find({
        query: {
          table: 'priceList',
          item: row.item,
          $sort: { recordDate: -1 },
          $limit: 100 // max is 200
        }
      }).then((response) => {
        this.$data.priceTrackData = response.data
        this.$data.priceTrackModal = true
      })
    },
    overlay (row) {
      this.$data.addItemModal = true
      console.log('overlay', row)
      this.$data.modalMeta.label = row.item
      if (row.taxable === 'yes') {
        this.$data.modalMeta.wGST = true
      } else {
        this.$data.modalMeta.wGST = false
      }
      this.$data.modalValues = {
        price: '',
        unit: '',
        vendor: ''
      }
    },
    showNotification (val) {
      console.log(val)
      this.$data.categoryValue = val
      this.loadPricelistData()
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
    addStockUnit () {
      // exectued on add item modal save
      // get item info based on modalMeta.label
      let dex = _.findIndex(this.$data.pricelist, {item: this.$data.modalMeta.label})
      let row = this.$data.pricelist[dex]
      console.log('row1', row) // somehow 'c' vendor data is already loaded to row???
      let c = this.$data.modalValues // entered price, unit, vendor
      console.log('c', c)
      c.updated = new Date()
      // check inherited item info; 'wGST' selected on modal; 'label' loaded on dblclick
      if (this.$data.modalMeta.wGST) { 
        c.price = _.round((c.price / 1.125), 2)
      }
      // push new stock unit/vendor to item
      row.vendors.push(c) // not sure how this executes before row1 console.log
      console.log('row2', row)
      // update entire item, can't just update stock; row has added comp fields from initial itemPriceSort
      let tmpRow = row
      tmpRow.vendors.forEach(ven => {
        delete ven['__index']
        delete ven['compBase']
        delete ven['compQty']
        delete ven['compUnit']
        delete ven['compValue']
      })
      api.service('pricelist').update(tmpRow.id, tmpRow).then(response => {
        console.log('added item to pricelist, addstockunit')
        // run comparison
        this.itemPriceSort([row])
      })
    },
    loadPricelistData () {
      this.$data.loading = true
      // we look up by category value, so little risk of records over 200
      api.service('pricelist').find({
        query: {
          $sort: { item: 1 },
          category: this.$data.categoryValue
        }
      }).then((response) => {
        let tempList = []
        // load pricelist data to datatable
        this.$data.pricelist = response.data
        // run price sort on all items
        this.itemPriceSort(response.data)
      })
    },
    itemPriceSort(items) {
      // for each item need to sort vendors list
      items.forEach((item,z) => {
        console.log('index', z, item)
        // start compareFunction()
        let tempItem = item
        let sortedVendors = []
        item.vendors.forEach(vendor => {
          // vendor: vendor, unit, price, updated
          console.log( item.item, vendor.vendor, vendor. unit)
          // will need to breakout single values
          let pUnit = ''
          let caseQty = null
          // check if unit is by the case eg 12x8-oz
          ////////////
          //////////// potential method
          let i = vendor.unit.search('x')
          if (i > -1) {
            pUnit = vendor.unit.substr(i + 1)
            caseQty = vendor.unit.substr(0,i)
          } else {
            pUnit = vendor.unit
          }
          // parse qty and base
          let i2 = pUnit.search('-')
          let pQty = pUnit.substr(0,i2)
          if (caseQty) {
            pQty = pQty * caseQty
          }
          let pBase = pUnit.substr(i2 + 1)
          //////////////
          //////////////
          // conform pBase to convert-units definition
          if (pBase === 'L') {
            pBase = 'l'
          }
          if (pBase === 'Fl.oz') {
            pBase = 'fl-oz'
          }
          if (pBase === 'lbs') {
            pBase = 'lb'
          }
          if (pBase === 'sack') {
            pBase = 'ea'
          }
          // check if sortedVendors is empty, that is no comp to be made yet
          if (sortedVendors.length === 0){
            // add new comparison fields to vendor
            vendor.compQty = pQty
            vendor.compBase = pBase
            vendor.compUnit = pUnit
            vendor.compValue = vendor.price / vendor.compQty
            sortedVendors.push(vendor)
          } else {
            // compare vendor to sortedVendors list find place in order
            sortedVendors.forEach((comp, index) => {
              // comp is part of sortedVendors; vendor & p-var is vendor to be placed
              // need to get common base
              if (pBase === comp.compBase) {
                // when cycling through sortedVendors, don't want to update vendor.compQty with new qty
                if (!vendor.compQty) {
                  vendor.compQty = pQty // creating vendor.compQty with parsed qty
                }
                vendor.compBase = pBase
              } else {
                // base not same need to change
                // console.log(comp)
                console.log('converting', item.item, pBase, comp.compBase, index, sortedVendors[index])
                // check to see if compBase &&& pBase in convert units.
                if (comp.compBase) {
                  const isPossibleUnit = convert().possibilities().includes(comp.compBase)
                  if (isPossibleUnit) {
                    let possibleList = convert().from(comp.compBase).possibilities() // convert().possibilities() 
                    if (possibleList.includes(pBase)) { // && possibleList.includes(comp.compBase)) {
                      vendor.compQty = convert(pQty).from(pBase).to(comp.compBase)
                      vendor.compBase = comp.compBase
                    } else { // need to handle incompaible/nonvalid base
                      console.log('ERROR: Incompatible bases for ', item.item)
                      this.$q.notify({
                        message: `Incompatible bases for ${item.item}`,
                        timeout: 3000,
                        position: 'center'
                      })
                    }
                  } else {
                    this.$q.notify({
                        message: `Unsupported base for ${item.item}: ${comp.compBase}`,
                        timeout: 3000,
                        position: 'center'
                      })
                  }
                }
              }
              //////// Maybe can break out vvvvvvvv
              // base is same now, get per unit price
              vendor.compValue = vendor.price / vendor.compQty
              // check difference between current vendor and sorted vendor
              let diff = vendor.compValue - comp.compValue
              if (diff > 0) {
                // more expensive than comp, cyle to next sortedVendor
              } else {
                // cheaper than comp, vendor replaces position in sortedVendors and comp becomes new vendor value to evaluate
                let holder = JSON.parse(JSON.stringify(comp)) // sanitize?
                sortedVendors[index] = JSON.parse(JSON.stringify(vendor))
                vendor = holder
              }
              // if no more sortedVendors to compare, current vendor is most expensive 
              if (index === (sortedVendors.length - 1)) {
                sortedVendors.push(vendor)
              }
              /////////Maybe can break out^^^^^^
            }) // end of comparison to sorted vendors, more vendors to be sorted
          // push vendor to  item
          }
        }) // end of all vendors, on to next item
        // find item in pricelist and update vendors to sortedVendors
        let plIndex = _.findIndex(this.$data.pricelist, {item: item.item})
        console.log(item, plIndex, this.$data.pricelist)
        this.$data.pricelist[plIndex].vendors = sortedVendors
      }) // end of all items
      this.$data.loading = false
      console.log('set pricelist')
    },
    loadCategories (skipNum) {
      api.service('pricelist').find({
        query: {
          $select: ['category'],
          $skip: skipNum * 200
        }
      }).then(response=> {
        response.data.forEach(category => {
          // console.log('ccc',category)
          if (!this.$data.categoryArray.includes(category.category)) {
            this.$data.categoryArray.push(category.category)
          }
        })
        if (response.data.length > 199) {
          console.log('rerun loadCategories')
          skipNum++
          this.loadCategories(skipNum)
        }
      })
    }
  },
  mounted () {
    const messages = api.service('messages')
    const users = api.service('users')
    const pricelist = api.service('pricelist')
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
    this.loadPricelistData()
    this.loadCategories(0)
    this.$q.loading.hide()
    /*
    pricelist.find({
      query: {
        $sort: { item: 1 }
      }
    })
      .then((response) => {
        let tempList = []
        // this.$data.pricelist = response.data
        // for each item need to sort vendors list
        response.data.forEach((item,z) => {
          console.log('index', z, item)
          let tempItem = item
          let sortedVendors = []
          item.vendors.forEach(vendor => {
            console.log( item.item, vendor.vendor, vendor. unit)
            // check if it is a case unit
            let pUnit = ''
            let i = vendor.unit.search('x')
            if (i > -1) {
              pUnit = vendor.unit.substr(i + 1)
            } else {
              pUnit = vendor.unit
            }
            // parse qty and base
            let i2 = pUnit.search('-')
            let pQty = pUnit.substr(0,i2)
            let pBase = pUnit.substr(i2 + 1)
            // conform pBase to convert-units definition
            if (pBase === 'L') {
              pBase = 'l'
            }
            if (pBase === 'Fl.oz') {
              pBase = 'fl-oz'
            }
            // check if sortedVendors is empty
            if (sortedVendors.length === 0){
              vendor.compQty = pQty
              vendor.compBase = pBase
              vendor.compUnit = pUnit
              vendor.compValue = vendor.price / vendor.compQty
              sortedVendors.push(vendor)
            } else {
              // compare vendor to sortedVendors list find place in order
              sortedVendors.forEach((comp, index) => {
                // check if same base unit
                if (pBase === comp.compBase) {
                  vendor.compQty = pQty
                  vendor.compBase = pBase
                } else {
                  // base not same need to change
                  console.log('converting', item.item, pBase, comp.compBase, index,sortedVendors[index])
                  // check to see if compBase &&& pBase in convert units.
                  let possibleList = convert().possibilities()
                  if (possibleList.includes(pBase) && possibleList.includes(compBase)) {
                    vendor.compQty = convert(pQty).from(pBase).to(comp.compBase)
                    vendor.compBase = comp.compBase
                  }
                  
                  // vendor.compQty = convert(pQty).from(pBase).to(comp.compBase)
                  // vendor.compBase = comp.compBase
                }
                ////////Maybe can break out vvvvvvvv
                // base is same, get per unit price
                vendor.compValue = vendor.price / vendor.compQty
                let diff = vendor.compValue - comp.compValue
                if (diff > 0) {
                  // more expensive than comp
                } else {
                  // cheaper than comp, vendor replaces position in sortedVendors and comp becomes new vendor value to evaluate
                  let holder = JSON.parse(JSON.stringify(comp)) // sanitize?
                  sortedVendors[index] = JSON.parse(JSON.stringify(vendor))
                  vendor = holder
                }
                if (index === (sortedVendors.length - 1)) {
                  sortedVendors.push(vendor)
                }
                /////////Maybe can break out^^^^^^
              })
            // push vendor to  item
            }
          })
          tempItem.vendors = sortedVendors
          // push item to $data.pricelist
          tempList.push(tempItem)
        }) 
        console.log('set pricelist')
        this.$data.pricelist = tempList
      })
    */
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