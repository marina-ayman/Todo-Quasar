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
    <div class="relative-position col-6 q-header" style="position: relative; height: 100vh">
      <q-img
        src="~assets/img/profile-transparent.webp"
        style="position: absolute; bottom: 0; right: 0; width: 1000px; height: auto"
      />
    </div>
  </div>
</template>
<script>
import Permissions from 'src/services/Permission'
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
    // ...mapActions(['login']),
    async onLogin() {
      try {
        const response = await this.$adminApi.post('/admin/login', this.form)

        if (response.data.error) {
          console.log('Done', response.data.error)
          this.$q.notify({
            type: 'negative',
            message: response.data.message,
          })
          return
        } else {
          this.$q.notify({
            type: 'positive',
            message: response.data.message,
          })
        }
        const { accessToken, refreshToken } = response.data.token

        localStorage.setItem('adminToken', accessToken)
        localStorage.setItem('adminRefreshToken', refreshToken)
        const user = {
          id: response.data.user.id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          age: response.data.user.age,
          isAdmin: response.data.user.isAdmin,
          role_id: response.data.user.role_id,
        }
        Permissions.setUser(user)
        Permissions.setPermissions(response.data.user.permissions)

        console.log('User:', Permissions.getUser())
        console.log('Permissions:', Permissions.getPermissions())

        this.$router.push('/dashboard')
      } catch (error) {
        handleError(error)
        throw error
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
