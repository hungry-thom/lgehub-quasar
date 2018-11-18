
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
      <!--
      <div class="row no-wrap">
        <div v-for="day in month[0]" :key="day.date1" >
          <q-card inline class="q-ma-sm" >
            <q-card-media overlay-position="top" @click="clickCard">
              <img src="assets/sad.svg">

              <q-card-title slot="overlay">
                <div slot="subtitle" class="text-right">{{ day.date1 }}</div>
              </q-card-title>
            </q-card-media>
          </q-card>
        </div>
      </div>
      -->
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
  QCardActions
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
    QCardActions
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
      console.log('month', this.$data.month)
      console.log('week', week)
      this.$data.month.push(week)
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
  /* 
  .q-card {
    width: 120px
  }
  */
</style>