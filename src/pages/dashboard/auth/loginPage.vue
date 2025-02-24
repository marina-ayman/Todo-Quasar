<template>
  <div class="row">
    <div class="col-6 text-center">
      <q-form @submit.prevent="onLogin" class="q-pa-md q-ma-md" style="width: 50%; margin: 0 auto">
        <h4 class="text-center text2">
          <q-img src="~assets/img/hour.png" class="text2 img" width="90px" />
          {{ $t('LOG IN') }}
        </h4>
        <q-input
          v-model="form.email"
          label="Email"
          type="email"
          class="text2"
          filled
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          v-model="form.password"
          label="Password"
          type="password"
          class="text2"
          filled
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <div class="q-mt-md text-right">
          <q-btn :label="$t('LOG IN')" type="submit" glossy class="custom-btn" />
        </div>
      </q-form>
    </div>
    <div class=" relative-position col-6 q-header" style="position: relative; height: 100vh">
      <q-img
        src="~assets/img/profile-transparent.webp"
        style="position: absolute; bottom: 0; right: 0; width: 1000px; height: auto"
      />
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
      const response = await this.$adminApi.post('/web/login', this.form)
      try {
        console.log('Done', response.data)
        const { accessToken, refreshToken } = response.data.token
        localStorage.setItem('adminToken', accessToken)
        localStorage.setItem('adminRefreshToken', refreshToken)

        this.$router.push('/dashboard')
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
<style>
.img {
  height: auto;
  transform: rotate(-45deg);
  transition: transform 0.5s ease-in-out;
}
</style>
