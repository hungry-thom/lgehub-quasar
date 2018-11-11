<!-- InventoryCheck.vue -->
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
          :pagination.sync="pagination">
          <!--hide-bottom >-->
          <template slot="top-left" slot-scope="props">
            <q-search
              clearable
              inverted
              color="secondary"
              v-model="filter"
              placeholder="Filter"
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
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="item" :props="props">{{ props.row.item }}</q-td>
            <!--<q-tooltip>I'd like to eat "{{ props.row.name }}"</q-tooltip>-->
            <q-td key="stock" :props="props">
              <div class="row items-center justify-between no-wrap">
                <div v-for="unit in props.row.stock" :key="unit.unit">{{ unit.unit }}:<br>&nbsp;&nbsp;<strong><font size="4">{{ unit.qty }}</font></strong>
                  <q-popup-edit v-model="unit.qty" title="Update count" @save="updateCount(props.row)" buttons>
                    <q-input type="number" v-model="unit.qty" />
                  </q-popup-edit>
                </div>
                <div>
                  <!-- <q-checkbox v-model="inventory[props.row.__index].confirmed" checked-icon="check_circle" unchecked-icon="remove_circle_outline" class="q-mr-md" /> -->
                  <q-checkbox v-model="confirmations[props.row.__index].confirmed" checked-icon="check_circle" :unchecked-icon="props.row.uncheckedIcon" @input="confirmInv(props.row)" class="q-mr-md">
                    <q-tooltip :delay="1000">Confirmed: {{props.row.lastConf.substr(0,10)}}</q-tooltip>
                  </q-checkbox>
                  <q-btn size="sm" round dense color="negative" icon="warning" class="q-mr-xs" v-if="confirmations[props.row.__index].warning" />
                  <q-btn size="sm" round dense color="secondary" icon="zoom_in" class="q-mr-xs" @click="auditItem(props.row)" />
                  <q-btn size="md" round dense color="secondary" icon="shopping_cart" class="q-mr-xs" />
                </div>
              </div>
            </q-td>
          </q-tr>
        </q-table>
        <br>
      </div>
      <div>
        &nbsp;&nbsp;<q-btn size="md" color="primary" label="Add item to inventory" disable @click="addItemOverlay" /> <!-- :disable not reading var -->
      </div>
      <!-- //////// START OF AUDIT MODAL  ////////-->
      <q-modal v-model="auditModal">
        <q-modal-layout> <!-- class="q-pa-sm" -->
          <q-toolbar slot="header">
            <q-btn
              flat
              icon="keyboard_backspace"
              @click="overlay"
            />
            <q-toolbar-title>
              Audit Item
            </q-toolbar-title>
          </q-toolbar>
          <q-table
            :data="auditData"
            :columns="modalColumns"
            :visible-columns="visibleModalColumns"
            :title="auditData[0].item"
            row-key="__index"
            :filter="filter"
            :pagination.sync="pagination"
            hide-bottom >
            <template slot="top-right" slot-scope="props">
              <q-search
                hide-underline
                color="secondary"
                inverted
                v-model="filter"
                class="q-pa-xs"
              />
            </template>
          </q-table>
        </q-modal-layout>
      </q-modal>
      <!-- ///////END OF AUDIT MODAL ///////// -->
      <!-- //////START OF ADD ITEM MODAL //////
      <q-modal v-model="addItemModal">
        <q-modal-layout>
          <q-toolbar slot="header">
            <q-btn
              flat
              icon="keyboard_backspace"
              @click="addItemOverlay"
            />
            <q-toolbar-title>
              Add Item
            </q-toolbar-title>
          </q-toolbar>
          <q-input float-label="Item name" v-model="newItem.item" />
        </q-modal-layout>
      </q-modal> -->
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
  QModal,
  QModalLayout,
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
    QBtn,
    QModal,
    QModalLayout,
    QBtnDropdown
  },
  props: ['user'],
  data () {
    return {
      categoryArray: [],
      categoryValue: 'DryFood',
      filter: '',
      addItemModal: false,
      auditModal: false,
      auditData: [{item: ''}],
      message: '',
      messages: [],
      users: [],
      inventory: [],
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
          label: 'Stock',
          align: 'left',
          field: 'stock'
        }
      ],
      visibleColumns: ['item', 'stock'],
      modalColumns: [
        {
          name: 'id',
          required: false,
          label: 'Id',
          align: 'left',
          field: 'id'
        },
        {
          name: 'recordDate',
          required: true,
          label: 'recordDate',
          align: 'left',
          field: 'recordDate',
          sortable: true
        },
        {
          name: 'type',
          required: true,
          label: 'Type',
          align: 'left',
          field: 'type'
        },
        {
          name: 'item',
          required: false,
          label: 'Item',
          align: 'left',
          field: 'item'
        },
        {
          name: 'unit',
          required: true,
          label: 'Unit',
          align: 'left',
          field: 'unit'
        },
        {
          name: 'change',
          required: true,
          label: 'Change',
          align: 'left',
          field: 'change'
        },
        {
          name: 'confirmedAmt',
          required: true,
          label: 'confirmedAmt',
          align: 'left',
          field: 'confirmedAmt'
        },
        {
          name: 'expenseId',
          required: true,
          label: 'ExpenseId',
          align: 'left',
          field: 'expenseId'
        },
        {
          name: 'user',
          required: true,
          label: 'User',
          align: 'left',
          field: 'user'
        }
      ],
      visibleModalColumns: ['recordDate', 'unit', 'change', 'expenseId']
    }
  },
  computed: {
  },
  methods: {
    showNotification (val) {
      console.log(val)
      this.$data.categoryValue = val
      this.loadInventoryData()
    },
    loadCategories () {
      api.service('inventory').find({
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
    },
    addItemOverlay () {
      this.$data.addItemModal = !this.$data.addItemModal
      this.$data.auditModal = false
    },
    overlay () {
      console.log('overlaycalled')
      this.$data.auditModal = !this.$data.auditModal
      this.$data.addItemOverlay = false
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
    updateCount (item) {
      console.log(';;;;',item)
      // find change from previous val
      this.$data.confirmations[item.__index].newStock = item.stock // old
      api.service('inventory').patch(item.id, {stock: item.stock}).then((response) => {
        let comp = this.$data.confirmations[item.__index].originalStock
        item.stock.forEach(unit => {
          console.log('comp', comp, 'unit', unit)
          let dex = _.findIndex(comp, {unit: unit.unit})
          console.log(dex)
          let diff = unit.qty - comp[dex].qty
          if (diff !== 0) {
            let auditObj = {
              table: 'inventory',
              type: 'userEdit',
              recordDate: new Date(),
              change: diff,
              item: item.item,
              unit: unit.unit,
              user: this.$props.user.email
            }
            this.$data.confirmations[item.__index].originalStock = JSON.parse(JSON.stringify(item.stock))
            console.log('audit',auditObj)
            api.service('audit').create(auditObj)
            this.$data.confirmations[item.__index].confirmed = true
            this.confirmInv(item)
          } else {
            // no change in stockk amounts
            console.log('no change in stockk amounts')
          }
        })
        
      })
      /*
      let dex = _.findIndex(this.$data.confirmations[item.__index].oldStock, {unit: item.unit})
      api.service('inventory').update(item.id, {
        item: item.item,
        stock: item.stock
      }).then((response) => {
        // audit service 'inventory' with change
        //
      })
      */
    },
    auditItem (itemId) {
      console.log(itemId)
      console.log('////////')
      console.log(this.$data.inventory)
      api.service('audit').find({
        query: {
          $sort: { recordDate: -1 },
          item: itemId.item,
          table: 'inventory',
          $limit: 50
        }
      }).then((response) => {
        console.log('audit resp',response)
        if (response.data.length < 1) {
          this.$q.notify({
            message: 'No audit info for item',
            timeout: 3000,
            position: 'center'
          })
        } else {
          this.$data.auditData = response.data
          this.overlay()
        }
      })
      
    },
    confirmInv (row) {
      console.log('check',this.$data.confirmations[row.__index].confirmed)
      // send current item stock values to audit, only if going from unchecked --> checked
      if (this.$data.confirmations[row.__index].confirmed) {
        row.stock.forEach(unit => {
          let auditObj = {
            table: 'inventory',
            type: 'confirmation',
            recordDate: new Date(),
            confirmedAmt: unit.qty,
            item: row.item,
            unit: unit.unit,
            user: this.$props.user.email
          }
          //this.$data.confirmations[row.__index].warning = false
          this.$data.inventory[row.__index].lastConf = new Date().toISOString()
          api.service('inventory').patch(row.id, {lastConf: new Date()})
          api.service('audit').create(auditObj)
        }, this)
      }
    },
    loadInventoryData () {
      this.$data.inventory = []
      this.$data.confirmations = []
      api.service('inventory').find({
        query: {
          $sort: { item: -1},
          $limit: 200,
          category: this.$data.categoryValue
        }
      })
        .then((response) => {
          console.log('response info', response)
          // We want the latest inventory but in the reversed order
          this.$data.inventory = response.data.reverse()
          this.$data.inventory.forEach(item => {
            console.log(item)
            console.log('----------')
            let timeDiff = moment().dayOfYear() - moment(item.lastConf).dayOfYear()
            if (timeDiff > 1) {
              item.confirmed = false
              if (timeDiff > 7) {
                item.uncheckedIcon = 'cancel'
                // item.color = 'negative'
              } else {
                item.uncheckedIcon = 'remove_circle_outline'
                // item.color = 'secondary'
              }
              // item.warning = ((timeDiff > 7) ? true : false) // want to trigger warning for low stock
              // item.cartColor = 'negative'
            } else {
              item.confirmed = true
              item.warning = false
              item.color = 'secondary'
            }
            let og = JSON.parse(JSON.stringify(item.stock))
            this.$data.confirmations.push( {item: item.item, confirmed: item.confirmed, warning: item.warning, originalStock: og} )
          }, this) // this necessary?
          console.log(this.$data.confirmations)
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
    this.loadInventoryData()
    this.loadCategories()
    /*
    inventory.find({
      query: {
        $sort: { item: -1},
        $limit: 200
      }
    })
      .then((response) => {
        console.log('response info', response)
        // We want the latest inventory but in the reversed order
        this.$data.inventory = response.data.reverse()
        this.$data.inventory.forEach(item => {
          console.log(item)
          console.log('----------')
          let timeDiff = moment().dayOfYear() - moment(item.lastConf).dayOfYear()
          if (timeDiff > 1) {
            item.confirmed = false
            item.warning = ((timeDiff > 7) ? true : false)
          } else {
            item.confirmed = true
            item.warning = false
          }
          let og = JSON.parse(JSON.stringify(item.stock))
          this.$data.confirmations.push( {item: item.item, confirmed: item.confirmed, warning: item.warning, originalStock: og} )
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