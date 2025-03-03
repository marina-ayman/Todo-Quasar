<template>
  <q-page class="flex flex-center" v-if="!isUpdate">
    <q-card class="q-mt-xl q-header" style="height: 500px; width: 300px; border-radius: 30px">
      <q-card-section class="text-center">
        <div class="text-h4 text-bold text-blue-3" style="height: 200px">
          <q-icon name="account_circle" size="200px" />
        </div>
      </q-card-section>

      <q-card-section class="text-start">
        <div class="text-h6 text-bold grey">
          First Name :
          <strong class="text2"> {{ user.firstName }}</strong>
        </div>

        <div class="text-h6 text-bold grey">
          last Name :
          <strong class="text2">{{ user.lastName }}</strong>
        </div>

        <div class="text-h6 text-bold grey">
          Email :
          <strong class="text2"> {{ user.email }} </strong>
        </div>
        <div class="text-h6 text-bold grey">
          Age :
          <strong class="text2"> {{ user.age }} </strong>
        </div>

        <div class="q-ma-md">
          <q-btn glossy class="custom-btn" @click="isUpdate = !isUpdate">Edit Profile</q-btn>
          <q-btn glossy class="q-mx-md custom-btn" color="red-6" @click="deleteUser">delete</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-page>

  <q-page class="flex flex-center">
    <update-user
      v-if="isUpdate"
      :user="user"
      @updated="
        (val) => {
          isUpdate = val
        }
      "
      :getProfile="getProfile"
    />
  </q-page>
</template>
<script>
import UpdateUser from '../../../components/user/UpdateUser.vue'
import handleError from 'src/services/errorhandler'

export default {
  name: 'LoginPage',
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        age: 0,
      },
      isUpdate: false,
    }
  },
  components: {
    UpdateUser,
  },
  async mounted() {
    await this.getProfile()
  },
  methods: {
    async getProfile() {
      try {
        const response = await this.$api.get('/web/profile')
        if (response.data.error) {
          console.log('Done', response.data.error)
          this.$q.notify({
            type: 'negative',
            message: response.data.message,
          })
          this.loadBtn = false
          return
        }
        this.user = response.data.profile
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    async deleteUser() {
      try {
        this.$q
          .dialog({
            title: 'Confirm',
            message: `Would you want To delete Your Acount & Task Todo?`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const response = await this.$api.delete(`/web/user/${this.user.id}`)
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
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')

            this.$router.push('/auth/reg')
            console.log('Delete', response)
          })
          .onCancel(() => {})
      } catch (error) {
        handleError(error)
        throw error
      }
    },
  },
}
</script>
