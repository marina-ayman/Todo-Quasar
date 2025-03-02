<template>
  <q-dialog persistent v-model="localDialog">
    <q-card style="width: 750px; max-width: 70vw">
      <q-card-section class="row q-header2">
        <div class="text-h6">Edit User ..</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('closeDialog')" />
      </q-card-section>

      <q-card-section class="q-header">
        <q-form @submit.prevent="onSubmit" class="q-ma-md text2">
          <div class="row">
            <div class="col q-mx-md">
              <q-input
                v-model="form.firstName"
                label="First Name"
                type="text"
                label-color="text2"
                color="text2"
                outlined
                rounded
                :rules="[(val) => (val && val.length > 0) || 'Please type firstName']"
              />
            </div>
            <div class="col q-mx-md">
              <q-input
                v-model="form.lastName"
                label="Last Name"
                type="text"
                label-color="text2"
                color="text2"
                outlined
                rounded
                :rules="[(val) => (val && val.length > 0) || 'Please type lastName']"
              />
            </div>
          </div>
          <div class="row">
            <div class="col q-mx-md">
              <q-input
                v-model="form.email"
                label="Email"
                type="email"
                label-color="text2"
                color="text2"
                outlined
                rounded
                :rules="[(val) => (val && val.length > 0) || 'Please type email']"
              />
            </div>
            <div class="col q-mx-md">
              <q-input
                v-model="form.password"
                label="Password"
                type="password"
                label-color="text2"
                color="text2"
                outlined
                rounded
                :rules="[(val) => (val && val.length > 0) || 'Please type something']"
              />
            </div>
          </div>

          <div class="row">
            <div class="col q-mx-md">
              <q-input
                v-model="form.age"
                label="age"
                type="number"
                label-color="text2"
                color="text2"
                outlined
                rounded
                :rules="[
                  (val) => (val !== null && val !== '') || 'Please type your age',
                  (val) => (val > 0 && val < 100) || 'Please type a real age',
                ]"
              />
            </div>
            <div class="col q-mx-md">
              <q-select
                v-model="form.role_id"
                :options="rowsData"
                label="Select Role"
                :option-value="'id'"
                :option-label="'key'"
                rounded
                color="blue-12"
                outlined
                emit-value
                map-options
              >
                <template v-slot:selected>
                  <p v-if="selectedRole">
                    <strong>{{ selectedRole.key }}</strong>
                  </p>
                </template>
              </q-select>
            </div>
          </div>
          <div class="q-mt-md text-center">
            <q-btn label="Edit" type="submit" class="custom-btn" glossy />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      loadBtn: false,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        age: '',
        role_id: null,
      },
      localDialog: false,
      rowsData: [],
    }
  },
  props: ['dialogVisible', 'getAllUsers', 'userData'],
  watch: {
    dialogVisible(newVal) {
      this.localDialog = newVal
    },
    localDialog(newVal) {
      this.$emit('update:dialogVisible', newVal)
    },
    userData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.firstName = newVal.firstName
          this.form.lastName = newVal.lastName
          this.form.email = newVal.email
          this.form.age = newVal.age
          this.form.role_id = newVal.role_id
        }
      },
    },
  },
  methods: {
    async onSubmit() {
      try {
        const response = await this.$adminApi.patch(`/admin/user/${this.userData.id}`, this.form)
        console.log('Done', response.data)
        this.form = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          age: '',
          role_id: null,
        }
        await this.getAllUsers()

        this.$emit('closeDialog')
        this.$router.push('/dashboard')
      } catch (error) {
        if (error.response && error.response.data) {
          const errorData = error.response.data
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorData.errors.forEach((err) => {
              this.$q.notify({
                type: 'negative',
                message: `Error: ${err}`,
                ok: true,
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

    async getRoles() {
      try {
        const response = await this.$adminApi.get('/acl/roles')
        this.rowsData = response.data
      } catch (error) {
        console.error('error', error.response ? error.response.data : error.message)
      }
    },
  },
  computed: {
    selectedRole() {
      return this.rowsData.find((role) => role.id === this.form.role_id) || null
    },
  },
  async mounted() {
    await this.getRoles()
  },
}
</script>
