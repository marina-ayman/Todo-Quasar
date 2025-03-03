<template>
  <div class="q-ma-xl">
    <div class="row">
      <div class="col">
        <h2>All Users</h2>
      </div>
      <div class="col text-right">
        <q-btn
          v-if="can('create_user')"
          class="q-mx-sm custom-btn"
          glossy
          icon="library_add"
          label="add"
          @click="showDialog = true"
        />
      </div>
    </div>
    <q-input v-model="search" label="Search..." dense outlined class="q-mb-sm">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <div class="q-py-md q-my-md user-card" v-for="user in filterRows" :key="user.id">
      <div class="row">
        <div class="col-9 q-px-xl">
          <h4
            v-if="can('view_user_todos')"
            class="cursor-pointer q-ma-sm q-px-md title text-weight-bolder"
            style="border-left: 5px solid blue"
            @click="getTasksUser(user.id, user.firstName)"
          >
            {{ user.firstName }} {{ user.lastName }}
          </h4>
          <h4
            v-if="!can('view_user_todos')"
            class="cursor-pointer q-ma-sm q-px-md title text-weight-bolder"
            style="border-left: 5px solid blue"
          >
            {{ user.firstName }} {{ user.lastName }}
          </h4>
          <div class="text-weight-bold q-px-md q-mx-md text2">{{ user.email }}</div>
          <p class="q-px-md q-mx-md text-bold text-blue-10">{{ user.age }} years old</p>

          <p class="q-px-md q-mx-md grey">
            Lorem ipsum dolor sit amet Temporibus nulla excepturi dicta quidem vel facilis eveniet
            atque esse earum. Ut alias numquam itaque
          </p>
          <q-btn
            v-if="can('update_user')"
            color="primary"
            class="q-ml-sm q-pa-sm"
            flat
            icon="edit"
            size="md"
            @click="editUser(user)"
          ></q-btn>
          <q-btn
            v-if="can('delete_user')"
            color="red"
            icon="delete"
            size="md"
            flat
            class="q-ml-sm q-pa-sm"
            @click="deleteUser(user.id)"
          />
        </div>
        <div class="col-3 text-right">
          <q-btn
            v-if="can('view_user_todos')"
            icon="arrow_forward_ios"
            class="custom-btn q-px-md q-mx-sm"
            style="min-height: 190px"
            @click="getTasksUser(user.id, user.firstName)"
          ></q-btn>
        </div>
      </div>
    </div>

    <add-user
      :dialogVisible="showDialog"
      @closeDialog="showDialog = false"
      :getAllUsers="getAllUsers"
    ></add-user>

    <edit-user
      :dialogVisible="showUpdateDialog"
      @closeDialog="showUpdateDialog = false"
      :getAllUsers="getAllUsers"
      :userData="userData"
    ></edit-user>
  </div>
</template>
<script>
import AddUser from '../../components/admin/user/AddUser.vue'
import EditUser from '../../components/admin/user/editUser.vue'
import Permissions from 'src/services/Permission'
import handleError from 'src/services/errorhandler'

export default {
  data() {
    return {
      users: {},
      search: '',
      userData: null,
      showDialog: false,
      showUpdateDialog: false,
    }
  },
  components: {
    AddUser,
    EditUser,
  },
  async mounted() {
    await this.getAllUsers()
  },
  methods: {
    async getAllUsers() {
      try {
        const response = await this.$adminApi.get('/admin/get_all_users')
        if (response.data.error) {
          console.log('Done', response.data.error)
          this.$q.notify({
            type: 'negative',
            message: response.data.message,
          })
          this.loadBtn = false
          return
        }
        this.users = response.data.allUsers
        console.log('mm', this.users)
      } catch (err) {
        handleError(err)
        throw err
      }
    },
    getTasksUser(id, name) {
      this.$router.push(`/dashboard/user_todos/${id}/${name}`)
    },
    async editUser(user) {
      this.userData = user
      this.showUpdateDialog = true
    },
    async deleteUser(id) {
      try {
        this.$q
          .dialog({
            title: 'Confirm',
            message: `Would you want To delete this user ?`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const response = await this.$adminApi.delete(`/admin/user/${id}`)
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
            await this.getAllUsers()
            console.log('Delete', response)
          })
          .onCancel(() => {})
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    can(perm) {
      return Permissions.hasPermission(perm)
    },
  },
  computed: {
    filterRows() {
      if (!this.search) return this.users

      const searchLower = this.search.toLowerCase()
      return this.users.filter((user) =>
        Object.values(user).some(
          (value) => value && String(value).toLowerCase().includes(searchLower),
        ),
      )
    },
  },
}
</script>
