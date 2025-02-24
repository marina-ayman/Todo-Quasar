<template>
  <div class="row q-ma-xl" >
    <div class="col-5 " >
      <div class="text2">
        <h4 class="text-center text2">
          <q-img src="~assets/img/hour.png" class="text2 " width="80px" />
          Register</h4>
        <q-form @submit.prevent="onSubmit" class="q-px-xl q-mx-xl text2">
          <q-input
            v-model="form.firstName"
            label="First Name"
            type="text"
            label-color="text2"
            color="text2"
            :rules="[(val) => (val && val.length > 0) || 'Please type firstName']"
          />
          <q-input
            v-model="form.lastName"
            label="Last Name"
            type="text"
            label-color="text2"
            color="text2"
            :rules="[(val) => (val && val.length > 0) || 'Please type lastName']"
          />
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            label-color="text2"
            color="text2"
            :rules="[(val) => (val && val.length > 0) || 'Please type email']"
          />
          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            label-color="text2"
            color="text2"
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model="form.age"
            label="age"
            type="number"
            label-color="text2"
            color="text2"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please type your age',
              (val) => (val > 0 && val < 100) || 'Please type a real age',
            ]"
          />

          <div class="q-mt-md text-right">
            <q-btn label="Register" type="submit" class="custom-btn" glossy />
          </div>
        </q-form>
      </div>
    </div>
    <div class="col-7 q-header">
      <div class="flex flex-center">
        <q-img src="~assets/img/hour.png" class="text2" width="550px" />
      </div>

      <div class="typeClass q-py-xl">
        <div class="typing q-py-xl">
          <div class="typing ">
            <span>S</span><span>t</span><span>a</span><span>y</span>
            <span> </span>
            <span>o</span><span>r</span><span>g</span><span>a</span><span>n</span><span>i</span
            ><span>z</span><span>e</span><span>d</span>
            <span> </span>
            <span>w</span><span>i</span><span>t</span><span>h</span>
            <span> </span>
            <span>y</span><span>o</span><span>u</span><span>r</span>
            <span> </span>
            <span>T</span><span>o</span>-<span>D</span><span>o</span>
            <span> </span>
            <span>L</span><span>i</span><span>s</span><span>t</span><span>!</span>
          </div>
        </div>
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

<style>
.typeClass {
  display: flex;
  justify-content: center;
  align-items: center;
}
.typing {
  font-size: 30px;
  font-weight: bolder;
  color: #0573db;
  display: flex;
  gap: 5px;
}

.typing span {
  opacity: 0;
  animation: appearDisappear 8s infinite;
}

@keyframes appearDisappear {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.typing span:nth-child(1) {
  animation-delay: 0s;
}
.typing span:nth-child(2) {
  animation-delay: 0.1s;
}
.typing span:nth-child(3) {
  animation-delay: 0.2s;
}
.typing span:nth-child(4) {
  animation-delay: 0.3s;
}
.typing span:nth-child(5) {
  animation-delay: 0.4s;
}
.typing span:nth-child(6) {
  animation-delay: 0.5s;
}
.typing span:nth-child(7) {
  animation-delay: 0.6s;
}
.typing span:nth-child(8) {
  animation-delay: 0.7s;
}
.typing span:nth-child(9) {
  animation-delay: 0.8s;
}
.typing span:nth-child(10) {
  animation-delay: 0.9s;
}
.typing span:nth-child(11) {
  animation-delay: 1s;
}
.typing span:nth-child(12) {
  animation-delay: 1.1s;
}
.typing span:nth-child(13) {
  animation-delay: 1.2s;
}
.typing span:nth-child(14) {
  animation-delay: 1.3s;
}
.typing span:nth-child(15) {
  animation-delay: 1.4s;
}
.typing span:nth-child(16) {
  animation-delay: 1.5s;
}
.typing span:nth-child(17) {
  animation-delay: 1.6s;
}
.typing span:nth-child(18) {
  animation-delay: 1.7s;
}
.typing span:nth-child(19) {
  animation-delay: 1.8s;
}
.typing span:nth-child(20) {
  animation-delay: 1.9s;
}
.typing span:nth-child(21) {
  animation-delay: 2s;
}
.typing span:nth-child(22) {
  animation-delay: 2.1s;
}
.typing span:nth-child(23) {
  animation-delay: 2.2s;
}
.typing span:nth-child(24) {
  animation-delay: 2.3s;
}
.typing span:nth-child(25) {
  animation-delay: 2.4s;
}
.typing span:nth-child(26) {
  animation-delay: 2.5s;
}

img {
  height: auto;
            transform: rotate(-45deg);
            transition: transform 0.5s ease-in-out;
        }
</style>
