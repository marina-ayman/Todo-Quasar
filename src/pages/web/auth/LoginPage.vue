<template>
  <div class="row">
    <div class="col-5 q-pt-xl q-px-md q-header">
      <div class="text2">
        <h4 class="text-center text2">
          <q-img src="~assets/img/hour.png" class="text2 img" width="90px" />LOG IN
        </h4>
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

          <div class="q-mt-md text-center">
            <q-btn label="LOG IN" type="submit" glossy class="custom-btn" />
          </div>
        </q-form>
      </div>
      <div class="text-center q-ma-md">
        <q-img src="~assets/img/hour.png" class="text2 img" width="30px" />
        <router-link to="/auth/reg" class="text2"> Go to Register to create acount</router-link>
      </div>
    </div>
    <div class="col-7">
      <div class="flex flex-center">
        <q-img width="50rem" src="~assets/img/reg.png" style="border-radius: 50%" />
      </div>
    </div>
  </div>
</template>

<script>
import handleError from 'src/services/errorhandler'

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
      try {
        const response = await this.$api.post('/web/login', this.form)
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
        const { accessToken, refreshToken } = response.data.token

        localStorage.setItem('token', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        this.$router.push('/profile')
      } catch (error) {
        handleError(error)
        throw error
      }
    },
  },
}
</script>

<style scoped>
/* .img {
  height: auto;
  transform: rotate(-45deg);
  transition: transform 0.5s ease-in-out;
} */
</style>
