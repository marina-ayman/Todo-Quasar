<template>
  <div class="row">
    <div class="col-5 q-py-xl q-px-md q-header">
      <div class="text2 ">
        <h4 class="text-center text2">LOG IN</h4>
        <q-form @submit.prevent="onLogin" class="q-px-xl q-mx-xl text2">
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            label-color="blue"
            class="text2"
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            label-color="blue"
            class="text2"
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />

          <div class="q-mt-md text-right">
            <q-btn label="LOG IN" type="submit" glossy class="custom-btn" />
          </div>
        </q-form>
      </div>
    </div>
    <div class="col-7">
    <div class="flex   flex-center">
      <q-img  width="50rem" src="~assets/img/reg.png" style="border-radius:50% ;"/>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slide: 1,
      autoplay: true,
      form: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    async onLogin() {
      const response = await this.$api.post('/web/login', this.form)
      try {
        console.log('Done', response.data)
        localStorage.setItem('token', response.data.token)
        this.$router.push('/profile')
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
  },
}
</script>

<style scoped>
.registration-form {
  background-color: rgba(116, 171, 205, 0.941);
  border-radius: 8px;
}
</style>
