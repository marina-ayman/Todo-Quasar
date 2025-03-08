<template>
  <div class="q-pa-md">
    <h2 class="grey q-mx-xl">All Roles</h2>

    <q-card class="q-pa-lg q-mt-md q-header">
      <q-form @submit.prevent="saveData">
        <div class="row">
          <!-- Role Name Input -->
          <div class="col-6 col-md-6">
            <q-input
              v-model="newRole.key"
              label="Role Name"
              outlined
              rounded
              color="blue-12"
              class="q-ma-md"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:append>
                <q-icon
                  name="close"
                  v-if="newRole.key"
                  @click="newRole.key = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>

          <!-- Description Input -->
          <div class="col-6 col-md-6">
            <q-input
              v-model="newRole.value"
              label="Description"
              outlined
              rounded
              color="blue-12"
              class="q-ma-md"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:append>
                <q-icon
                  name="close"
                  v-if="newRole.value"
                  @click="newRole.value = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
        </div>

        <q-expansion-item
          v-for="role in rolesData"
          :key="role.id"
          icon="lock"
          :label="role.key"
          header-class="text-body1 q-pa-md  text-light q-header2"
          group="profile"
          class="q-mb-md"
          style="border-radius: 15px"
        >
          <q-checkbox
            v-for="(perm, i) in role.permissions"
            :key="i"
            keep-color
            v-model="selectedPermissions[role.id]"
            :val="perm"
            :label="perm"
            color="blue-5"
            rounded
          />
        </q-expansion-item>

        <div class="q-mt-md flex flex-end">
          <q-btn type="submit" :loading="loadBtn" label="Save" color="blue-4">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import handleError from 'src/services/errorhandler'

export default {
  data() {
    return {
      loadBtn: false,
      rolesData: [],
      newRole: {
        key: '',
        value: '',
      },
      selectedPermissions: {},
    }
  },

  methods: {
    async saveData() {
      this.loadBtn = true
      try {
        const data = {
          role: this.newRole,
          resources: this.selectedPermissions,
        }
        console.log(data)
        const roleId = this.$route.params.id
        const response = await this.$adminApi.patch(`/acl/roles/${roleId}`, data)
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
        this.loadBtn = false
        this.$router.push('/dashboard/roles')
      } catch (error) {
        handleError(error)
        throw error
      }
    },

    async getData() {
      this.loadBtn = true

      try {
        const roleId = this.$route.params.id
        const responseData = await this.$adminApi.get('/acl/getRoleData')
        const response = await this.$adminApi.get(`/acl/roles/${roleId}`)
        if (response.data.error) {
          console.log('Done', response.data.error)
          this.$q.notify({
            type: 'negative',
            message: response.data.message,
          })
          this.loadBtn = false
          return
        }
        this.rolesData = responseData.data.resources
        this.newRole.key = response.data.data.key

        this.rolesData.forEach((role) => {
          this.selectedPermissions[role.id] = []
        })

        response.data.data.resources.forEach((role) => {
          this.selectedPermissions[role.id] = Array.isArray(role.permissions)
            ? role.permissions
            : []
        })
      } catch (error) {
        handleError(error)
        throw error
      } finally {
        this.loadBtn = false
      }
    },
  },

  async mounted() {
    await this.getData()
  },
}
</script>
