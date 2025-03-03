<template>
  <div class="q-pa-md">
    <h2 class="grey q-mx-xl">All Roles</h2>
    <q-input v-model="search" label="Search..." dense outlined class="q-mb-sm q-mx-xl">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-table
      flat
      title="Your Roles"
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
          v-if="can('export_role')"
          class="q-mx-sm custom-btn"
          glossy
          icon="archive"
          label="export"
          @click="exportTable"
        />
        <q-btn
          v-if="can('create_role')"
          class="q-mx-sm custom-btn"
          glossy
          icon="library_add"
          label="add"
          @click="addRole"
        />
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            v-if="can('update_role')"
            color="primary"
            class="q-ml-sm q-pa-sm"
            flat
            icon="edit"
            size="md"
            @click="editRole(props.row)"
          />
          <q-btn
            v-if="can('delete_role')"
            color="red"
            icon="delete"
            size="md"
            flat
            class="q-ml-sm q-pa-sm"
            @click="deleteRole(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { exportFile } from 'quasar'
import Permissions from 'src/services/Permission'
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
      search: '',
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: (row) => row.id, sortable: true },
        { name: 'key', label: 'Role Name', align: 'left', field: (row) => row.key },
        { name: 'value', label: 'Description', align: 'left', field: (row) => row.value },
        { name: 'action', label: 'Action', align: 'center', field: (row) => row.id },
      ],

      rowsData: [],
      showDialog: false,
      showUpdateDialog: false,
      roleData: null,
    }
  },
  components: {
    // AddRole,
    // EditRole,
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
    async getRoles() {
      try {
        const response = await this.$adminApi.get('/acl/roles')
        this.rowsData = response.data
      } catch (error) {
        handleError(error)
        throw error
      }
    },

    async editRole(role) {
      this.$router.push(`/dashboard/edit_role/${role.id}`)
    },
    async deleteRole(id) {
      try {
        this.$q
          .dialog({
            title: 'Confirm',
            message: `Would you want To delete this Role ?`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const response = await this.$adminApi.delete(`/acl/roles/${id}`)
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
            await this.getRoles()
            console.log('Delete', response)
          })
          .onCancel(() => {})
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    addRole() {
      this.$router.push('/dashboard/add_role')
    },
    can(perm) {
      return Permissions.hasPermission(perm)
    },
  },
  computed: {
    // ...mapGetters(['hasPermission']),

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
    await this.getRoles()
    // this.$eventBus.emit("getRoles", this.rowsData)
  },
}
</script>
