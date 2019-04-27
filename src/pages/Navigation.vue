
<template>
  <q-page>
      <div class="row no-wrap">
        <q-btn color="primary" :label="year" >
          <q-popover>
            <q-list link>
              <q-item v-for="n in years" :key="n" v-close-overlay @click.native="selectYear(n)">
                <q-item-main>
                  <q-item-tile label>{{ n }}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <div>
          <q-btn size="sm" icon="remove" >
            <q-popover>
              <q-list link>
                <q-item v-for="n in years" :key="n" v-close-overlay @click.native="selectYearSpan(n)">
                  <q-item-main>
                    <q-item-tile label>{{ n }}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-popover>
          </q-btn>
          <br>
          <q-btn size="sm" icon="expand_more" />
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
    }
  },
  mounted () {
    this.generateWeek()
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