
<template>
  <q-page>
      <div>
	<br>
        <q-card v-for="vendor in myArray" inline style="width: 350px">
          <q-card-title>
	    {{ vendor.vendor }}
          </q-card-title>
          <q-card-main>
            <q-list no-border highlight>
              <div>
                <q-item separator v-for="item in vendor.list" :key="item.id">
                  <q-item-main :label="item.item" label-lines="1" />
		  <q-btn label="A" @click="buttonA(element)" />
                </q-item>
              </div>
            </q-list>
          </q-card-main>
        </q-card>
      </div>
  </q-page>
</template>

<script>
import moment from 'moment'
import api from 'src/api'
import _ from 'lodash'
import draggable from 'vuedraggable'
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
  QCardSeparator,
  QList,
  QItem,
  QItemMain,
  QItemSeparator
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
    draggable,
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QList,
    QItem,
    QItemMain,
    QItemSeparator
  },
  props: ['user'],
  data () {
    return {
      message: '',
      myArray: [
        {
	  vendor: 'FTC',
	  list: [
	    {
	      id: 'r3kljjklds0',
	      item: 'Granola',
	      taxable: 'no',
	      vendors: [
		{
		  price: 17.1,
		  unit: '28-oz',
		  updated: '2019-08-13T19:20:04.228Z',
		  vendor: 'FTC',
		  description: 'CoolM'
		},
		{
		  price: 15,
		  unit: '978-g',
		  updated: '2019-08-13T19:20:04.228Z',
		  vendor: 'FTC',
		  description: 'QuakerOats'
		},
		{
		  price: 11.79,
		  unit: '978-g',
		  updated: '2019-08-13T19:20:04.228Z',
		  vendor: 'Food&Bev',
		  description: 'QuakerOats'
		}
	      ]
	    },
	    {
	      id: 'fjkdsj4453jk',
	      item: 'OliveOil',
	      taxable: 'no',
	      vendors: [
		{
		  price: 58.15,
		  unit: '1-gal',
		  updated: '2019-08-13T19:20:04.228Z',
		  vendor: 'FTC',
		  description: 'Vigo'
		},
		{
		  price: 43.11,
		  unit: '3-L',
		  updated: '2019-08-13T19:20:04.228Z',
		  vendor: 'Food&Bev',
		  description: 'Italian'
		},
		{
		  price: 53.95,
		  unit: '1-gal',
		  updated: '2019-08-13T19:20:04.228Z',
		  vendor: 'NewFlags',
		  description: 'Vigo'
		}
	      ]
	    }
	  ]
        }
      ],
      myArray2: [
        { id: 0, name: 'Hiro'},
        { id: 1, name: 'Doris'}
      ],
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
    buttonA (el) {
      console.log('el', el)
    },
    log (el) {
      console.log('change1', el)
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
    this.$q.loading.hide()
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
