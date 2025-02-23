<template>
  <div class="row">
    <div class="col-5 gradient-background">
      <div class="text-pink-6">
        <h4 class="text-center text-pink-6">Register</h4>
        <q-form @submit.prevent="onSubmit" class="q-px-xl q-mx-xl text-pink-6">
          <q-input
            v-model="form.firstName"
            label="First Name"
            type="text"
            label-color="pink-6"
            color="pink-6"
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model="form.lastName"
            label="Last Name"
            type="text"
            label-color="pink-6"
            color="pink-6"
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            label-color="pink-6"
            color="pink-6"
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            label-color="pink-6"
            color="pink-6"
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model="form.age"
            label="age"
            type="number"
            label-color="pink-6"
            color="pink-6"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please type your age',
              (val) => (val > 0 && val < 100) || 'Please type a real age',
            ]"
          />

          <div class="q-mt-md text-right">
            <q-btn label="Register" type="submit" color="pink-6" />
          </div>
        </q-form>
      </div>
    </div>
    <div class="col-7">
      <q-carousel
        animated
        v-model="slide"
        navigation
        infinite
        :autoplay="autoplay"
        arrows
        transition-prev="slide-right"
        transition-next="slide-left"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
        style="height: 100vh"
      >
        <q-carousel-slide :name="1" img-src="~assets/img/th.jfif" />
      </q-carousel>
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
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        age: '',
      },
    }
  },
  methods: {
    async onSubmit() {
      try {
        const response = await this.$api.post('/web/register', this.form)
        console.log('Done', response.data)
        this.$router.push('/auth/login')
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
  },
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(45deg, #c9c9ca6f, #ffffff);
  color: white !important;
}
</style>
