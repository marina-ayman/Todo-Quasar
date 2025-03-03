<template>
  <div class="q-pa-md">
    <q-table
      flat
      title="Your ToDo"
      :rows="rowsData"
      :columns="columns"
      color="primary"
      row-key="name"
      style="margin: 50px; border-radius: 20px; overflow: hidden"
      class="q-header"
      title-class="title text-weight-bold"
      table-header-class="q-header2 text-weight-bolder"
    >
      <template v-slot:top-right>
        <q-btn
          class="q-mx-sm custom-btn"
          glossy
          icon="archive"
          label="export"
          @click="exportTable"
        />
        <q-btn
          class="q-mx-sm custom-btn"
          glossy
          icon="library_add"
          label="add"
          @click="showDialog = true"
        />
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div style="width: 50px">
            <q-badge :color="getStatusColor(props.row.status)" text-color="white">
              {{ getStatusText(props.row.status) }}
            </q-badge>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-tags="props">
        <q-td :props="props">
          <div style="display: flex; flex-wrap: wrap; width: 250px">
            <q-chip
              v-for="(tag, index) in parseTags(props.row.tags)"
              :key="index"
              color="blue-3"
              text-color="black"
            >
              {{ tag }}
            </q-chip>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            class="q-ml-sm q-pa-sm"
            flat
            icon="edit"
            size="md"
            @click="editTodo(props.row)"
          />
          <q-btn
            color="red"
            icon="delete"
            size="md"
            flat
            class="q-ml-sm q-pa-sm"
            @click="deleteTodo(props.row.id)"
          />
          <q-btn
            color="cyan"
            outline
            size="md"
            flat
            icon="checklist"
            class="q-ml-sm q-pa-sm"
            @click="editStatus(props.row.id)"
          >
            <q-tooltip transition-show="rotate" transition-hide="rotate"> update Status </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>

  <add-todo
    :dialogVisible="showDialog"
    @closeDialog="showDialog = false"
    :getTodo="getTodo"
    :statusId="statusId"
  ></add-todo>

  <edit-todo
    :dialogVisible="showUpdateDialog"
    @closeDialog="showUpdateDialog = false"
    :getTodo="getTodo"
    :todoData="todoData"
  ></edit-todo>

  <edit-status
    :dialogVisible="showDialogStatus"
    @closeDialog="showDialogStatus = false"
    :getTodo="getTodo"
    :statusId="statusId"
  ></edit-status>
</template>

<script>
import { exportFile } from 'quasar'
import AddTodo from '../../../components/todo/AddTodo.vue'
import EditStatus from '../../../components/todo/updateStatus.vue'
import EditTodo from '../../../components/todo/editTodo.vue'
import handleError from 'src/services/errorhandler'

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted = formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

export default {
  data() {
    return {
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: (row) => row.id, sortable: true },
        { name: 'title', label: 'Title', align: 'left', field: (row) => row.title },
        { name: 'tags', label: 'Tags', align: 'left', field: (row) => row.tags },
        { name: 'status', label: 'Status', align: 'left', field: (row) => row.status },
        { name: 'userId', label: 'User ID', align: 'left', field: (row) => row.userId },
        {
          name: 'formattedFromDate',
          label: 'From Date',
          align: 'left',
          field: (row) => row.formattedFromDate,
        },
        {
          name: 'formattedToDate',
          label: 'To Date',
          align: 'left',
          field: (row) => row.formattedToDate,
        },
        { name: 'action', label: 'Action', align: 'center', field: (row) => row.id },
      ],

      rowsData: [],
      showDialog: false,
      showDialogStatus: false,
      showUpdateDialog: false,
      statusId: null,
      todoData: null,
    }
  },
  components: {
    AddTodo,
    EditStatus,
    EditTodo,
  },
  methods: {
    exportTable() {
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.rowsData.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format,
                  row,
                ),
              )
              .join(','),
          ),
        )
        .join('\r\n')

      const status = exportFile('table-export.csv', content, 'text/csv')

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning',
        })
      }
    },
    async getTodo() {
      try {
        const response = await this.$api.get('/web/todos')
        if (response.data.error) {
          console.log('Done', response.data.error)
          this.$q.notify({
            type: 'negative',
            message: response.data.message,
          })
          this.loadBtn = false
          return
        }
        console.log('Donetodo', response.data.todos)
        this.rowsData = response.data.todos
        console.log(response.data.todos)
      } catch (error) {
        handleError(error)
        throw error
      }
    },

    async editTodo(taskTodo) {
      this.todoData = taskTodo
      console.log('taskTodo', this.todoData)
      this.showUpdateDialog = true
    },
    async deleteTodo(id) {
      try {
        this.$q
          .dialog({
            title: 'Confirm',
            message: `Would you want To delete Your Task ?`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const response = await this.$api.delete(`/web/todo/${id}`)
            if (response.data.error) {
              console.log('Done', response.data.error)
              this.$q.notify({
                type: 'negative',
                message: response.data.message,
              })
              this.loadBtn = false
              return
            } else {
              this.$q.notify({
                type: 'positive',
                message: response.data.message,
              })
            }
            await this.getTodo()
            console.log('Delete', response)
          })
          .onCancel(() => {})
      } catch (error) {
        handleError(error)
        throw error
      }
    },

    getStatusText(status) {
      return status === 0
        ? 'TODO'
        : status === 1
          ? 'ON PROGRESS'
          : status === 2
            ? 'DONE'
            : 'UNKNOWN'
    },
    getStatusColor(status) {
      return status === 0 ? 'blue' : status === 1 ? 'orange' : status === 2 ? 'green' : 'grey'
    },
    editStatus(id) {
      this.statusId = id
      this.showDialogStatus = true
    },
    parseTags(tags) {
      return Array.isArray(tags) ? tags : JSON.parse(tags)
    },
  },
  async mounted() {
    await this.getTodo()
  },
}
</script>
