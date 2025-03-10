<template>
  <q-dialog persistent v-model="localDialog">
    <q-card style="width: 400px; max-width: 70vw">
      <q-card-section class="row q-header2">
        <div class="text-h6">Add Task ..</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('closeDialog')" />
      </q-card-section>

      <q-card-section class="q-header">
        <form @submit.prevent="saveData">
          <q-input
            v-model="taskTodo.title"
            label="Task Title"
            outlined
            rounded
            color="blue-12"
            class="col"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                v-if="taskTodo.title"
                @click="taskTodo.title = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-select
            outlined
            rounded
            v-model="taskTodo.tags"
            use-input
            class="q-mb-md"
            multiple
            hide-dropdown-icon
            new-value-mode="add"
            label="Enter Tags"
          >
            <template v-slot:selected>
              <q-chip
                v-for="(tag, index) in taskTodo.tags"
                :key="index"
                removable
                color="blue-3"
                text-color="black"
                class="q-mr-sm q-mb-sm"
                @remove="removeTag(index)"
              >
                {{ tag }}
              </q-chip>
            </template>

            <template v-slot:append>
              <q-icon
                name="close"
                v-if="taskTodo.tags.length"
                @click="taskTodo.tags = []"
                class="cursor-pointer"
              />
            </template>
          </q-select>

          <q-input
            v-model="taskTodo.fromDate"
            label="Task Date"
            outlined
            rounded
            color="blue-12"
            class="col"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                v-if="taskTodo.fromDate"
                @click="clearDueDate"
                class="cursor-pointer"
              />
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="taskTodo.fromDate" color="blue">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="blue-12" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            v-model="taskTodo.toDate"
            label="To Date"
            outlined
            rounded
            color="blue-12"
            class="col"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                v-if="taskTodo.toDate"
                @click="taskTodo.toDate = ''"
                class="cursor-pointer"
              />
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="taskTodo.toDate" color="blue">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="blue-12" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-select
            v-model="taskTodo.userId"
            :options="allUsers"
            label="Select User"
            :option-value="'id'"
            :option-label="'email'"
            rounded
            color="blue-12"
            outlined
            emit-value
            map-options
          >
            <template v-slot:selected>
              <p v-if="selectedUser">
                <strong>{{ selectedUser.email }}</strong>
              </p>
            </template>
          </q-select>

          <q-btn type="submit" :loading="loadBtn" label="Save" class="q-mt-md" color="blue-4">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import handleError from 'src/services/errorhandler'
export default {
  data() {
    return {
      loadBtn: false,
      taskTodo: {
        title: '',
        fromDate: '',
        toDate: '',
        tags: [],
        userId: null,
      },
      localDialog: false,
      allUsers: [],
    }
  },
  props: ['dialogVisible', 'getTodo'],
  watch: {
    dialogVisible(newVal) {
      this.localDialog = newVal
    },
    localDialog(newVal) {
      this.$emit('update:dialogVisible', newVal)
    },
  },
  methods: {
    removeTag(index) {
      this.taskTodo.tags.splice(index, 1)
    },
    clearDueDate() {
      this.taskTodo.fromDate = ''
      this.taskTodo.toDate = ''
    },
    async saveData() {
      this.loadBtn = true
      try {
        const response = await this.$adminApi.post('/admin/todo', this.taskTodo)
        if (response.data.error) {
          console.log('Done', response.data.error)
          this.$q.notify({
            type: 'negative',
            message: response.data.message,
          })
         
          this.loadBtn = false
          return
        } else {
          this.taskTodo = {
            title: '',
            fromDate: '',
            toDate: '',
            tags: [],
          },
          this.$q.notify({
            type: 'positive',
            message: response.data.message,
          })
        }
        await this.getTodo()
        console.log('Done', this.taskTodo)
        this.$emit('closeDialog')
        this.loadBtn = false
      } catch (error) {
        handleError(error)
        throw error,

        this.loadBtn = false
      }
    },
    async getUsers() {
      try {
        const response = await this.$adminApi.get('/admin/get_all_todos')
        if (response.data.error) {
          console.log('Done', response.data.error)
          this.$q.notify({
            type: 'negative',
            message: response.data.message,
          })
          this.loadBtn = false
          return
        }
        this.allUsers = response.data.allUsers
      } catch (error) {
        handleError(error)
        throw error 
      }
    },
  },
  computed: {
    selectedUser() {
      return this.allUsers.find((user) => user.id === this.taskTodo.userId) || null
    },
  },
  async mounted() {
    await this.getUsers()
    console.log(this.allUsers)
  },
}
</script>
