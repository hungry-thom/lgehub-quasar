
<template>
  <q-page>
      <div>
        <br>
          <q-input
            v-model="filter"
            stack-label="Filter"
            clearable
            class="q-mb-sm"
          />
          <q-tree
            :nodes="pl"
            :filter="filter"
            :filter-method="myFilter"
            node-key="label"
          />
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
  QTree
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
    QTree
  },
  props: ['user'],
  data () {
    return {
      message: '',
      messages: [],
      users: [],
      pl: [],
      priceList: [
        {
          id:  "adaaa2a3-2634-45ec-befd-f38c7e22e13f" ,
          item:  "Balsamic" ,
          taxable:  "yes" ,
          units: [
            {
              unit: '1-gal',
              vendors: [
                {
                  vendor: 'Helen',
                  cost: 43 ,
                  updated:  "2018-08-16T19:51:25.991Z"
                },
                {
                  vendor: 'Madisco',
                  cost: 34 ,
                  updated:  "2018-07-18T18:23:17.697Z"
                }
              ]
            }
          ]
        },
        {
          id:  "0301daa0-d637-440c-83de-8588dfdddc4b" ,
          item:  "JamSmall" ,
          taxable:  "no" ,
          units: [
            {
              unit: '8-oz',
              vendors: [
                {
                  vendor: 'JorgeVasquez',
                  cost: 1.25 ,
                  updated:  "2018-06-23T19:27:21.789Z"
                }
              ],
            },
            {
              unit: '12-oz',
              vendors: [
                {
                  vendor: 'JorgeVasquez',
                  cost: 5,
                  updated:  "2018-06-23T19:27:21.789Z"
                }
              ]
            }
          ]
        }
      ],
      filter: '',
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
      visibleColumns: ['item']
    }
  },
  computed: {
  },
  methods: {
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
    myFilter (node, filter) {
      const filt = filter.toLowerCase()
      console.log(node)
      let tmp = node.label && node.label.toLowerCase().indexOf(filt) > -1
      console.log(tmp)
      return node.label && node.label.toLowerCase().indexOf(filt) > -1
    },
    loadTreeData () {
      console.log('loadTreeData')
      let tmpPL = this.$data.priceList
      console.log(tmpPL)
      tmpPL.forEach( item => {
        console.log('item')
        console.log(item)
        let tmpItem = {}
        tmpItem.label = item.item
        tmpItem.children = []
        item.units.forEach(unit => {
          console.log('unit')
          let tmpUnit = {}
          tmpUnit.label = unit.unit
          tmpUnit.children = []
          unit.vendors.forEach(vendor => {
            console.log('vendor')
            let tmpVendor = {}
            let info = ''
            info = vendor.vendor + '       $' + vendor.cost
            tmpVendor.label = info
            tmpVendor.children = [{label: vendor.updated}]
            tmpUnit.children.push(tmpVendor)
            console.log('pushTmpvendor')
          }, this)
          tmpItem.children.push(tmpUnit)
        }, this)
        this.$data.pl.push(tmpItem)
        console.log('tmpItem')
        console.log(tmpItem)
      }, this)
      console.log('finishedLoad')
    }
  },
  mounted () {
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
    /*
    pricelist.find()
      .then((response) => {
        // We want the latest inventory but in the reversed order
        this.$data.priceList = response.data.reverse()
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
    // load up tree data
    this.loadTreeData()
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