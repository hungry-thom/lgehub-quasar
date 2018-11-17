
<template>
  <q-page>
      <div>
        <br>
        <q-table
          :data="priceList"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          row-key="id"
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
      priceList: [
        {
          id:  "adaaa2a3-2634-45ec-befd-f38c7e22e13f" ,
          item:  "Balsamic" ,
          taxable:  "yes" ,
          unit: '1-gal',
          vendor: 'Helen',
          cost: 43 ,
          updated:  "2018-08-16T19:51:25.991Z"
        },
        {
          id:  "0301daa0-d637-440c-83de-8588dfdddc4b" ,
          item:  "Balsamic" ,
          taxable:  "yes" ,
          unit: '1-gal',
          vendor: 'Food&Bev',
          cost: 35,
          updated:  "2018-06-23T19:27:21.789Z"
        },
        {
          id:  "09dbd628-881f-498d-a1f4-4f66802ab6fb" ,
          item:  "Balsamic" ,
          taxable:  "yes" ,
          unit: '3-L',
          vendor: 'Madisco',
          cost: 45,
          updated:  "2018-12-23T19:27:21.789Z"
        },
        {
          id:  "17d662ce-18b5-4600-bcae-bce750f16f62" ,
          item:  "Caper" ,
          taxable:  "yes" ,
          unit: '32-oz',
          vendor: 'Food&Bev',
          cost: 30,
          updated:  "2018-15-23T19:27:21.789Z"
        }
      ],
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
          name: 'vendor',
          label: 'Vendor',
          align: 'left',
          field: 'vendor'
        },
        {
          name: 'unit',
          label: 'Unit',
          align: 'left',
          field: 'unit'
        },
        {
          name: 'cost',
          label: 'Cost',
          align: 'left',
          field: 'cost'
        },
        {
          name: 'taxable',
          label: 'Taxable',
          align: 'left',
          field: 'taxable'
        },
        {
          name: 'updated',
          label: 'Updated',
          align: 'left',
          field: 'updated'
        }
      ],
      visibleColumns: ['item', 'vendor', 'unit', 'cost']
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
    /*
    pricelist.find()
      .then((response) => {
        // We want the latest inventory but in the reversed order
        this.$data.priceList = response.data.reverse()
      })
    */
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