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
                <q-popup-edit v-model="props.row.Mon" @save="updateCount(props.row, 'Mon')" buttons>
                  <div class="row no-wrap" v-for="units in props.row.Mon.transfers" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
            </q-td>
            <q-td key="Tue" :props="props">
              <div>
                {{ props.row.Tue.total || '-' }}
                <q-popup-edit v-model="props.row.Tue" @save="updateCount(props.row, 'Tue')" buttons>
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
                <q-popup-edit v-model="props.row.Wed" @save="updateCount(props.row, 'Wed')" buttons>
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
                <q-popup-edit v-model="props.row.Thu" @save="updateCount(props.row, 'Thu')" buttons>
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
                <q-popup-edit v-model="props.row.Fri" @save="updateCount(props.row, 'Fri')" buttons>
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
                <q-popup-edit v-model="props.row.Sat" @save="updateCount(props.row, 'Sat')" buttons>
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
    updateCount (item, day) {
      console.log('?????',item)
      // props.row.tue
      let t = 0
      item[day].transfers.forEach(unit => {
        t += unit.qty
      })
      item[day].total = t
      // api.service('tranfers').update(item.id, item[day] = )
    },
    confirmInv () {
      // .every() cycles through until first false encountered
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
                api.service('transfers').create(tempWeekTransfers)
              }) 
            // this.$data.inventory = this.$data.inventory2
          }
        })
    }
  },
  mounted () {
    //load tranfer data (api.service('transfers'))
    this.loadTransferData()
    /*
    inventory.on('created', inv => {
      console.log('item received')
      this.$data.inventory.push(inv)
    })
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