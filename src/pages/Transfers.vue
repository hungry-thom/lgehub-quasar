<!-- InventoryTransfer.vue -->
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="inventory.items"
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
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="item" :props="props">{{ props.row.item }}</q-td>
            <q-td key="Mon" :props="props">
              {{ props.row.Mon.total || '-' }}
                <q-popup-edit v-model="props.row.Mon" @save="updateCount(props.row.Mon)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.Mon.transfers" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
            </q-td>
            <q-td key="Tue" :props="props">
              <div>
                {{ props.row.Tue.total || '-' }}
                <q-popup-edit v-model="props.row.Tue" @save="updateCount(props.row.Tue)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.Tue.transfers" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
            <q-td key="Wed" :props="props">
              <div>
                {{ props.row.Wed.total || '-' }}
                <q-popup-edit v-model="props.row.Wed" @save="updateCount(props.row.Wed)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.Wed.transfers" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
            <q-td key="Thu" :props="props">
              <div>
                {{ props.row.Thu.total || '-' }}
                <q-popup-edit v-model="props.row.Thu" @save="updateCount(props.row.Thu)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.Thu.transfers" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
            <q-td key="Fri" :props="props">
              <div>
                {{ props.row.Fri.total || '-' }}
                <q-popup-edit v-model="props.row.Fri" @save="updateCount(props.row.Fri)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.Fri.transfers" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
            <q-td key="Sat" :props="props">
              <div>
                {{ props.row.Sat.total || '-' }}
                <q-popup-edit v-model="props.row.Sat" @save="updateCount(props.row.Sat)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.Sat.transfers" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
          </q-tr>
        </q-table>
        <br>
      </div>
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
  QField
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
    QField
  },
  props: ['user'],
  data () {
    return {
      message: '',
      messages: [],
      users: [],
      inventory: [],
      inventory2: [
        {
          "id":"dd6741ca-c588-4b57-9b59-596e4eb720d8",
          "item":"ChocolateSyrup",
          "Mon": {
            "total": 1,
            "transfers": [
              {
                "qty": 1,
                "unit": "48-oz"
              },
              {
                "qty": 0,
                "unit": "32-oz"
              }
            ]
          },
          "Tue": {
            "total": 0,
            "transfers": [
              {
                "qty": 0,
                "unit": "48-oz"
              },
              {
                "qty": 0,
                "unit": "32-oz"
              }
            ]
          }
        },
        {
          "id":"0863516e-d831-4423-9308-65f64d272248",
          "item":"Tofu",
          "Mon": {
            "total": 2,
            "transfers": [
              {
                "qty": 1,
                "unit": "48-oz"
              },
              {
                "qty": 1,
                "unit": "32-oz"
              }
            ]
          },
          "Tue": {
            "total": 1,
            "transfers": [
              {
                "qty": 1,
                "unit": "48-oz"
              },
              {
                "qty": 0,
                "unit": "32-oz"
              }
            ]
          }
        },
        {
          "id":"2784970a-cd8a-4241-9c33-ccd2a1856486",
          "item":"Toothpicks",
          "Mon": {
            "total": 3,
            "transfers": [
              {
                "qty": 31,
                "unit": "48-oz"
              }
            ]
          },
          "Tue": {
            "total": 3,
            "transfers": [
              {
                "qty": 3,
                "unit": "48-oz"
              }
            ]
          }
        }
      ],
      filter: '',
      checked: false,
      dailyTransfers : [],
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
          name: 'Mon',
          required: true,
          label: 'Mon',
          align: 'left',
          field: 'Mon'
        },
        {
          name: 'Tue',
          required: true,
          label: 'Tue',
          align: 'left',
          field: 'Tue'
        },
        {
          name: 'Wed',
          required: true,
          label: 'Wed',
          align: 'left',
          field: 'Wed'
        },
        {
          name: 'Thu',
          required: true,
          label: 'Thu',
          align: 'left',
          field: 'Thu'
        },
        {
          name: 'Fri',
          required: true,
          label: 'Fri',
          align: 'left',
          field: 'Fri'
        },
        {
          name: 'Sat',
          required: true,
          label: 'Sat',
          align: 'left',
          field: 'Sat'
        }
      ],
      visibleColumns: ['item', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
    updateCount (item) {
      console.log('?????',item)
      // props.row.tue
      let t = 0
      item.transfers.forEach(unit => {
        t += unit.qty
      })
      item.total = t
      // t1.slice(0,-10) //for date.toLocaleString('en-GB')
      /*
      this.$data.confirmations[item.__index].newStock = item.stock
      api.service('inventory').update(item.id, {
        item: item.item,
        stock: item.stock
      })
      */
    },
    addStockUnit (itemId) {
      console.log(itemId)
      console.log('////////')
      console.log(this.$data.confirmations)
    },
    confirmInv () {
      let test = this.$data.confirmations.every(item => {
        console.log(item.item, item.confirmed)
        // this.$data.conf = item.confirmed
        return item.confirmed
      })
      if (test) {
        // submit inv
        console.log('submitting audit')
        api.service('audit').create(this.$data.confirmations)
      } else {
        this.$q.notify({
          message: 'Not all inventory items confirmed',
          timeout: 3000,
          position: 'center'
        })
      }
    },
    loadTransferData() {
      // find transfer record (week) using this monday's date
      let days = ['Mon','Tue','Wed','Thu','Fri','Sat']
      let today = moment()
      let dex = days.indexOf(today.format('ddd'))
      let currentMonday = today.subtract(dex, 'days')
      let qDate = currentMonday.format('DD-MMM-YYYY')
      // qDate = '01-Oct-2018'
      console.log(qDate)
      api.service('transfers').find({
        query: {
          week: {
            $search: qDate
          }
        }
      })
        .then((response) => {
          if (response.data.length > 0) {
            // what if more than 1 record found?
            console.log('record found', response)
            this.$data.inventory = response.data[0]
            console.log('inventory',this.$data.inventory)
          } else {
            // createBlankTransferRec()
            console.log('no record', response)
            api.service('inventory').find({
              query: {
                $sort: { item: 1}
              }
            })
              .then((response2) => {
                let tempWeekTransfers = {}
                tempWeekTransfers.week = currentMonday.format('DD-MMM-YYYY')
                tempWeekTransfers.items = []
                console.log('call2 inventory',response2.data)
                response2.data.forEach(item => {
                  // find base units
                  let tempItem = {}
                  tempItem.item = item.item
                  tempItem.id = item.id
                  let tempStock = []
                  item.stock.forEach(stock => {
                    let tempUnit = {}
                    tempUnit.unit = stock.unit
                    tempUnit.qty = 0
                    tempStock.push(tempUnit) 
                  }, this)
                  // for each day add empty base units
                  days.forEach(day => {
                    let tmp = {}
                    let cleanStock = JSON.parse(JSON.stringify(tempStock))
                   tempItem[day] = { total: 0, transfers: cleanStock }
                   // tempWeekTransfers.items[day] = {total:0 , transfers: tempStock }
                  }, this)
                  tempWeekTransfers.items.push(tempItem)
                }, this)
                console.log('NewTransferWeek', tempWeekTransfers)
                this.$data.inventory = tempWeekTransfers
              }) 
            // this.$data.inventory = this.$data.inventory2
          }
        })
    },
    generateColumns() {
      let setColumns = []
      // let visColumns = ['item']
      setColumns.push({
        name: 'id',
        required: false,
        label: 'Id',
        align: 'left',
        field: 'id'
      })
      setColumns.push({
        name: 'item',
        required: false,
        label: 'Item',
        align: 'left',
        field: 'item'
      })
      let week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      let today = new Date()
      for (var i = 0; i < 6; i++) {
        if (i < today.getDate()) {
          setColumns.push({
            name: week[i],
            required: true,
            label: week[i],
            align: 'left',
            field: week[i]
          })
        } else {
          console.log('blank day')
        }
        // visColumns.push(week[i])
      }
      console.log(setColumns)
      // console.log('!?',visColumns)
      this.$data.columns = setColumns
      // this.$data.visibleColumns = visColumns
    }
  },
  mounted () {
    const messages = api.service('messages')
    const users = api.service('users')
    const inventory = api.service('inventory')
    // generate columns
    // this.generateColumns()
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
    //load tranfer data (api.service('transfers'))
    this.loadTransferData()
    /*
    inventory.find({
      query: {
        $sort: { item: 1}
      }
    })
      .then((response) => {
        this.$data.inventory = response.data
        this.$data.inventory.forEach(item => {
          console.log(item)
          console.log('----------')
          let cleanStock = []
          item.stock.forEach(unit => {
            cleanStock.push({ unit: unit.unit, qty: 0})
          }, this)
          let days = ['mon','tue','wed','thu','fri','sat']
          days.forEach(day => {
            item[day] = {}
            item[day].total = 0
            item[day].units = cleanStock
            console.log('!!!',day,'!!!',item[day],'!!!')
          }, this)
          // this.$data.dailyTransfers.push()
          // let og = JSON.parse(JSON.stringify(item.stock))
          // this.$data.confirmations.push( {item: item.item, confirmed: false, originalStock: og} )
        }, this) // this necessary?
        console.log(this.$data.inventory)
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
    inventory.on('created', inv => {
      console.log('item received')
      this.$data.inventory.push(inv)
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