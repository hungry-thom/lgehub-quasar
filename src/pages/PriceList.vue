
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
            <q-tr :props="props">
              <q-td key="item" :props="props">
                <q-checkbox color="primary" v-model="props.expand" unchecked-icon="add" checked-icon="remove" class="q-mr-md" />
                {{ props.row.item }}
              </q-td>
              <q-td key="taxable" :props="props">
                {{ props.row.taxable }}
              </q-td>
              <!--<q-tooltip>I'd like to eat "{{ props.row.name }}"</q-tooltip>-->
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <q-table
                  :data="props.row.vendors"
                  :columns="columns2"
                  row-key="props.row.vendors.vendor"
                  hide-bottom />
              </q-td>
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
import convert from 'convert-units'
import {
  QChatMessage,
  QTable,
  QTr,
  QTd,
  QSearch,
  QPopupEdit,
  QCheckbox,
  QBtnDropdown
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
    QBtnDropdown
  },
  props: ['user'],
  data () {
    return {
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
          name: 'units',
          required: false,
          label: 'Units',
          align: 'left',
          field: 'unit'
        }
      ],
      visibleColumns: ['item'],
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
        }
      ]
    }
  },
  computed: {
  },
  methods: {
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
    addStockUnit (itemId) {
      console.log(itemId)
    },
    loadPricelistData () {
      api.service('pricelist').find({
        query: {
          $sort: { item: 1 },
          category: this.$data.categoryValue
        }
      }).then((response) => {
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
            let caseQty = null
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
    },
    loadCategories () {
      api.service('pricelist').find({
        query: {
          $select: ['category']
        }
      }).then(response=> {
        response.data.forEach(category => {
          console.log('ccc',category)
          if (!this.$data.categoryArray.includes(category.category)) {
            this.$data.categoryArray.push(category.category)
          }
        })
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
    this.loadCategories()
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