
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
        <q-tr slot="top-row" slot-scope="props" align="center">
            <q-td class="bg-green-1">{{ total.receivable || '-' }}</q-td>
            <q-td class="bg-green-1">{{ total.prepaid || '-' }}</q-td>
            <q-td class="bg-green-1">{{ total.inventory || '-' }}</q-td>
            <q-td class="bg-green-1">{{ total.cash || '-' }}</q-td>
            <q-td class="bg-green-1">{{ total.equipment || '-' }}</q-td>
            <q-td class="bg-green-1">{{ total.assets || '-' }}</q-td>
            <q-td class="bg-deep-purple-1">{{ total.liabilities || '-' }}</q-td>
            <q-td class="bg-purple-1">{{ total.payable || '-' }}</q-td>
            <q-td class="bg-purple-1">{{ total.expense || '-' }}</q-td>
            <q-td class="bg-deep-purple-1">{{ total.sales || '-' }}</q-td>
            <q-td class="bg-deep-purple-1">{{ total.capital || '-' }}</q-td>
            <q-td class="bg-deep-purple-1">{{ total.netEquity || '-' }}</q-td>
        </q-tr>
      </q-table>
    </div>
    <q-btn label="newExpense" @click="overlay" />
    <br>
    <!-- //////// START OF MODAL' ////////-->
    <q-modal v-model="expenseModal" :maximized="boolScreen" :no-backdrop-dismiss="true" >
    <q-modal-layout > <!-- class="q-pa-sm" -->
      <q-toolbar slot="header">
        <q-btn
          flat
          icon="keyboard_backspace"
          @click="overlay"
        />
        <q-btn
          flat
          icon="fullscreen"
          @click="toggleFullscreen"
        />
        <q-toolbar-title>
          Enter/Edit Expense
        </q-toolbar-title>
      </q-toolbar>
      <div slot="footer">
        <div class="q-pa-xs float-right">
          &nbsp;&nbsp;<q-btn size="md" color="primary" label="Cancel" @click="overlay"/>
          &nbsp;&nbsp;<q-btn size="md" color="primary" label="Submit" @click="submitExpense"/> <!-- :disable not reading var -->
        </div>
      </div>
    <div class="q-pa-sm">
    <div class="row no-wrap" >
      <q-datetime class="col" minimal color="orange" v-model="transaction.date1" type="date" float-label="Date" :first-day-of-week="0" />&nbsp;&nbsp;
      <q-input class="col" ref="inputVendor" v-model="transaction.vendor" float-label="Vendor" ></q-input>&nbsp;&nbsp;
      <q-input class="col" ref="inputtransNum" v-model="transaction.transNum" float-label="Transaction Number"/>&nbsp;&nbsp;
      <q-input class="col" v-model="transaction.paymentAccount" float-label="Payment Account" ></q-input>
    </div>
    <div>
      <br>
      <q-table
        :data="transaction.transItems"
        :columns="modalColumns"
        :visible-columns="visibleModalColumns"
        row-key="item"
        :pagination.sync="pagination"
        hide-bottom 
        ref="scrollElement" >
        <tr slot="header" slot-scope="props">
          <q-th key="qty" :props="props" class="bg-deep-purple-1">Qty</q-th>
          <q-th key="item" :props="props" class="bg-deep-purple-1">Item</q-th>
          <q-th key="unit" :props="props" class="bg-deep-purple-1">Unit</q-th>
          <q-th key="price" :props="props" class="bg-deep-purple-1">Price</q-th>
          <q-th key="cost" :props="props" class="bg-deep-purple-1">Cost</q-th>
          <q-th key="gst" :props="props" class="bg-deep-purple-1">GST</q-th>
          <q-th key="total" :props="props" class="bg-deep-purple-2">Total</q-th>
          <q-th key="expAccount" :props="props">expAccount</q-th>
          <q-th key="category" :props="props">Category</q-th>
          <q-th key="taxable" :props="props" >Taxable</q-th> <!-- width='25px'><q-btn size="sm" round dense color="secondary" icon="code" class="q-mr-xs" @click="expandCols" /></q-th> -->
           <q-th key="expand" :props="props">Pricelist/Inv</q-th>
        </tr>
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td key="qty" :props="props" class="bg-deep-purple-1">
            {{ props.row.qty || '-' }}
            <q-popup-edit v-model="props.row.qty" title="update" @save="editItemValues(props.row)" :persistent="true" buttons>
              <q-input v-model="props.row.qty" type="number" />
            </q-popup-edit>
          </q-td>
          <q-td key="item" :props="props" class="bg-deep-purple-1">
            {{ props.row.item || '-' }}
            <q-popup-edit v-model="props.row.item" title="Update" :persistent="true" buttons>
              <q-input v-model="props.row.item" > </q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="unit" :props="props" class="bg-deep-purple-1" >
            {{ props.row.unit || '-' }}
            <q-popup-edit v-model="props.row.unit" title="Update" :persistent="true" buttons>
              <q-input v-model="props.row.unit" />
            </q-popup-edit>
          </q-td>
          <q-td key="price" :props="props" class="bg-deep-purple-1" >{{ props.row.price || '-' }}</q-td>
          <q-td key="cost" :props="props" class="bg-deep-purple-1" >
            {{ props.row.cost || '-' }}
            <q-popup-edit v-model="props.row.cost"  title="Update" @save="editCost(props.row)" :persistent="true" buttons>
              <q-input v-model="props.row.cost" type="number" />
            </q-popup-edit>
          </q-td>
          <q-td key="gst" :props="props" class="bg-deep-purple-1" >{{ props.row.gst || '-' }}</q-td>
          <q-td key="total" :props="props" class="bg-deep-purple-2" >
            {{ props.row.total || '-' }}
            <q-popup-edit v-model="props.row.total" title="update" @save="editItemValues(props.row)" :persistent="true" buttons>
              <q-input v-model="props.row.total" type="number" />
            </q-popup-edit>
          </q-td>
          <q-td key="expAccount" :props="props">
            {{ props.row.expAccount || '-' }}
            <q-popup-edit v-model="props.row.expAccount" title="Update" :persistent="true" buttons>
              <q-input v-model="props.row.expAccount" > </q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="category" :props="props">
            {{ props.row.category || '-' }}
            <q-popup-edit v-model="props.row.category" title="Update" :persistent="true" buttons>
              <q-input v-model="props.row.category" > </q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="taxable" :props="props">
            {{ props.row.taxable || '-' }}
            <q-popup-edit v-model="props.row.taxable" title="Update" @save="editItemValues(props.row)" buttons>
              <q-checkbox v-model="props.row.taxable" label="Taxable" true-value="yes" false-value="no" />
            </q-popup-edit>
          </q-td>
          <q-td key="expand" :props="props">
            <div class="row items-center justify-between no-wrap">
              <q-checkbox v-model="props.row.add2Pricelist" checked-icon="attach_money" unchecked-icon="money_off" />
              <q-checkbox v-model="props.row.add2Inventory" checked-icon="assignment" unchecked-icon="no_sim" class="q-mr-sm" />
              <q-btn size="sm" round dense color="secondary" icon="delete" @click="deleteItemRow(props.row)" class="q-mx-xs" />
            </div>
          </q-td>
        </q-tr>
        <!--
          <q-td key="stock" :props="props">
            <div class="row items-center justify-between no-wrap">
              <div v-for="unit in props.row.stock" :key="unit.unit">{{ unit.unit }}:<br>&nbsp;&nbsp;<strong><font size="4">{{ unit.qty }}</font></strong>
                <q-popup-edit v-model="unit.qty" title="Update count" @save="updateCount(props.row)" buttons>
                  <q-input type="number" v-model="unit.qty" />
                </q-popup-edit>
              </div>
              <div>
                <q-checkbox v-model="confirmations[props.row.__index].confirmed" checked-icon="check_circle" unchecked-icon="remove_circle_outline" class="q-mr-md" />
                <q-btn size="sm" round dense color="secondary" icon="playlist_add" class="q-mr-xs" @click="addStockUnit(props.row)" />
                <q-btn size="sm" round dense color="secondary" icon="shopping_cart" class="q-mr-xs" />
              </div>
            </div>
          </q-td>
        </q-tr>
        -->
        <q-tr slot="bottom-row" slot-scope="props" align="left">
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td class="bg-deep-purple-2">{{ subTotal || '-' }}</q-td>
            <q-td class="bg-deep-purple-2">{{ gstTotal || '-' }}</q-td>
            <q-td class="bg-deep-purple-3">{{ grandTotal || '-' }}</q-td>
            <q-td></q-td>
            <q-td></q-td>
        </q-tr>
      </q-table>
      <br>
    </div>
    <br>
    <div class="row no-wrap">
      <q-input class="col" ref="newEntry" float-label="Qty" type="number" v-model="newItem.qty" />&nbsp;&nbsp;
      <q-input class="col" float-label="Item" v-model="newItem.item"> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Unit" v-model="newItem.unit" > </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Cost" type="number" v-model="newItem.amount" @keyup.enter="addItem" />
      <div class="q-pt-md">
        <q-checkbox v-model="newItem.taxable" label="Taxable" true-value="yes" false-value="no" />
        <br>
        <q-checkbox v-model="gstIncluded" label="GST Included" true-value="yes" false-value="no" :disable="gstIncludedVisibility" />
      </div>
    </div>
    <div class="row no-wrap">
      <q-input class="col" float-label="exp Account" v-model="newItem.expAccount" @keyup.enter="addItem" > </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Category" v-model="newItem.category" @keyup.enter="addItem"> </q-input>&nbsp;&nbsp;
      <div class="q-pt-md">
        <q-checkbox v-model="newItem.add2Inventory" label="add2Inventory" tabindex=-1 /><br>
        <q-checkbox v-model="newItem.add2Pricelist" label="add2Pricelist" tabindex=-1 /><br>
      </div>
    </div>
    <br>
    <div class="row no-wrap">
      <div class="q-pl-md">
        &nbsp;&nbsp;<q-btn size="md" color="primary" label="add Item" @click="addItem" />
      </div>
      <div class="q-pl-md">
        <q-checkbox v-model="lockAccount" label="Lock Account" /><br>
        <q-checkbox v-model="lockCategory" label="Lock Category" /><br>
      </div>
    </div>
    </div>
  </q-modal-layout>
  </q-modal>
  <!-- //////  END OF MODAL  //////// -->
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
  QTableColumns,
  QCard,
  QCardTitle,
  QCardMain,
  QCardMedia,
  QCardSeparator,
  QCardActions,
  QDatetime,
  QPopover,
  QModal,
    QModalLayout,
    QOptionGroup,
    QField,
    scroll
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
    QTableColumns,
    QCard,
    QCardTitle,
    QCardMain,
    QCardMedia,
    QCardSeparator,
    QCardActions,
    QDatetime,
    QPopover,
    QModal,
    QModalLayout,
    QOptionGroup,
    QField,
    scroll
  },
  props: ['user'],
  data () {
    return {
      expenseModal: false,
      lockAccount: true,
      lockCategory: true,
      boolScreen: false,
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
      journal: [],
      transaction:
      {
        date1: '',
        vendor: '',
        transNum: '',
        paymentAccount: '',
        transItems: []
      },
      modalColumns: [
        {
          name: 'id',
          required: false,
          label: 'Id',
          align: 'left',
          field: 'id'
        },
        {
          name: 'qty',
          required: true,
          label: 'Qty',
          align: 'left',
          field: 'qty',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'item',
          required: true,
          label: 'Item',
          align: 'left',
          field: 'item',
          sortable: true,
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'unit',
          required: true,
          label: 'Unit',
          align: 'left',
          field: 'unit',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'price',
          required: false,
          label: 'Price',
          align: 'left',
          field: 'price',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'cost',
          required: false,
          label: 'Cost',
          align: 'left',
          field: 'cost',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'gst',
          required: false,
          label: 'GST',
          align: 'left',
          field: 'gst',
          classes: 'bg-deep-purple-1'
        },
        {
          name: 'total',
          required: false,
          label: 'Total',
          align: 'left',
          field: 'total',
          classes: 'bg-deep-purple-2'
        },
        {
          name: 'expAccount',
          required: false,
          label: 'expAccount',
          align: 'center',
          field: 'expAccount'
        },
        {
          name: 'category',
          required: false,
          label: 'Category',
          align: 'center',
          field: 'category'
        },
        {
          name: 'taxable',
          required: false,
          label: 'Taxable',
          align: 'center',
          field: 'taxable'
        },
        {
          name: 'expand',
          required: false,
          label: 'Expand',
          align: 'center',
          field: 'expand',
          style: 'width: 500px'
        }
      ],
      visibleModalColumns: ['qty', 'item', 'unit', 'price', 'cost', 'gst', 'total', 'expAccount', 'category', 'taxable', 'expand'],
      pagination: {
        sortBy: name, // String, column 'item' property value
        descending: true,
        page: 1,
        rowsPerPage: 0 // current rows per page being displayed,
      },
      transactions: [
        {
          "credit": [
            {
              "account": "payable",
              "amount": 779.79
            }
          ],
          "debit": [
            {
              "account": "expense/cogs/cheese/mozzarela",
              "amount": 288.21
            },
            {
              "account": "expense/cogs/cheese/feta",
              "amount": 248
            },
            {
              "account": "expense/cogs/cheese/yellowCheddar",
              "amount": 83.27
            },
            {
              "account": "expense/cogs/cheese/yellowCheddar",
              "amount": 73.67
            },
            {
              "account": "prepaid/gst",
              "amount": 86.64
            }
          ],
          "signed": "Thomas",
          "timestamp": 1551025593135,
          "chainlinks": [
            {
              "chain": "pricelist",
              "link": "?hash/?id"
            },
            {
              "chain": "inventroy", // inventory chain may not be needed. included on main 
              "link": "?hash/?id"
            },
            {
              "chain": "payable", // payable chain may not be needed. 
              "link": "?hash/?id"
            }
          ],
          "account?": "rcImports",
          "TransactionDate": 1551025593135,
          "TransactionID": "261932"
        }
      ],
      journalColumns: [],
      gstIncluded: 'yes',
      visibleJournalColumns: [],
      journalColumnList: [],
      newItem: {
        qty: '',
        item: '',
        unit: '',
        amount: '',
        expAccount: '',
        category: '',
        taxable: 'yes',
        add2Inventory: false,
        add2Pricelist: true
      },
      vendorsList: [
      ],
      paymentTypes: [
        {
          value: 'cashMS',
          label: 'cashMS'
        },
        {
          value: 'cashHR',
          label: 'cashHR'
        },
        {
          value: 'ccardScotia',
          label: 'ccardScotia'
        },
        {
          value: 'checkAtl#',
          label: 'checkAtl#'
        },
        {
          value: 'cashAtl',
          label: 'cashAtl'
        },
        {
          value: 'payableAcct',
          label: 'payableAcct'
        }
      ],
      total: {}
    }
  },
  computed: {
    computedUnitsList () {
      if (this.$data.unitsList[this.$data.newItem.item]) {
        return this.$data.unitsList[this.$data.newItem.item]
      } else {
        return []
      }
  },
    subTotal () {
      let t = 0
      this.$data.transaction.transItems.forEach(item => {
        console.log('t', t, item.cost)
        t += item.cost
      })
      return _.round(t,2)
    },
    gstTotal () {
      let g = 0
      this.$data.transaction.transItems.forEach(item => {
        console.log('g', g, item.gst)
        g += item.gst
      })
      return _.round(g,2)
    },
    grandTotal () {
      let gt = 0
      this.$data.transaction.transItems.forEach(item => {
        gt += item.total
      })
      return _.round(gt,2)
    },
    expSubTotal () {
      let t = 0
      this.$data.expenses.forEach(exp => {
        console.log('t', t, exp.subTotal)
        t += exp.subTotal
      })
      return _.round(t,2)
    },
    expGstTotal () {
      let g = 0
      this.$data.expenses.forEach(exp => {
        console.log('g', g, exp.gstTotal)
        g += exp.gstTotal
      })
      return _.round(g,2)
    },
    expGrandTotal () {
      let gt = 0
      this.$data.expenses.forEach(exp => {
        gt += exp.grandTotal
      })
      return _.round(gt,2)
    },
    gstIncludedVisibility () {
      if (this.$data.newItem.taxable === 'yes') {
        return false
      } else {
        this.$data.gstIncluded = 'no'
        return true
      }
    }
  },
  methods: {
    addItem () {
      console.log('start',this.$data.newItem.taxable)
      let line = JSON.parse(JSON.stringify(this.$data.newItem))
      // check if unit is correct format
      if (!line.unit.includes('-')) {
        this.$q.notify({
          message: 'Unit missing dash -',
          timeout: 3000,
          position: 'center'
        })
      } else {
        // make sure account is entered
        if (line.expAccount !== '') {
          if (this.$data.newItem.taxable === 'yes') {
            if (this.$data.gstIncluded === 'yes') {
              line.gst = _.round((line.amount / 9), 2)
              line.cost = _.round((line.amount / 1.125), 2)
            } else {
              line.gst = _.round((line.amount * 0.125), 2)
              line.cost = line.amount
            }
          } else {
            line.gst = 0
            line.cost = line.amount
          }
          line.price = _.round((line.cost / line.qty), 2)
          line.total = _.round((line.gst + line.cost), 2)
          delete line['amount']
          this.$data.transaction.transItems.push(line)
          console.log('line Item', line)
          // clear fields for new item
          let tempItem = {
            qty: '',
            item: '',
            unit: '',
            amount: '',
            taxable: this.$data.newItem.taxable,
            add2Inventory: this.$data.newItem.add2Inventory,
            add2Pricelist: this.$data.newItem.add2Pricelist
          }
          if (this.$data.lockAccount) {
            tempItem.expAccount = this.$data.newItem.expAccount
          } else {
            tempItem.expAccount = ''
          }
          if (this.$data.lockCategory) {
            tempItem.category = this.$data.newItem.category
          } else {
            tempItem.category = ''
          }
          this.$data.newItem = tempItem
        } else {
          console.log('expAccount needs value')
          this.$q.notify({
            message: 'expAccount needs value',
            timeout: 3000,
            position: 'center'
          })
        }
        this.$refs.newEntry.focus()
        console.log('end',this.$data.newItem.taxable)
      }
      // this.modalScroll()
    },
    overlay () {
      console.log('overlaycalled',this.$data.newItem.add2Inventory, this.$data.transaction.add2Pricelist)
      this.$data.newItem = {
        qty: '',
        item: '',
        unit: '',
        amount: '',
        expAccount: '',
        category: '',
        taxable: 'yes',
        add2Inventory: false,
        add2Pricelist: true
      }
      this.$data.expenseModal = !this.$data.expenseModal
      this.$refs.inputVendor.focus()
      console.log('scrolltop')
    },
    toggleFullscreen () {
      this.$data.boolScreen = !this.$data.boolScreen
      console.log('fullscreen', this.$data.boolScreen)
    },
    submitExpense () {
      // check for valid check # (by length)
      if (this.$data.transaction.paymentAccount.includes('checkAtl#') && this.$data.transaction.paymentAccount.length < 13) {
        console.log('bad check')
        this.$q.notify({
          message: 'please verify check number',
          timeout: 3000,
          position: 'center'
        })
        return false
      }
      // check that line may not have been added
      console.log('test', this.$data.newItem.qty && this.$data.newItem.item && this.$data.newItem.unit && this.$data.newItem.amount)
      console.log(this.$data.newItem.qty, this.$data.newItem.item, this.$data.newItem.unit, this.$data.newItem.amount)
      if (this.$data.newItem.qty && this.$data.newItem.item && this.$data.newItem.unit && this.$data.newItem.amount) {
        this.$q.notify({
          message: 'new Item data not added to list',
          timeout: 3000,
          position: 'center'
        })
      } else {
        // save computed values to transaction.object
        /*****************
        this.$data.transaction.subTotal = this.subTotal
        this.$data.transaction.gstTotal = this.gstTotal
        this.$data.transaction.grandTotal = this.grandTotal
        
        // check if this is an exsisting transaction 
        let tmpId = this.$data.transaction.id
        ****************/

        // dateinput records date as UTC, if entered after 18:00 the date is recorded for the next day (+6hrs)
        // if the hour is <6, date needs to go back one day
        let dInfo = new Date(this.$data.transaction.date1)
        console.log('dInfo', typeof dInfo, dInfo)
        dInfo = dInfo.toISOString()
        console.log(dInfo)
        let hour = dInfo.substr(11,2)
        hour = Number(hour)
        if (hour < 6) {
          let d = dInfo.substr(0,10)
          let day = d.substr(-2)
          day = Number(day -1)
          if (day < 10) {
            day = `0${day}`
          }
          let t = dInfo.substr(13)
          let d2 = `${d.substr(0,8)}${day}T10${t}`
          this.$data.transaction.date1 = d2
        }
        /*****************
        if (tmpId) {
          // if transaction is modified, changes need to be recorded
          // if account changed, original acct needs to be reversed
          console.log('existing transaction', tmpId)
          // sdelete this.$data.transaction['id']
          api.service('expenses').update(tmpId, this.$data.transaction).then((response) => {
            console.log('sumbitted expense', response.id)
            delete response['id']
            api.service('audit').create(response) // no indication that this was an update?
            // what payable account asset - liability
            // whether it is asset or liability, will still be a creditEntry
            journalObject.credit.push({
              account: this.$data.transaction.paymentAccount,
              amount: this.$data.transaction.grandTotal
            })
            let gstMonth = moment(this.$data.transaction.date1).format('MMM')  
            if (this.$data.transaction.gstTotal) {
              journalObject.debit.push({
                account: 'preGst'+ gstMonth,
                amount: this.$data.transaction.gstTotal
              })
            }
            this.$data.transaction.transItems.forEach((item) => {
              journal.Object.debit.push({
                account: item.expAccount,
                amount: item.trans
              })
            })
          })
          // need to handle any edits to inv changes
          // probably need og copy to track changes
          // lookup inv record based on an id?
        } else {
          *****************/
        console.log('new transaction')

        // convert to new credit/debit form
        let transData = this.$data.transaction
        let newTransaction = {
          timestamp: Date.now(), // new
          transactionDate: transData.date1,
          transactionNum: transData.transNum,
          name: transData.vendor, // key change
          details: transData.transItems //key change
        }
        let credit = []
        let debit = []
        let chainLinks = []
        let prepaidGst = 0
        transData.transItems.forEach(item => {
          debit.push({ 
            account: `expense/${item.expAccount}/${item.category}/${item.item}`,
            amount: item.cost
          })
          prepaidGst =+ item.gst
        })
        debit.push({
          account: `prepaid/gst`,
          amount: prepaidGst
        })
        // determine whether to credit/debit payment account ['payable', 'ccardScotia', checkAtl#', 'cashAtl', 'cashMS', 'cashHR']
        if (['payable', 'ccardScotia'].includes(transData.paymentAccount)) {

        }
        // need to handle different payment account types
        let creditAccount = ''
        if (transData.paymentAccount.includes('cash')) {
          creditAccount = 'cash/' + transData.paymentAccount.substr(4)
        }
        if (transData.paymentAccount.includes('check')) {
          creditAccount = 'checks/' + transData.paymentAccount.substr(5)
        }
        if (transData.paymentAccount.includes('ccard')) {
          creditAccount = 'ccard/' + transData.paymentAccount.substr(5)
        }
        if (transData.paymentAccount.includes('payable')) {
          creditAccount = 'payable/' + transData.vendor
        }
        credit.push({
          account: creditAccount,
          amount: this.grandTotal
        })
        newTransaction['credit'] = credit
        newTransaction['debit'] = debit

        this.$axios.post('http://localhost:3001/transaction/broadcast', newTransaction)
        .then(resp => {
          console.log('posted transaction', resp)
          this.getBlockchain()
        })
        // this.$data.transactions.push(newTransaction)
        // this.parseTransactions (this.$data.transactions)

      } // end of else (data in add item fields check)
      // moved updatePrices and Inventory to 'newTransaction' to use transaction.id
      // |-> no longer executed if loading existing transaction
      // close overlay
      this.overlay()
      // reload expenses list from rethinkdb
      // this.loadExpenses(this.$data.startDate, this.$data.endDate)
      this.$data.startDate = this.$data.transaction.date1
      // this.loadExpenses()
    },
    parseTransactions (transactions) {
      // this.$data.journal = [] // clear journal moved to getblockchain method
      // cycle through each transaction
      transactions.forEach(trans => {
        //create object for datatable row
        const tableRow = {}
        // cycle through debits
        console.log(trans)
        trans.debit.forEach(d => {
          // split account details eg 'expense/cogs/cheese/feta'
          console.log('debit', d.account)
          let accountArray = d.account.split('/')
          const acct = accountArray[0]
          if (!tableRow.hasOwnProperty(acct)) {
            tableRow[acct] = 0
          }
          if (['equipment', 'receivable', 'prepaid', 'inventory', 'cash'].includes(acct)) {
            // debit increases account
            tableRow[acct] += d.amount
          } else if (['payable', 'sales', 'capital', 'expense'].includes(acct)) {
            tableRow[acct] -= d.amount
          }
        })
        // cycle through credits
        trans.credit.forEach(c => {
          console.log('credit', c.account)
          const accountArray = c.account.split('/')
          const acct = accountArray[0]
          if (!tableRow.hasOwnProperty(acct)) {
            tableRow[acct] = 0
          }
          if (['equipment', 'receivable', 'prepaid', 'inventory', 'cash'].includes(acct)) {
            // debit increases account
            tableRow[acct] -= c.amount
          } else if (['payable', 'sales', 'capital', 'expense'].includes(acct)) {
            tableRow[acct] += c.amount
          }
        })
        this.$data.journal.push(tableRow)
      })
      this.$data.total = { assets: 0, liabilities: 0 }
      console.log('journal', this.$data.journal)
      this.$data.journal.forEach(entry => {
        console.log('entry', entry)
        for (let property in entry) {
          console.log('property', property)
          if (entry.hasOwnProperty(property)) {
            if (this.$data.total.hasOwnProperty(property)) {
              console.log('true', entry.property)
              this.$data.total[property] += entry[property]
            } else {
              console.log('false', entry, property, entry.property)
              this.$data.total[property] = entry[property]
            }
            if(['receivable', 'prepaid', 'inventory', 'cash', 'equipment'].includes(property)) {
                console.log('includes', property, this.$data.total.assets)
                this.$data.total.assets += entry[property]
                this.$data.total.assets = _.round(this.$data.total.assets, 2)
              } else {
                console.log('Notincludes', property, this.$data.total.liabilities)
                this.$data.total.liabilities += entry[property]
                this.$data.total.liabilities = _.round(this.$data.total.liabilities, 2)
              }
          }
        }
      })
      console.log('total', this.$data.total)
    },
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
      // console.log('journal', this.$data.journal)
      console.log('week', week)
      this.$data.month.push(week)
    },
    generateJournalCols () {
      console.log('journal', this.$data.journal)
      let acctEqu = ['assets', 'liabilities', 'equity']
      let equity = ['expense', 'sales', 'capital']
      let liabilities = ['payable']
      let assets = ['receivable', 'prepaid', 'inventory', 'cash', 'equipment']
      let equation = assets.concat('=>', '<=', liabilities, equity, 'netEquity')
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
        if (['payable', 'expense'].includes(col)) {
          color = 'bg-purple-2'
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
    },
    async getBlockchain () {
      let blockchain = await this.$axios.get('http://localhost:3001/blockchain')
      console.log('blockchain', blockchain.data)
      this.$data.journal = []
      blockchain.data.chain.forEach(block => {
        this.parseTransactions(block.transactions)
      })
    }
  },
  mounted () {
    this.generateWeek()
    this.generateJournalCols()
    this.loadMonths()
    this.$q.loading.hide()
    this.getBlockchain()
    // this.parseTransactions(this.$data.transactions)
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