<template>
  <q-page class="flex flex-center">
    <q-card class="q-mt-xl q-header" style="height: 500px; width: 300px; border-radius: 30px">
      <p class="text-center text2 text-weight-bold text-h4 q-mt-sm">update</p>
      <q-form @submit.prevent="onSubmit" class="q-px-md">
        <q-input
          v-model="form.firstName"
          label="First Name"
          type="text"
          class="text2"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          v-model="form.lastName"
          label="Last Name"
          type="text"
          class="text2"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          v-model="form.email"
          label="Email"
          type="email"
          class="text2"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          v-model="form.password"
          label="Password"
          type="password"
          class="text2"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          v-model="form.age"
          label="age"
          type="number"
          class="text2"
          :rules="[
            (val) => (val !== null && val !== '') || 'Please type your age',
            (val) => (val > 0 && val < 100) || 'Please type a real age',
          ]"
        />

        <div class="q-mt-sm text-right">
          <q-btn label="Register" type="submit" class="custom-btn" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>
<script>
export default {
  name: 'UpdatePage',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        age: 0,
      },
    }
  },
  props: ['user', 'getProfile'],
  async mounted() {
    await this.getData()
  },
  methods: {
    async getData() {
      this.form.firstName = this.user.firstName
      this.form.lastName = this.user.lastName
      this.form.email = this.user.email
      this.form.password = this.user.password
      this.form.age = this.user.age

      console.log(this.form)
    },
    async onSubmit() {
      try {
        const response = await this.$api.patch(`/web/user/${this.user.id}`, this.form)
        await this.getProfile()
        console.log('Done', response)
        this.$emit('updated', false)
      } catch (error) {
        if (error.response && error.response.data) {
          const errorData = error.response.data
          console.log(errorData.errors)
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
  },
}
</script>
