
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="month"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          row-key="date1"
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
              v-model="visibleColumns"
              :columns="columns"
            />
          </template>
        </q-table>
        <br>
      </div>
  </q-page>
</template>

<script>
import moment from 'moment'
import api from 'src/api'
import _ from 'lodash'
let EXCEL = require('exceljs/dist/es5/exceljs.browser')
import {
  QChatMessage,
  QTable,
  QTr,
  QTd,
  QSearch,
  QPopupEdit,
  QCheckbox,
  QTableColumns
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
    QTableColumns
  },
  props: ['user'],
  data () {
    return {
      message: '',
      messages: [],
      users: [],
      filter: '',
      pagination: {
        sortBy: name, // String, column 'item' property value
        descending: true,
        page: 1,
        rowsPerPage: 0 // current rows per page being displayed,
      },
      month: [],
      columns: [
        {
          name: 'id',
          required: false,
          label: 'Id',
          align: 'left',
          field: 'id'
        }
      ],
      visibleColumns: []
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
    generateWeek () {
      let ima = moment()
      let week = {}
      this.$data.columns = []
      for (let n = 0; n < 7; n++) {
        week[ima.day(n).format('ddd')] = ima.format('DD-MMM') // {date: ima.format()} // would ima.day(n).format() be better?
        this.$data.columns.push({
          name: ima.format('ddd'),
          required: false,
          label: ima.format('ddd'),
          align: 'center',
          field: ima.format('ddd')
        })
        this.visibleColumns.push(ima.format('ddd'))
      }
      console.log(week)
      this.$data.month.push(week)
    },
    toXlsx () {
      if(typeof EXCEL == 'undefined') 
      {
        EXCEL = require('exceljs/dist/es5/exceljs.browser');
      }
      // exceljs initialize workbook/sheet
      let workbook = new EXCEL.Workbook();
      let worksheet = workbook.addWorksheet('ItemList', {
        properties: {defaultRowHeight: 15},
        pageSetup: {printTitlesRow: '1:2'}
      });
      worksheet.pageSetup.margins = {
        left: 0.25, right: 0.25,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      };
      // cylce through all categories and format to add to worksheet
      let cats = ['DryFood', 'NonFoodstuff', 'Togo', 'Office', 'Alcohol', 'RefrigeratedFood'];
      let m = moment()
      let wsDates = ['']
      for (let n = 0; n < 7; n++) {
        wsDates.push(m.day(n).format('DD-MMM'));
      }
      let wsHeader = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'weekTotal'];
      let wsRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      /*
      for (let dex in wsRows) {
        let tmpRow = dex + ws.rowCount()
        get(tmpRow).border  = {
        bottom: {style:'thin'}
      }
      */
      worksheet.addRow(wsDates)
      worksheet.addRow(wsHeader);
      worksheet.getRow(2).border = {
        bottom: {style:'thin'}
      }
      worksheet.addRow(['']);
      // for (let [index1, cat] of cats.entries()) {
      api.service('transfers').find({
        query: {
          week: {
            $search: this.$data.inventory.week
          }
        }
      }).then(response => {
        console.log('response', response);
        let c = response.data[0];
        // for (let [index2, item] of c.entries()) {
        for (let [index1, cat] of cats.entries()) {
          console.log('cat', cat)
          worksheet.addRow([cat])
          let tmpCell = 'A' + worksheet.rowCount
          worksheet.getCell(tmpCell).font = {
            bold: true,
            underline: true
          }
          for (let [index2, item] of c[cat].entries()) {
            console.log('item', item.item);
            worksheet.addRow([item.item])
            worksheet.getRow(worksheet.rowCount).border = {
              bottom: {style:'thin'}
            }
            console.log('t1', index1, cats.length -1)
            if (index1 === cats.length - 1) {
              console.log('t2', index2, c[cat].length - 1)
              if (index2 === c[cat].length - 1) {
                /* add to workbook */
                console.log('workbook');
                workbook.xlsx.writeBuffer().then(buffer => {
                  saveAs(new Blob([buffer]), `${m.day(0).format('DD-MMM')}_itemList.xlsx`)
                }).catch(err => {
                    console.log('Error writing excel export', err)
                })
              }
            }
          }
          worksheet.addRow([''])
          // check to see how many remaining rows and if page break is warranted
        }
      })
      worksheet.columns = [
        { width: 25 },
        { width: 8 },
        { width: 8 },
        { width: 8 },
        { width: 8 },
        { width: 8 },
        { width: 8 },
        { width: 8 },
        { width: 8 }
      ];
      /* make the worksheet */
      // var ws = XLSX.utils.json_to_sheet(this.$data.itemList);
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
   this.generateWeek()
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