
<template>
  <q-page>
    <div>
      Expense
      <q-datetime inverted color="light-blue" saturday-first v-model="receipt.date" stack-label="chooseDate" />
      <br>
      <div class="row no-wrap">
        <q-input class= "col" ref="inputVendor" v-model="receipt.vendor" float-label="Vendor"  @blur="validateVendor"> <q-autocomplete :static-data="{field: 'value', list: vendors}" /></q-input>&nbsp;&nbsp;
        <q-input class= "col" ref="inputrecNum" v-model="receipt.recNum" float-label="Receipt Number"/>&nbsp;&nbsp;
        <q-input class= "col" v-model="receipt.payment" float-label="Payment" > <q-autocomplete :static-data="{field: 'value', list: paymentTypes}" /></q-input>
      </div>
      <br>
      <q-table
        :data="receipt.items"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="id" >
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td key="qty" :props="props">{{ props.row.qty }}</q-td>
          <!--<q-tooltip>I'd like to eat "{{ props.row.name }}"</q-tooltip>-->
          <q-td key="item" :props="props">{{ props.row.item }}</q-td>
          <q-td key="unit" :props="props">{{ props.row.unit }}</q-td>
          <q-td key="cost" :props="props">{{ props.row.cost }}</q-td>
          <q-td key="taxable" :props="props">{{ props.row.taxable }}</q-td>
          <q-td key="wGST" :props="props">
            <div class="row items-center justify-between no-wrap">
              <div>{{ props.row.wGST }}</div>
              <q-btn size="sm" round dense color="secondary" icon="delete" @click="deleteItemRow(props.row)" class="q-mr-xs" />
            </div>
          </q-td>
        </q-tr>
        <q-tr slot="bottom-row" slot-scope="props" align="right">
          <q-td colspan="100%">
            <div class="row no-wrap">
              <q-item class="col"> </q-item>
              <q-item class="col"> </q-item>
              <q-item class="col"> </q-item>
              <q-item class="col">subTotal: </q-item>&nbsp;&nbsp;
              <q-item class="col" align="right" float-right>{{ receipt.subTotal }}</q-item>
            </div>
            <div class="row no-wrap">
              <q-item class="col"> </q-item>
              <q-item class="col"> </q-item>
              <q-item class="col"> </q-item>
              <q-item class="col">G.S.T.: </q-item>&nbsp;&nbsp;
              <q-item class="col">{{ receipt.gst }}</q-item>
            </div>
            <div class="row no-wrap">
              <q-item class="col"> </q-item>
              <q-item class="col"> </q-item>
              <q-item class="col"> </q-item>
              <q-item class="col">Total: </q-item>&nbsp;&nbsp;
              <q-item class="col" float-right>{{ receipt.total }}</q-item>
            </div>
          </q-td>
        </q-tr>
      </q-table>
      <br>
    <br>
    <div class="row no-wrap">
      <q-input class="col" ref="newEntry" float-label="Qty" type="number" v-model="iQty" />&nbsp;&nbsp;
      <q-input class="col" float-label="Item" v-model="iItem" > <q-autocomplete :static-data="{field: 'value', list: itemsList}" /> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Unit" v-model="iUnit" @click="popupUnitList" > <q-autocomplete :static-data="{field: 'value', list: this.unitsList}" /> </q-input>&nbsp;&nbsp;
      <q-input class="col" float-label="Cost" type="number" v-model="iCost" @keyup.enter="addItem"/>
    </div>
    <br>
    <q-checkbox v-model="taxable" label="Taxable" true-value="yes" false-value="no"/>
    <br>
    <q-checkbox v-model="gstIncluded" label="GST Included" true-value="yes" false-value="no" />
    <br>
    <q-btn label="add Item" color="primary" @click="addItem"/>  <!-- <q-toggle class="q-pl-md" v-model="gstIncluded" label="G.S.T. Included" /> -->
    <br>
    <br>
    <q-btn label="Confirm Edit" color="primary" @click="confirmEdit" />    <q-btn label="Clear Items" color="primary" @click="clearItems" />
    <br>
  </q-page>
</template>