<template>


  <q-table
    :grid="$q.screen.xs"
    class="my-sticky-header-table w-100"
    title="Задачи"
    :rows="rows"
    :columns="columns"
    row-key="name"
    flat
    bordered
    :loading="loading"

    @row-click="taskDialog"
    @card-click="taskDialog"

    :rows-per-page-options="[10]"
    v-model:pagination="pagination"
    @request="onRequest"
    binary-state-sort
  >
    <template v-slot:top class="q-gutter-xs fit inline wrap justify-around">
      <q-btn class="" size="md" @click="taskDialog" no-caps flat icon="add" color="primary" :disable="loading"
             label="Новая задача"/>
<!--      <div class="col-2 q-table__title">Задачи</div>-->
      <q-space/>
      <div class="q-gutter-xs col-grow col-shrink row inline ">
          <q-select
            class="col-grow"
            v-model="filters.myAndDate.value"
            :options="filters.myAndDate.options"
            label="Дата завершения"
            style="width: 250px"
            input-debounce="0"
            clearable
            @update:model-value="onRequest"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            class="col-grow"
            v-model="filters.subordinates.value"
            use-chips
            :options="filters.subordinates.options"
            label="Ответственный"
            style="width: 250px"
            use-input
            multiple
            input-debounce="0"
            @update:model-value="onRequest"
            @filter="onUserFilter"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
      </div>
    </template>

    <template v-slot:loading>
      <q-inner-loading showing color="primary"/>
    </template>

    <template v-if="!$q.screen.xs" v-slot:body-cell-title="props">
      <q-td :props="props">
        <div :class="props.row.color">
          {{ props.value }}
        </div>
        <div class="my-table-details">
          {{ props.row.name }}
        </div>
      </q-td>
    </template>

    <template v-slot:item="props">
      <div
        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
      >
        <q-card class="q-pa-md" @click="taskDialog(null, props.row)">
          <q-list dense>
            <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
              <q-item-section class="q-pa-xs">
                <q-item-label caption>{{ col.label }}</q-item-label>
                <q-item-label :class="col.name === 'title' ? props.row.color : ''">{{ col.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>
</template>

<script>
import {defineComponent} from 'vue'
import {api} from 'boot/axios'
import {date, Dialog} from "quasar";
import TaskDialog from "components/TaskDialog";

export default defineComponent({
  name: 'TodoListTable',
  props: {
  },
  data() {
    return {
      rows: [],
      columns: [
        {name: 'title', align: 'center', label: 'Заголовок', field: 'title'},
        {name: 'priority', align: 'center', label: 'Приоритет', field: 'priority'},
        {name: 'expiration_at', align: 'center', label: 'Дата окончания', field: 'expiration_at'},
        {name: 'responsible', align: 'center', label: 'Ответственный', field: row => row.responsible.data.fullname},
        {name: 'status', align: 'center', label: 'Статус', field: 'status'},
      ],
      statusDict: [],
      priorityDict: [],
      loading: true,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsNumber: 10
      },
      filters: {
        myAndDate: {
          value: null,
          options: []
        },
        subordinates: {
          value: [],
          search: '',
          options: []
        }
      },
    }
  },
  created() {
    let newDate = new Date()

    this.filters.myAndDate.options = [
      {
        label: 'На сегодня',
        value: {
          from: date.formatDate(date.startOfDate(newDate, 'day'), 'YYYY-MM-DD HH:mm:ss'),
          to: date.formatDate(date.endOfDate(newDate, 'day'), 'YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        label: 'На неделю',
        value: {
          from: date.formatDate(date.startOfDate(newDate, 'day'), 'YYYY-MM-DD HH:mm:ss'),
          to: date.formatDate(date.addToDate(date.startOfDate(newDate, 'day'), {days: 7}), 'YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        label: 'На будущее',
        value: {
          from: date.formatDate(date.addToDate(date.startOfDate(newDate, 'day'), {days: 7}), 'YYYY-MM-DD HH:mm:ss'),
          to: ''
        }
      },
    ]

    this.loadDicts().then(() => {
      this.loadList();
    });
  },
  methods: {
    taskDialog(evt, row) {
      console.log(row)
      Dialog.create({
        component: TaskDialog,

        // props forwarded to your custom component
        componentProps: {
          statusesOptions: this.statusDict,
          priorityOptions: this.priorityDict,
          id: row?.id
        }
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        this.onRequest();
        console.log('Called on OK or Cancel')
      })
    },
    getStatus(value) {
      return this.getOptionByValueAndDict(value, this.statusDict)
    },
    getPriority(value) {
      return this.getOptionByValueAndDict(value, this.priorityDict)
    },
    getOptionByValueAndDict(value, dict) {
      return dict.filter(item => {
        if (item.value === value) return item;
      })[0]
    },
    async loadDicts() {
      await api.get(`/statuses`).then(data => {
        this.statusDict = data.data.data
      })
      await api.get(`/priorities`).then(data => {
        this.priorityDict = data.data.data
      })
    },
    loadList(url = null) {
      this.loading = true;
      api.get(url ?? `/tasks?page=1&orderBy=updated_at&sortedBy=desc`).then(data => {
        this.pagination.rowsNumber = data.data.meta.pagination.total;
        this.pagination.rowsPerPage = data.data.meta.pagination.per_page;
        this.pagination.page = data.data.meta.pagination.current_page;

        this.rows = data.data.data.map(row => {

          let statusOption = this.getStatus(row.status);

          row.status = statusOption.label
          row.priority = this.getPriority(row.priority).label

          switch (statusOption.name) {
            case 'DONE':
              row.color = 'text-green';
              break
            default:
              row.color = row.isExpired && statusOption.name !== 'CANCELED' ? 'text-red' : 'text-grey';
              break
          }

          return row;
        });

        this.loading = false;
      })
    },
    onRequest(props) {

      let query = ''
      let responsibleIds = this.filters.subordinates.value.map(item => item.value) ?? null
      let exp = this.filters.myAndDate.value?.value ?? null

      const page = props?.pagination?.page ?? null

      const pg = page ?? null;

      if (exp !== null) query += `&dateField=expiration_at&dateFrom=${exp.from}&dateTo=${exp.to}`;
      if (responsibleIds !== null) query += `&search=responsible_user_id:${responsibleIds.join(',')}&searchFields=responsible_user_id:in`

      this.loadList(`/tasks?orderBy=updated_at&sortedBy=desc&page=${pg ?? this.pagination.page}&per_page=${this.pagination.rowsPerPage}` + query);
    },
    onUserFilter(props, update) {
      api.get(`/subordinates?search=surname:${props};name:${props};patronymic:${props}`).then(data => {
        this.filters.subordinates.options = data.data.data.map(item => {
          return {label: item.fullname, value: item.id}
        })

        update(() => {
        })
      })
    },
  }
})
</script>
<style>
.q-table__container {
  width: 80%;
  max-width: 1024px;
  min-height: 60vh;
}

.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>
