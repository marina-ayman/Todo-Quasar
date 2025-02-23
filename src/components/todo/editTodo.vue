<template>
  <q-dialog persistent v-model="localDialog">
    <q-card style="width: 400px; max-width: 70vw">
      <q-card-section class="row q-header2">
        <div class="text-h6">update Task ..</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('closeDialog')" />
      </q-card-section>

      <q-card-section v-if="taskTodo" class="q-header">
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
            v-model="taskTodo.tags"
            outlined
            rounded
            use-input
            multiple
            hide-dropdown-icon
            new-value-mode="add"
            label="Enter Tags"
            class="q-pb-md"
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
export default {
  data() {
    return {
      loadBtn: false,
      taskTodo: {
        title: '',
        fromDate: '',
        toDate: '',
        tags: [],
      },
      localDialog: false,
    }
  },
  props: ['dialogVisible', 'getTodo', 'todoData'],
  watch: {
    dialogVisible(newVal) {
      this.localDialog = newVal
    },
    localDialog(newVal) {
      this.$emit('update:dialogVisible', newVal)
    },
    todoData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.taskTodo.title = newVal.title
          this.taskTodo.tags = Array.isArray(newVal.tags) ? newVal.tags : JSON.parse(newVal.tags)
          this.taskTodo.fromDate = newVal.formattedFromDate
          this.taskTodo.toDate = newVal.formattedToDate
        }
      },
    },
  },
  async mounted() {
    await this.getTodoData()
  },
  methods: {
    async getTodoData() {
      this.taskTodo.title = this.todoData?.title
      this.taskTodo.tags = this.todoData?.tags
      this.taskTodo.fromDate = this.todoData?.formattedFromDate
      this.taskTodo.toDate = this.todoData?.formattedToDate
      console.log('nnnnn', this.taskTodo)
    },
    removeTag(index) {
      if (Array.isArray(this.taskTodo.tags)) {
        this.taskTodo.tags.splice(index, 1)
      } else {
        console.error('taskTodo.tags is not an array', this.taskTodo.tags)
      }
    },
    clearDueDate() {
      this.taskTodo.fromDate = ''
      this.taskTodo.toDate = ''
    },
    async saveData() {
      this.loadBtn = true
      try {
        const response = await this.$api.patch(`/web/todo/${this.todoData.id}`, this.taskTodo)
        await this.getTodo()
        console.log('Done', this.taskTodo)
        this.localDialog = false
        this.loadBtn = false
        this.$q.notify({
          type: 'positive',
          message: response.data.msg,
          ok: true,
        })
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
          this.localDialog = false
        } else {
          console.error('Error', error.message)
          this.$q.notify({
            type: 'negative',
            message: `Error: ${error.message}`,
          })
          this.localDialog = false
        }

        this.loadBtn = false
      }
    },
  },
}
</script>
