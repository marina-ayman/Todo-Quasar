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
          <q-badge :color="getStatusColor(props.row.status)" text-color="white">
            {{ getStatusText(props.row.status) }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-tags="props">
        <q-td :props="props">
          <q-chip
            v-for="(tag, index) in parseTags(props.row.tags)"
            :key="index"
            color="blue-3"
            text-color="black"
            class="q-mr-sm q-mb-sm"
          >
            {{ tag }}
          </q-chip>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { exportFile } from 'quasar'

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
        {
          name: 'user',
          label: 'User ID',
          align: 'left',
          field: (row) => row.User.firstName + ' ' + row.User.lastName,
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
      ],

      rowsData: [],
      showDialog: false,
      showDialogStatus: false,
      showUpdateDialog: false,
      statusId: null,
      todoData: null,
    }
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
        const userId = this.$route.params.id
        const response = await this.$adminApi.get(`/admin/get_user_todos/${userId}`)
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
  },
  async mounted() {
    await this.getTodo()
  },
}
</script>
