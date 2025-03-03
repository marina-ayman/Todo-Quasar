<template>
  <div class="q-pa-md">
    <h2 class="grey q-mx-xl">All Todos</h2>
    <q-input v-model="search" label="Search..." dense outlined class="q-mb-sm q-mx-xl">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-table
      flat
      title="Your ToDo"
      :rows="filterRows"
      :columns="columns"
      color="primary"
      row-key="id"
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
        <q-btn v-if="can('create_todo')"
          class="q-mx-sm custom-btn"
          glossy
          icon="library_add"
          label="add"
          @click="showDialog = true"
        />
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.row.status)" text-color="white">
            {{ getStatusText(props.row.status) }}
          </q-badge>
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
          <q-btn v-if="can('update_todo')"
            color="primary"
            class="q-ml-sm q-pa-sm"
            flat
            icon="edit"
            size="md"
            @click="editTodo(props.row)"
          ></q-btn>
          <q-btn v-if="can('delete_todo')"
            color="red"
            icon="delete"
            size="md"
            flat
            class="q-ml-sm q-pa-sm"
            @click="deleteTodo(props.row.id)"
          />
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
</template>

<script>
import { exportFile } from 'quasar'
import AddTodo from '../../components/admin/todo/AddTodo.vue'
import EditTodo from '../../components/admin/todo/editTodo.vue'
import Permissions from 'src/services/Permission'


function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted = formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

export default {
  data() {
    return {
      search: '',
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: (row) => row.id, sortable: true },
        { name: 'title', label: 'Title', align: 'left', field: (row) => row.title },
        { name: 'tags', label: 'Tags', align: 'left', field: (row) => row.tags },
        { name: 'status', label: 'Status', align: 'left', field: (row) => row.status },
        {
          name: 'user',
          label: 'User',
          align: 'left',
          field: (row) => (row.User ? row.User.email : ''),
          classes: 'text2',
        },
        {
          name: 'createdBy',
          label: 'Created By',
          align: 'left',
          field: (row) => (row.CreatedByUser ? row.CreatedByUser.email : ''),
          classes: 'text2',
        },
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
      showUpdateDialog: false,
      statusId: null,
      todoData: null,
    }
  },
  components: {
    AddTodo,
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
        const response = await this.$adminApi.get('/admin/get_all_todos')
        this.rowsData = response.data.allTodos
        console.log(response.data.allTodos)
      } catch (error) {
        console.error('error', error.response ? error.response.data : error.message)
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
      return status === 0 ? 'blue' : status === 1 ? 'pink' : status === 2 ? 'green' : 'grey'
    },
    parseTags(tags) {
      return Array.isArray(tags) ? tags : JSON.parse(tags)
    },
    async editTodo(taskTodo) {
      this.todoData = taskTodo
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
            const response = await this.$adminApi.delete(`/admin/todo/${id}`)
            await this.getTodo()
            console.log('Delete', response)
          })
          .onCancel(() => {})
      } catch (error) {
        if (error.response && error.response.data) {
          const errorData = error.response.data
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorData.errors.forEach((err) => {
              this.$q.notify({
                type: 'negative',
                message: `Error: ${err}`,
              })
            })
          } else {
            this.$q.notify({
              type: 'negative',
              message: `Error: ${errorData.message || 'Unknown error'}`,
            })
          }
        } else if (error.request) {
          console.error('No response received:', error.request)
          this.$q.notify({
            type: 'negative',
            message: `Error: No response received from the server.`,
          })
        } else {
          console.error('Error', error.message)
          this.$q.notify({
            type: 'negative',
            message: `Error: ${error.message}`,
          })
        }
      }
    },
    can(perm) {
      console.log(Permissions.hasPermission(perm))
      return Permissions.hasPermission(perm)
    },

  },
  computed: {
    filterRows() {
      if (!this.search) return this.rowsData

      const searchLower = this.search.toLowerCase()
      return this.rowsData.filter((row) =>
        Object.values(row).some(
          (value) => value && String(value).toLowerCase().includes(searchLower),
        ),
      )
    },

  },
  async mounted() {
    await this.getTodo()
  },
}
</script>
