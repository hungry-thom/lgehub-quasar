<!-- InventoryTransfer.vue -->
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="transfers.itemList"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          row-key="item"
          :pagination.sync="pagination" >
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
          <tr slot="header" slot-scope="props">
            <q-th key="item" :props="props">
              <u>Item</u>
            </q-th>
             <q-th key="Sun" :props="props">
              {{ weekDates[0] }} <br> Sun 
            </q-th>
            <q-th key="Mon" :props="props">
              {{ weekDates[1] }} <br> Mon 
            </q-th>
            <q-th key="Tue" :props="props">
              {{ weekDates[2] }} <br> Tue
            </q-th>
            <q-th key="Wed" :props="props">
              {{ weekDates[3] }} <br> Wed
            </q-th>
            <q-th key="Thu" :props="props">
              {{ weekDates[4] }} <br> Thu
            </q-th>
            <q-th key="Fri" :props="props">
              {{ weekDates[5] }} <br> Fri
            </q-th>
            <q-th key="Sat" :props="props">
              {{ weekDates[6] }} <br> Sat
            </q-th>
            <q-th key="weekTotal" :props="props">weekTotal</q-th>
          </tr>
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="item" :props="props">{{ props.row.item }}</q-td>
            <q-td key="Sun" :props="props">
              {{ props.row.Sun.total || '-' }}
                <q-popup-edit v-model="props.row.Sun" @save="updateCount(props.row, 'Sun')" buttons>
                  <div class="row no-wrap" v-for="units in props.row.Sun.transfers" :key="units.unit">
                    <q-field class="q-pt-xs">{{ units.unit }}:</q-field>&nbsp;&nbsp;
                    <q-input type="number" v-model="units.qty" />
                  </div>
                </q-popup-edit>
            </q-td>
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
            <q-td key="weekTotal" :props="props">
              <div>
                {{ props.row.weekTotal || '-' }}
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
  QField,
  QRadio,
  QBtnDropdown
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
    QField,
    QRadio,
    QBtnDropdown
  },
  props: ['user'],
  data () {
    return {
      transfers: {},
      categoryValue: 'DryFood',
      categoryArray: [],
      // itemList: [],
      startingDate: moment(),
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
          name: 'Sun',
          required: true,
          label: 'Sun',
          align: 'left',
          field: 'Sun',
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
        },
        {
          name: 'weekTotal',
          required: true,
          label: 'weekTotal',
          align: 'center',
          field: 'weekTotal'
        }
      ],
      visibleColumns: ['item','Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  computed: {
  },
  methods: {
    showNotification (val) {
      console.log(val)
      this.$data.categoryValue = val
      this.loadTransferData(this.$data.inventory.week)
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
    updateCount (item, day) {
      console.log('?????',item)
      // props.row.tue
      let t = 0 // total variable
      let transferUnit = {}
      let checkTransferVals = this.$data.originalTransferVals
      let auditObj1 = {
        type: 'transfer',
        table: 'transfer',
        item: item.item,
        day: day,
        recordDate: new Date(),
        user: this.$props.user.email
      }
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
        if (transferValue !== 0) {
          auditObj1.unit = unit.unit
          auditObj1.qty = transferValue * -1 // should transfer qty be negative
        }
        // need to update originalTansferVals with new value
        this.$data.originalTransferVals[itemIndex][day].transfers[unitIndex].qty
      })
      console.log('loadTransferQty', transferUnit)
      item[day].total = t
      // will wait to update transfers db until end to run weekTOtal loop
      item.weekTotal = 0
      Object.keys(item).forEach(row => {
        console.log('weekTotal', row, item.weekTotal )
        if (item[row].total) {
          console.log('true', item[row].total)
          item.weekTotal += item[row].total
        }
      })
      // audit trail type='transfer' for item --> day --> unit --> qty 
      api.service('inventory').get(item.id)
        .then((invItem) => {
          let updatedStock = []
          let auditUnit = ''
          let auditUnitQty = 0
          invItem.stock.forEach(unit => {
            let newUnitQty = unit.qty - transferUnit[unit.unit]
            if (transferUnit[unit.unit] !== 0) {
              auditUnitQty = transferUnit[unit.unit] * -1
              auditUnit = unit.unit
            }
            // console.log('mathCheck', unit.qty, transferUnit[unit.unit],)
            updatedStock.push({unit: unit.unit, qty: newUnitQty})

          })
          console.log('patchInv', updatedStock)
          /* disabled for testing purposes
          api.service('inventory').patch(invItem.id, {stock: updatedStock}).then((response) => {
            let auditObj2 = {
              recordDate: new Date(),
              table: 'inventory',
              type: 'transfer',
              item: item.item,
              unit: auditUnit,
              change: auditUnitQty,
              user: this.$props.user.email
            }
              api.service('audit').create(auditObj2)
          })
          */
        })
      // updating transfers db at end so weekTotal can finish
      let pos = this.$data.categoryArray.indexOf(this.$data.categoryValue)
      /*
      if (pos > -1) {
        api.service('transfers').patch(this.$data.inventory.id, {
          categoryArray.pos: this.$data.inventory.items // patches entire item list for the week. seems excessive
        }).then((response) => {
          console.log('updated transfers!!!', response)
          api.service('audit').create(auditObj1)
        })
      } else {
        console.log('error, item category not found. transfer db not updated')
      }
      */
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
    // not in use
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
      let d = new Date(this.$data.inventory.week)
      let nWeek = moment(d)
      nWeek.add(7,'days')
      this.loadTransferData(nWeek.format('DD-MMM-YYYY'))
    },
    clickPrevWeek() {
      let d = new Date(this.$data.inventory.week)
      let pWeek = moment(d)
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
      console.log('creating new blank week')
      // will have to update to accomodate more than 200 docs
      api.service('inventory').find({
        query: {
          $sort: { item: 1},
          $limit: 500
        }
      }).then((response2) => {
        let tempWeekTransfers = {}
        let ima = moment()
        tempWeekTransfers.week = ima.day(0).format('DD-MMM-YYYY') // set sunday as start of week / lookup value
        console.log('call2 inventory',response2.data)
        response2.data.forEach(item => {
          // find base units
          let tempItem = {} // to be added to appropriate category list
          tempItem.item = item.item 
          tempItem.id = item.id
          tempItem.weekTotal = 0
          let tempStock = []
          item.stock.forEach(stock => { 
            let tempUnit = {}
            tempUnit.unit = stock.unit
            tempUnit.qty = 0
            tempStock.push(tempUnit) 
          }, this)
          // for each day add empty base units
          // this.$data.days.forEach(day => {
          for (let n = 0; n < 7; n++) {
            let tmp = {}
            let cleanStock = JSON.parse(JSON.stringify(tempStock))
            tempItem[ima.day(n).format('ddd')] = { total: 0, transfers: cleanStock }
            // tempWeekTransfers.items[day] = {total:0 , transfers: tempStock }
          } // , this)
          if (!tempWeekTransfers[item.category]) {
            tempWeekTransfers[item.category] = []
          }
          tempWeekTransfers[item.category].push(tempItem) // change
        }, this)
        console.log('NewTransferWeek', tempWeekTransfers)
        this.$data.inventory = tempWeekTransfers /////IMPORTANT Maybe leave out and just make a call to transfer db
        api.service('transfers').create(tempWeekTransfers).then((response) => {
          console.log('created week', response.id)
          // this.$data.inventory.id = response.id
          this.loadTransferData(tempWeekTransfers.week)
        })
        /*vvvvvvvvMIGHT BE ABLE TO ELIMINATE ALL THIS IF CALL TO LOAD IS BETTER vvvvvvvvvvvvvv
        // load new starting date
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
        console.log(this.$data.originalTransferVals)
        // check for previous and next week
        this.checkPrevNextButtons()
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
      })
      // this.$data.inventory = this.$data.inventory2
      // end createBlankTransferRec
      
    },
    generateWeek () {
      let ima = moment()
      let week = {}
      this.$data.columns = []
      for (let n = 0; n < 7; n++) {
        // create object key=dayofweek, day: date, color
        week[ima.day(n).format('ddd')] = {date1: ima.format('DD-MMM'), color: c} // ima.format('DD-MMM') // would ima.day(n).format() be better?
        this.$data.columns.push({
          name: ima.format('ddd'),
          required: false,
          label: ima.format('ddd'),
          align: 'center',
          field: ima.format('ddd'),
          // classes: 'bg-deep-purple-1'
        })
        this.visibleColumns.push(ima.format('ddd'))
      }
    },
    initializeData () {
      // find transfer record (week) using current sunday's date
      // let cMonday = this.currentMonday()
      let ima = moment()
      let currentSunday = ima.day(0)
      // console.log('current Monday', cMonday)
      // this.$data.startingDate = moment(cMonday)
      // find transfer record of current week
      // set starting date
      // let d = new Date(this.$data.inventory.week) // ??
      // this.$data.startingDate = moment(d)
      // let dateDay = moment(cMonday)
      let dateWeek = []
      for (let n = 0; n < 7; n++) {
        dateWeek.push(ima.day(n).format('DD-MMM'))
      }
      /*
      this.$data.days.forEach(day =>{
        dateWeek.push(dateDay.format('DD-MMM'))
        dateDay.add(1, 'days')
      })
      */
      this.$data.weekDates = dateWeek
      console.log('dateWeek', dateWeek)
      this.loadTransferData(ima.day(0).format('DD-MMM-YYYY'))
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
          // this.$data.itemList = this.$data.inventory[this.$data.categoryValue] // is this a pointer or double the data?
          console.log('inventory',this.$data.inventory)
          // load new starting date
          let d = new Date(this.$data.inventory.week)
          this.$data.startingDate = moment(d) // used for nav buttons, should probably be replaced
          let dateDay = moment(d)
          let dateWeek = []
          this.$data.days.forEach(day =>{
            dateWeek.push(dateDay.format('DD-MMM'))
            dateDay.add(1, 'days')
          })
          this.$data.weekDates = dateWeek
          console.log('dateWeek', dateWeek)
          // create copy of loaded data for original Values
          console.log('creating copy of data for og vals', this.$data.inventory)
          this.$data.originalTransferVals = JSON.parse(JSON.stringify(this.$data.inventory.itemList))
          console.log(this.$data.originalTransferVals)
          // check for previous and next week
          this.checkPrevNextButtons()
        } else {
          console.log('no record', response)
          this.setupNewTransferWeek()
          // this.createBlankTransferRec()
          // starting date already set with initialization
          // original transfer vals and navigation buttons loaded in createBlankTransferRec()
        }
      })
      // vvv-- the following code is executed while waiting for response from database --vvv
      // doesn't execute on hot reload
      console.log('async code (waiting on db response)')
    },
    setStartingDate () {

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
    },
    setupNewTransferWeek () {
      // this.$data.itemCategory = []
      let ima = moment()
      this.$data.transfers.week = ima.day(0).format('DD-MMM-YYYY') // set sunday as start of week / lookup value
      this.$data.transfers.itemList = []
      this.loadInventoryData(0) // zero initializes the skip cycle, if there are more than 200 records
    },
    loadInventoryData(skipNum) {
      // there will be a problem if docs exceed 200
      api.service('inventory').find({
        query: {
          $sort: { item: 1 }, // alphabetical
          $limit: 500, // 200 is max
          $skip: skipNum * 200
        }
      }).then((response) => {
        // this.$data.itemCategory = [] // moved to loadData(), kept clearing on multiple loads
        // let uniqueVendors = [] // moved to loadData(), kept clearing on multiple loads
        let tempWeekTransfers = {}
        response.data.forEach(item => {
          //this.$data.inventory.push(item)
          // let check = _.findIndex(this.$data.categoryList, {value: item.category})
          // console.log('check',this.$data.categoryList, item.category)
          
          let tempItem = {} // to be added to appropriate category list
          tempItem.item = item.item 
          tempItem.id = item.id
          tempItem.weekTotal = 0
          tempItem.category = item.category
          let tempStock = []
          item.stock.forEach(stock => { 
            let tempUnit = {}
            tempUnit.unit = stock.unit
            tempUnit.qty = 0
            tempStock.push(tempUnit) 
          }, this)
          // for each day add empty base units
          // this.$data.days.forEach(day => {
          let ima = moment()
          for (let n = 0; n < 7; n++) {
            let tmp = {}
            let cleanStock = JSON.parse(JSON.stringify(tempStock))
            tempItem[ima.day(n).format('ddd')] = { total: 0, transfers: cleanStock }
          } // , this)
          console.log('itemObj', tempItem)
          this.$data.transfers.itemList.push(tempItem) // change
          console.log('itemList', this.$data.transfers)
        }, this)
        console.log('response0', response.data.length)
        // handle more than 200
        if (response.data.length > 199) {
          console.log('rerun load pricelist')
          skipNum++
          this.loadInventoryData(skipNum)
        } else {
          console.log('LOAD INVENTORYDATA?!!!!!!!!!!!!!', this.$data.transfers)
          // this.loadInventoryData()
          api.service('transfers').create(this.$data.transfers).then((response) => {
          console.log('created week2', response)
          this.$data.transfers.id = response.id
          // this.loadTransferData(tempWeekTransfers.week)
        })
        }
      })
    }
  },
  mounted () {
    // load tranfer data (api.service('transfers'))
    // this.$data.startingDate = this.currentMonday()
    // api.service('transfers').remove('e1afc841-2727-468a-8e9a-c7fcaa252f23')
    this.initializeData()
    this.loadCategories()
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