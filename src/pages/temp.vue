<!-- inventoryTemp.vue -->
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="inventory"
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
            <q-td key="stock" :props="props" >{{ props.row.stock[0].qty }}
              <q-popup-edit v-model="props.row.stock[0].qty" title="edit" @save="updateCount(props.row)" buttons >
                <q-input type="number" v-model="props.row.stock[0].qty" />
              </q-popup-edit>
            </q-td>
            <q-td key="tue" :props="props" ><span @click="addStockUnit(props.row.__index,'tue')">{{ props.row.tue || '-' }}</span></q-td>
            <q-td key="wed" :props="props">{{ props.row.wed || '-' }}</q-td>
            <q-td key="thu" :props="props">{{ props.row.thu || '-' }}</q-td>
            <q-td key="fri" :props="props">{{ props.row.fri || '-' }}</q-td>
            <q-td key="sat" :props="props">{{ props.row.sat || '-' }}</q-td>
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
  Dialog
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
    Dialog
  },
  props: ['user'],
  data () {
    return {
      message: '',
      messages: [],
      users: [],
      inventory: [],
      filter: '',
      checked: false,
      confirmations : [],
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
          name: 'stock',
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
      visibleColumns: ['item', 'stock', 'tue', 'wed', 'thur', 'fri', 'sat']
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
      console.log('!!!!',item)
      // move validate to native qpopupedit validate function 
      /* if (!isNaN(newVal)) {
        // api.service('inventory').
        console.log(oldVal)
      } */
    },
    addStockUnit (dex,day) {
      this.$q.dialog({
          message: 'Not all inventory items confirmed',
          prompt: {
            model: '',
            type: 'number' // optional
          },
          // position: 'center'
        }).then((data) => {
          // Picked "OK"
          console.log(data,'----',day)
          console.log(this.$data.inventory[dex][day])
          this.$data.inventory[dex][day] = data
        })
        
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
      // get inventory transfers for this week
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
          item.mon = 0
          item.tue = 0
          item.wed = 0
          item.thu = 0
          item.fri = 0
          item.sat = 0
          // let og = JSON.parse(JSON.stringify(item.stock))
          // this.$data.confirmations.push( {item: item.item, confirmed: false, originalStock: og} )
        }, this) // this necessary?
        //console.log(this.$data.confirmations)
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