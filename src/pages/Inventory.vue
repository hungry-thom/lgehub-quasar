<!-- InventoryTransfer.vue -->
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="inventory2"
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
            <q-td key="mon" :props="props">
              {{ props.row.mon.total || '-' }}
                <q-popup-edit v-model="props.row.mon" @save="updateCount('save1')" buttons>
                    <q-input type="number" v-model="props.row.mon.total" />
                </q-popup-edit>
            </q-td>
            <q-td key="tue" :props="props">
              <div>
                {{ props.row.tue.total || '-' }}
                <q-popup-edit v-model="props.row.tue" @save="updateCount(props.row.tue)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.tue.transfers" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
            <!--
            <q-td key="wed" :props="props">
              <div>
                {{ props.row.wed.total || '-' }}
                <q-popup-edit @cancel="updateCount(props.row)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.wed.units" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
            <q-td key="thu" :props="props">
              <div>
                {{ props.row.thu.total || '-' }}
                <q-popup-edit @save="updateCount(props.row)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.thu.units" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
            <q-td key="fri" :props="props">
              <div>
                {{ props.row.fri.total || '-' }}
                <q-popup-edit @save="updateCount(props.row)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.fri.units" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
            <q-td key="sat" :props="props">
              <div>
                {{ props.row.sat.total || '-' }}
                <q-popup-edit @save="updateCount(props.row)" buttons>
                  <div class="row no-wrap" v-for="units in props.row.sat.units" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
              </div>
            </q-td>
            -->
              <!--
              <div class="row items-center justify-between no-wrap">
                <div v-for="unit in props.row.stock" :key="unit.unit">{{ unit.unit }}:<br>&nbsp;&nbsp;<strong><font size="4">{{ unit.qty }}</font></strong>
                  <q-popup-edit v-model="unit.qty" title="Update count" @save="updateCount(props.row)" buttons>
                    <q-input type="number" v-model="unit.qty" />
                  </q-popup-edit>
            </div>
                <div>
                  <q-btn size="sm" round dense color="secondary" icon="playlist_add" class="q-mr-xs" @click="addStockUnit(props.row)" />
                  <q-btn size="sm" round dense color="secondary" icon="shopping_cart" class="q-mr-xs" />
                </div>
              </div>
            </q-td>
            -->
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
          "mon": {
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
          "tue": {
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
          "mon": {
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
          "tue": {
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
          "mon": {
            "total": 3,
            "transfers": [
              {
                "qty": 31,
                "unit": "48-oz"
              }
            ]
          },
          "tue": {
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
          name: 'mon',
          required: true,
          label: 'Mon',
          align: 'left',
          field: 'mon'
        },
        {
          name: 'tue',
          required: true,
          label: 'Tue',
          align: 'left',
          field: 'tue'
        },
        {
          name: 'wed',
          required: true,
          label: 'Wed',
          align: 'left',
          field: 'wed'
        },
        {
          name: 'thu',
          required: true,
          label: 'Thu',
          align: 'left',
          field: 'thu'
        },
        {
          name: 'fri',
          required: true,
          label: 'Fri',
          align: 'left',
          field: 'fri'
        },
        {
          name: 'sat',
          required: true,
          label: 'Sat',
          align: 'left',
          field: 'sat'
        }
      ],
      visibleColumns: ['item', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat']
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