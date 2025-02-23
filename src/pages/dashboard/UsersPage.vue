<template>
  <div class="q-ma-xl">
    <h2>All Users</h2>
    <div class="q-py-md q-my-md user-card" v-for="(user, index) in users" :key="index">
      <div class="row">
        <div class="col-9 q-px-xl">
          <h4 class="q-ma-sm q-px-md title text-weight-bolder" style="border-left: 5px solid blue">
            {{ user.firstName }} {{ user.lastName }}
          </h4>
          <div class="text-weight-bold q-px-md q-mx-md text2">{{ user.email }}</div>
          <p class="q-px-md q-mx-md text-bold text-blue-10">{{ user.age }} years old</p>

          <p class="q-px-md q-mx-md grey">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus nulla excepturi
            dicta quidem vel facilis eveniet commodi atque esse earum. Ut alias numquam itaque fuga,
            doloremque quaerat illum ad quo?
          </p>
        </div>
        <div class="col-3 text-right">
          <q-btn
            icon="arrow_forward_ios"
            class="custom-btn q-px-md q-mx-sm"
            style="min-height: 190px"
            @click="getTasksUser(user.id)"
          ></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      users: {},
    }
  },

  async mounted() {
    await this.getAllUsers()
  },
  methods: {
    async getAllUsers() {
      try {
        const response = await this.$adminApi.get('/admin/get_all_users')
        this.users = response.data.allUsers
        console.log('mm', this.users)
      } catch (err) {
        console.log(err)
      }
    },
    getTasksUser(id) {
      this.$router.push(`/dashboard/user_todos/${id}`)
    },
  },
}
</script>
