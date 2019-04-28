
<template>
  <q-page>
      <!------- YEAR ROW --------->
      <div class="row no-wrap">
        <q-btn color="primary" :label="year" >
          <q-popover>
            <q-list link>
              <q-item v-for="yr in years" :key="yr" v-close-overlay @click.native="selectYear(yr)">
                <q-item-main>
                  <q-item-tile label>{{ yr }}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <!--  YEAR BUTTONS --->
        <div>
          <q-btn size="sm" icon="remove" >
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
          <q-btn size="sm" icon="expand_more" @click="expandMonthRow" >
          </q-btn>
        </div>
        <!--------- PROTOTYPE FOR COLUMN STYLE -------------------------
        <q-btn color="primary" :label="year" >
          <q-popover>
            <q-list link>
              <q-item v-for="yr in years" :key="yr" v-close-overlay @click.native="selectYear(yr)">
                <q-item-main>
                  <q-item-tile label>{{ yr }}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
        ------------ END OF PROTOTYPE ------------->
      </div>
      <br>
      <!-- MONTH ROW -->
      <div v-if="showMonth" class="row no-wrap">
        <q-btn color="primary" :label="month" >
            <q-popover>
              <q-list link>
                <q-item v-for="month in months" :key="month" v-close-overlay @click.native="selectMonth(month)">
                  <q-item-main>
                    <q-item-tile label>{{ month }}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-popover>
          </q-btn>
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
                  <q-item v-for="month in months" :key="month" v-close-overlay @click.native="selectMonth(month)">
                    <q-item-main>
                      <q-item-tile label>{{ month }}</q-item-tile>
                    </q-item-main>
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
        </div>
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
  QTableColumns,
  QSelect,
  QBtnDropdown,
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
    QSelect,
    QBtnDropdown,
    QPopover
  },
  props: ['user'],
  data () {
    return {
      year: '2016',
      years: ['2017', '2018', '2019'],
      months: [],
      month: '',
      showMonth: false,
      filter: '',
      pagination: {
        sortBy: name, // String, column 'item' property value
        descending: true,
        page: 1,
        rowsPerPage: 0 // current rows per page being displayed,
      },
      month: []
    }
  },
  computed: {
  },
  methods: {
    selectMonthSpan (span) {
      // parse month
      let m = this.$data.month
      const spanDex = m.indexOf('-')
      if (spanDex > -1) {
        m = m.substr(0, spanDex)
      }
      this.$data.month = m
      // check that span month is not less than base month
      const isMonthLessThanSpan = moment().month(m).get('month') < moment().month(span).get('month')
      if (isMonthLessThanSpan) {
        this.$data.month += `-${span}`
      }
    },
    selectMonth (month) {
      this.$data.month = month
    },
    expandMonthRow (month) {
      this.$data.showMonth = !this.$data.showMonth
      this.$data.month = moment().format('MMM')
    },
    selectYear (n) {
      // check if year has span
      let yr = this.$data.year
      this.$data.year = n
      const spanDex = yr.indexOf('-')
      if (spanDex > -1) {
        // parse span year
        let span = yr.substr(spanDex + 1)
        const isYearLessThanSpan = Number(n.substr(-2)) < Number(span)
        if (isYearLessThanSpan) {
          this.$data.year += `-${span}`
        }
      }
    },
    selectYearSpan (n) {
      const span = n.substr(-2)
      let yr = this.$data.year
      // parse starting year
      const dex = yr.indexOf('-')
      if (dex > -1) {
        yr = yr.substr(0, dex)
      }
      this.$data.year = yr
      // make sure span is greater than starting year
      const isYearLessThanSpan = Number(yr.substr(-2)) < Number(span)
      if (isYearLessThanSpan) {
        this.$data.year += `-${span}`
      }
      // this.$data.year = `${yr}-${n.substr(2)}` 
    },
    generateWeek () {
      let ima = moment()
      let week = {}
      // this.$data.columns = []
      for (let n = 0; n < 7; n++) {
        week[ima.day(n).format('ddd')] = ima.format('DD-MMM') // {date: ima.format()} // would ima.day(n).format() be better?
        /*
        this.$data.columns.push({
          name: ima.format('ddd'),
          required: false,
          label: ima.format('ddd'),
          align: 'center',
          field: ima.format('ddd')
        })
        this.visibleColumns.push(ima.format('ddd'))
        */
      }
      console.log(week)
      this.$data.month.push(week)
    },
    loadMonths() {
      let m = []
      for(let n = 0; n < 12; n++) {
        m.push(moment().month(n).format('MMM'))
      }
      this.$data.months = m
    }
  },
  mounted () {
    this.generateWeek()
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
</style>