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
            <q-btn icon="navigate_before" color="secondary" :disable="disablePrevWeek" @click="clickPrevWeek"/>&nbsp;&nbsp;
            <q-btn icon="navigate_next" color="secondary"  :disable="disableNextWeek" @click="clickNextWeek" />&nbsp;&nbsp;
            <q-search
              clearable
              color="secondary"
              v-model="filter"
              class="col-6"
            />
          </template>
          <tr slot="header" slot-scope="props">
            <q-th key="item" :props="props">
              <u>Item</u>
            </q-th>
            <q-th key="Mon" :props="props">
              {{ weekDates[0] }} <br> Mon 
            </q-th>
            <q-th key="Tue" :props="props">
              {{ weekDates[1] }} <br> Tue
            </q-th>
            <q-th key="Wed" :props="props">
              {{ weekDates[2] }} <br> Wed
            </q-th>
            <q-th key="Thu" :props="props">
              {{ weekDates[3] }} <br> Thu
            </q-th>
            <q-th key="Fri" :props="props">
              {{ weekDates[4] }} <br> Fri
            </q-th>
            <q-th key="Sat" :props="props">
              {{ weekDates[5] }} <br> Sat
            </q-th>
          </tr>
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
  QTh,
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
    QTh,
    QSearch,
    QPopupEdit,
    QCheckbox,
    QBtn,
    QField
  },
  props: ['user'],
  data () {
    return {
      startingDate: moment(),
      days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
      weekDates: [],
      disablePrevWeek: true,
      disableNextWeek: true,
      message: '',
      messages: [],
      users: [],
      inventory: [],
      originalTransferVals: {},
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
          align: 'center',
          field: 'Mon'
        },
        {
          name: 'Tue',
          required: true,
          label: 'Tue',
          align: 'center',
          field: 'Tue'
        },
        {
          name: 'Wed',
          required: true,
          label: 'Wed',
          align: 'center',
          field: 'Wed'
        },
        {
          name: 'Thu',
          required: true,
          label: 'Thu',
          align: 'center',
          field: 'Thu'
        },
        {
          name: 'Fri',
          required: true,
          label: 'Fri',
          align: 'center',
          field: 'Fri'
        },
        {
          name: 'Sat',
          required: true,
          label: 'Sat',
          align: 'center',
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
      let transferUnit = {}
      let checkTransferVals = this.$data.originalTransferVals.items
      item[day].transfers.forEach(unit => {
        t += unit.qty
        // amount to change inventory stock = originalQty - this.unit.qty
        // get itemIndex of this.item in original.items
        let itemIndex = _.findIndex(checkTransferVals, {id: item.id})
        // get Unitindex of this.item.unit in original.items[itemIndex][day].transfers
        let unitIndex = _.findIndex(checkTransferVals[itemIndex][day].transfers, {unit: unit.unit})
        // transferValue = original.items[itemIndex][day].transfers[unitIndex].qty - unit.qty
        let transferValue =  unit.qty - checkTransferVals[itemIndex][day].transfers[unitIndex].qty
        // transferUnit[unit.unit] = transferValue
        transferUnit[unit.unit] = transferValue
        // OLD: transferUnit[unit.unit] = unit.qty
        // need to update originalTansferVals with new value
        this.$data.originalTransferVals.items[itemIndex][day].transfers[unitIndex].qty
      })
      console.log('loadTransferQty', transferUnit)
      item[day].total = t
      api.service('transfers').patch(this.$data.inventory.id, {
        items: this.$data.inventory.items
      })
      api.service('inventory').get(item.id)
        .then((invItem) => {
          let updatedStock = []
          invItem.stock.forEach(unit => {
            let newUnitQty = unit.qty - transferUnit[unit.unit]
            // console.log('mathCheck', unit.qty, transferUnit[unit.unit],)
            updatedStock.push({unit: unit.unit, qty: newUnitQty})
          })
          console.log('patchInv', updatedStock)
          api.service('inventory').patch(invItem.id, {stock: updatedStock})
        })
      
      /*
        r.db('test').table('transfers').get('0c3ac6e3-3b09-46b5-9e36-df8e725abe33').update( {
          items: r.row("items").map((item) => {
            return r.branch(
              item("id").eq('cded527a-8ee5-4d3a-8f1f-8ad2f55ca240'),
              item.merge({Fri:  {total: 0, transfers:[{qty: 99, unit:'10-gal'}]}}),
              item.merge(item)
            );
          })
        })
   */
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
    clickNextWeek() {
      let nWeek = moment(this.$data.inventory.week) //change
      nWeek.add(7,'days')
      this.loadTransferData(nWeek.format('DD-MMM-YYYY'))
    },
    clickPrevWeek() {
      let pWeek = moment(this.$data.inventory.week) //change
      pWeek.subtract(7,'days')
      this.loadTransferData(pWeek.format('DD-MMM-YYYY'))
     /*
      api.service('transfers').find({
        query: {
          week: {
            $search: pWeek.format('DD-MMM-YYYY')
          }
        }
      }).then((response) =>{
        console.log('prevWeek loaded')
        this.$data.inventory = response.data[0]
        // set starting date
        let d = new Date(this.$data.inventory.week)
        this.$data.startingDate = moment(d)
        let dateDay = moment(d)
        let dateWeek = []
        this.$data.days.forEach(day =>{
          dateWeek.push(dateDay.format('DD-MMM'))
          dateDay.add(1, 'days')
        })
        this.$data.weekDates = dateWeek
      })
      */
    },
    currentMonday() {
      let days = ['Mon','Tue','Wed','Thu','Fri','Sat']
      let today = moment()
      let dex = days.indexOf(today.format('ddd'))
      let cMon = today.subtract(dex, 'days')
      return cMon
    },
    createBlankTransferRec() {
      // get all items for inventory to create transfer list
      api.service('inventory').find({
        query: {
          $sort: { item: 1}
        }
      }).then((response2) => {
        let tempWeekTransfers = {}
        tempWeekTransfers.week = this.currentMonday().format('DD-MMM-YYYY')
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
          this.$data.days.forEach(day => {
            let tmp = {}
            let cleanStock = JSON.parse(JSON.stringify(tempStock))
            tempItem[day] = { total: 0, transfers: cleanStock }
            // tempWeekTransfers.items[day] = {total:0 , transfers: tempStock }
          }, this)
          tempWeekTransfers.items.push(tempItem)
        }, this)
        console.log('NewTransferWeek', tempWeekTransfers)
        this.$data.inventory = tempWeekTransfers
        api.service('transfers').create(tempWeekTransfers).then((response) => {
          console.log('created week', response.id)
          this.$data.inventory.id = response.id
        })
      })
      // this.$data.inventory = this.$data.inventory2
      // end createBlankTransferRec
    },
    initializeData () {
      // find transfer record (week) using this monday's date
      let cMonday = this.currentMonday()
      // cMonday = '01-Oct-2018'
      console.log('current Monday', cMonday)
      // this.$data.startingDate = moment(cMonday)
      // find transfer record of current week
      // set starting date
      let d = new Date(this.$data.inventory.week)
      this.$data.startingDate = moment(d)
      let dateDay = moment(cMonday)
      let dateWeek = []
      this.$data.days.forEach(day =>{
        dateWeek.push(dateDay.format('DD-MMM'))
        dateDay.add(1, 'days')
      })
      this.$data.weekDates = dateWeek
      console.log('dateWeek', dateWeek)
      this.loadTransferData(cMonday.format('DD-MMM-YYYY'))
    },
    loadTransferData(lookupDate) {
      // find transfer record (week) using this monday's date
      //let cMonday = this.currentMonday()
      // cMonday = '01-Oct-2018'
      console.log('looking up ', lookupDate, 'in transfers')
      // this.$data.startingDate = moment(cMonday)
      // find transfer record of current week
      api.service('transfers').find({
        query: {
          week: {
            $search: lookupDate
          }
        }
      }).then((response) => {
        if (response.data.length > 0) {
          // what if more than 1 record found?
          console.log('record found', response)
          this.$data.inventory = response.data[0]
          console.log('inventory',this.$data.inventory)
        } else {
          console.log('no record', response)
          this.createBlankTransferRec()
        }
        // set starting date
        let d = new Date(this.$data.inventory.week)
        this.$data.startingDate = moment(d)
        let dateDay = moment(d)
        let dateWeek = []
        this.$data.days.forEach(day =>{
          dateWeek.push(dateDay.format('DD-MMM'))
          dateDay.add(1, 'days')
        })
        this.$data.weekDates = dateWeek
        console.log('dateWeek', dateWeek)
        // create copy of loaded data for original Values
        console.log('creating copy of data for og vals')
        this.$data.originalTransferVals = JSON.parse(JSON.stringify(this.$data.inventory))
        console.log('st date',this.$data.startingDate.format('DD-MMM-YYYY'))
        // check for previous and next week
        this.checkPrevNextButtons()
      })
      // vvv-- the following code is executed while waiting for response from database --vvv
      // doesn't execute on hot reload
      console.log('async code (waiting on db response)')
    }, 
    checkPrevNextButtons () {
      let nWeek = moment(this.$data.startingDate).add(7, 'days')
      api.service('transfers').find({
        query: {
          week: {
            $search: nWeek.format('DD-MMM-YYYY')
          }
        }
      }).then((response) => {
        this.$data.disableNextWeek = (response.data.length > 0) ? false : true // if record found, do not disable button
      })
      // check next week
      let pWeek = moment(this.$data.startingDate).subtract(7, 'days')
      api.service('transfers').find({
        query: {
          week: {
            $search: pWeek.format('DD-MMM-YYYY')
          }
        }
      }).then((response) => {
        this.$data.disablePrevWeek = (response.data.length > 0) ? false : true // if record found, do not disable button
      })
    }
  },
  mounted () {
    //load tranfer data (api.service('transfers'))
    //this.$data.startingDate = this.currentMonday()
    this.initializeData()
    // this.loadTransferData()
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