
<template>
  <q-page>
    <div class="row no-wrap" >
      <div>
        <div>
          <q-btn color="primary" :label="yearBase" > <!-- base year select -->
            <q-popover>
              <q-list link>
                <q-item v-for="yr in years" :key="yr" v-close-overlay @click.native="selectYearBase(yr)">
                  <q-item-main>
                    <q-item-tile label>{{ yr }}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-popover>
          </q-btn>
          <q-btn size="sm" icon="arrow_forward" @click="expandMonthRow" >
          </q-btn>
        </div>
        <div>
          <q-btn size="sm" :icon="spanIcon" @click="expandSpan" />
          <br>
          <q-btn v-if="showSpan" :label="yearSpan" > <!-- span year select -->
            <q-popover>
              <q-list link>
                <q-item v-for="yr in years" :key="yr" v-close-overlay @click.native="selectYearSpan(yr)">
                  <q-item-main>
                    <q-item-tile label>{{ yr }}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-popover>
          </q-btn>
          <br>
        </div>
      </div>
    <!-- MONTH ROW -->
    <div v-if="showMonth" >
      <div>
      <q-btn color="primary" :label="monthBase" > <!-- select base month ----->
          <q-popover>
            <q-list link>
              <q-item v-for="month in months" :key="month" v-close-overlay @click.native="selectMonthBase(month)">
                <q-item-main>
                  <q-item-tile label>{{ month }}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
        
    </div>
    <div>
          <q-btn size="sm" icon="remove" >
            <q-popover>
              <q-list link>
                <q-item v-for="month in months" :key="month" v-close-overlay @click.native="selectMonthSpan(month)">
                  <q-item-main>
                    <q-item-tile label>{{ month }}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-popover>
          </q-btn>
          <br>
          <q-btn size="sm" icon="expand_more" >
            <q-popover>
              <q-list link>
                <q-item v-for="month in months" :key="month" v-close-overlay @click.native="selectMonthBase(month)">
                  <q-item-main>
                    <q-item-tile label>{{ month }}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-popover>
          </q-btn>
      </div>
    </div>
    <q-table
        :data="month"
        :columns="columns"
        :filter="filter"
        :visible-columns="visibleColumns"
        row-key="date1"
        :pagination.sync="pagination"
        hide-bottom
        dense >
        <!--- block of column select ---
        <template slot="top-right" slot-scope="props">
          <q-table-columns
            color="secondary"
            class="q-mr-sm"
            v-model="visibleColumns"
            :columns="columns"
          />
        </template>
        <----------------- end of column select -->
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="Sun" :props="props" >
              <q-btn size="md" :class="props.row.Sun.color" :label="props.row.Sun.date1" @click="toggleColor(props.row.Sun)"/>
            </q-td>
            <q-td key="Mon" :props="props">
              <q-btn size="md" :class="props.row.Mon.color" :label="props.row.Mon.date1" @click="toggleColor(props.row.Mon)"/>
            </q-td>
            <q-td key="Tue" :props="props" >
              <q-btn size="md" :class="props.row.Tue.color" :label="props.row.Tue.date1" @click="toggleColor(props.row.Tue)"/>
            </q-td>
            <q-td key="Wed" :props="props" >
              <q-btn size="md" :class="props.row.Wed.color" :label="props.row.Wed.date1" @click="toggleColor(props.row.Wed)"/>
            </q-td>
            <q-td key="Thu" :props="props" >
              <q-btn size="md" :class="props.row.Thu.color" :label="props.row.Thu.date1" @click="toggleColor(props.row.Thu)"/>
            </q-td>
            <q-td key="Fri" :props="props" >
              <q-btn size="md" :class="props.row.Fri.color" :label="props.row.Fri.date1" @click="toggleColor(props.row.Fri)"/>
            </q-td>
            <q-td key="Sat" :props="props" >
              <q-btn size="md" :class="props.row.Sat.color" :label="props.row.Sat.date1" @click="toggleColor(props.row.Sat)"/>
            </q-td>
          </q-tr>
      </q-table>
    </div><!---****************** END OF DATE NAVIGATION *****************----------->
    <div class="row no-wrap">
      <q-table
        :data="month"
        :columns="columns"
        :filter="filter"
        :visible-columns="visibleColumns"
        row-key="date1"
        :pagination.sync="pagination"
        hide-bottom
        dense >
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="Sun" :props="props" >
              <q-btn size="md" :class="props.row.Sun.color" :label="props.row.Sun.date1" @click="toggleColor(props.row.Sun)"/>
            </q-td>
            <q-td key="Mon" :props="props">
              <q-btn size="md" :class="props.row.Mon.color" :label="props.row.Mon.date1" @click="toggleColor(props.row.Mon)"/>
            </q-td>
            <q-td key="Tue" :props="props" >
              <q-btn size="md" :class="props.row.Tue.color" :label="props.row.Tue.date1" @click="toggleColor(props.row.Tue)"/>
            </q-td>
            <q-td key="Wed" :props="props" >
              <q-btn size="md" :class="props.row.Wed.color" :label="props.row.Wed.date1" @click="toggleColor(props.row.Wed)"/>
            </q-td>
            <q-td key="Thu" :props="props" >
              <q-btn size="md" :class="props.row.Thu.color" :label="props.row.Thu.date1" @click="toggleColor(props.row.Thu)"/>
            </q-td>
            <q-td key="Fri" :props="props" >
              <q-btn size="md" :class="props.row.Fri.color" :label="props.row.Fri.date1" @click="toggleColor(props.row.Fri)"/>
            </q-td>
            <q-td key="Sat" :props="props" >
              <q-btn size="md" :class="props.row.Sat.color" :label="props.row.Sat.date1" @click="toggleColor(props.row.Sat)"/>
            </q-td>
          </q-tr>
      </q-table>
      <br>        
    </div>
    <div>
    <br>
      <!-- ////////// start of journal datatable //////////// -->  
      <q-table
        :data="journal"
        :columns="journalColumns"
        :filter="filter"
        :visible-columns="visibleJournalColumns"
        row-key="date1"
        :pagination.sync="pagination" >
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
            v-model="visibleJournalColumns"
            :columns="journalColumns"
          />
        </template>
        <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="cash:" :props="props" >
              {{ props.row }}
            </q-td>
        </q-tr>
      </q-table>
    </div>
    <br>
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
  QTableColumns,
  QCard,
  QCardTitle,
  QCardMain,
  QCardMedia,
  QCardSeparator,
  QCardActions,
  QDatetime,
  QPopover
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
    QTableColumns,
    QCard,
    QCardTitle,
    QCardMain,
    QCardMedia,
    QCardSeparator,
    QCardActions,
    QDatetime,
    QPopover
  },
  props: ['user'],
  data () {
    return {
      spanIcon: 'expand_more',
      showMonth: false,
      showSpan: false,
      yearBase: 2016,
      yearSpan: '--',
      monthBase: '',
      months: [],
      years: [2017, 2018, 2019],
      selectWeek: '',
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
      visibleColumns: [],
      journalObject: {
        date1: '',
        credit: '',
        debit: ''
      },
      journal1: [
        {
          date1: '2018-11-19T03:30:54.661Z',
          credit: [
            {
              account: 'cashMS',
              amount: '360'
            }
          ],
          debit: [
            {
              account: 'cogsMeatshop',
              amount: '360'
            }
          ]
        }
      ],
      journal: [
        {
          date1: '2018-11-19T03:30:54.661Z',
          cash: [
            {
              account: 'cashMS',
              amount: '360',
              type: 'credit'
            }
          ],
          expenses: [
            {
              account: 'cogsMeatshop',
              amount: '360',
              type: 'debit'
            }
          ]
        }
      ],
      journalColumns: [],
      visibleJournalColumns: [],
      journalColumnList: []
    }
  },
  computed: {
  },
  methods: {
    expandSpan () {
      this.$data.showSpan = !this.$data.showSpan
      if(this.$data.showSpan) {
        this.$data.spanIcon = 'remove'
      } else {
        this.$data.spanIcon = 'expand_more'
      }
    },
    selectMonthSpan (span) {
      // parse month
      let m = this.$data.monthBase
      const spanDex = m.indexOf('-')
      if (spanDex > -1) {
        m = m.substr(0, spanDex)
      }
      this.$data.monthBase = m
      // check that span month is not less than base month
      const isMonthLessThanSpan = moment().month(m).get('month') < moment().month(span).get('month')
      if (isMonthLessThanSpan) {
        this.$data.monthBase += `-${span}`
      }
    },
    selectMonthBase (month) {
      // check to see if showMonthSpan true
      this.$data.monthBase = month
    },
    expandMonthRow (month) {
      this.$data.showMonth = !this.$data.showMonth
      this.$data.monthBase = moment().format('MMM')
    },
    selectYearBase (base) {
      // check if year has span
      let yr = this.$data.yearBase
      if (this.$data.showSpan) {
        const isBaseLessThanSpan = base < this.$data.yearSpan
        if (isBaseLessThanSpan) {
          this.$data.yearBase = base
        }
      } else {
        this.$data.yearBase = base
      }
      /*
      const spanDex = yr.indexOf('-')
      if (spanDex > -1) {
        // parse span year
        let span = yr.substr(spanDex + 1)
        //const isYearLessThanSpan = Number(n.substr(-2)) < Number(span)
        if (isYearLessThanSpan) {
          this.$data.yearBase += `-${span}`
        }
      }
      */
    },
    selectYearSpan (n) {
      /*
      const span = n.substr(-2)
      let yr = this.$data.yearBase
      // parse starting year
      const dex = yr.indexOf('-')
      if (dex > -1) {
        yr = yr.substr(0, dex)
      }
      this.$data.yearBase = yr
      */
      // make sure span is greater than starting year
      const isYearLessThanSpan = this.$data.yearBase < n
      console.log(isYearLessThanSpan)
      if (isYearLessThanSpan) {
        this.$data.yearSpan = n
      }
      // this.$data.yearBase = `${yr}-${n.substr(2)}` 
    },
    loadMonths() {
      let m = []
      for(let n = 0; n < 12; n++) {
        m.push(moment().month(n).format('MMM'))
      }
      this.$data.months = m
    },
    clickCard () {
      console.log('card')
    },
    toggleColor (cell) {
      console.log('click', cell)
      console.log(_.size(this.$data.month[0]))
      if (cell.color === 'bg-deep-purple-1') {
        cell.color = 'bg-deep-purple-3'
      } else {
        cell.color = 'bg-deep-purple-1'
      }
      // this.$data.month[__index]
    },
    generateWeek () {
      let ima = moment()
      let week = {}
      this.$data.columns = []
      for (let n = 0; n < 7; n++) {
        let c = ''
        if (ima.day(n).format('ddd') === moment().format('ddd')) {
          c = 'bg-deep-purple-3'
        } else {
          c = 'bg-deep-purple-1'
        }
        // create object key=dayofweek, day: date, color
        week[ima.day(n).format('ddd')] = {date1: ima.format('DD'), color: c} // ima.format('DD-MMM') // would ima.day(n).format() be better?
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
      console.log('month1', this.$data.month)
      console.log('journal', this.$data.journal)
      console.log('week', week)
      this.$data.month.push(week)
    },
    generateJournalCols () {
      console.log('journal', this.$data.journal)
      let acctEqu = ['assets', 'liabilities', 'equity']
      let equity = ['expenses', 'sales']
      let liabilities = ['payable']
      let assets = ['receivable', 'prepaid', 'inventory', 'cash', 'equipment']
      let equation = assets.concat('=', liabilities, equity)
      this.$data.journalColumnList = equation
      let color = ''
      for (let n = 0; n < equation.length; n++) {
        let col = equation[n]
        if (assets.includes(col)) {
          color = 'bg-green-3'
        }
        if (equity.includes(col)) {
          color = 'bg-deep-purple-2'
        }
        if (col.includes('=')) {
          color = ''
        }
        this.$data.journalColumns.push({
          name: col,
          required: false,
          label: col,
          align: 'center',
          field: col,
          classes: color
        })
        this.visibleJournalColumns.push(col)
      }
    }
  },
  mounted () {
    this.generateWeek()
    this.generateJournalCols()
    this.loadMonths()
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
  /* 
  .q-card {
    width: 120px
  }
  */
</style>