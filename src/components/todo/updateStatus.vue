<template>
  <q-dialog persistent v-model="localDialog">
    <q-card style="width: 400px; max-width: 70vw">
      <q-card-section class="row q-header2">
        <div class="text-h6">update Status ..</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('closeDialog')" />
      </q-card-section>

      <q-card-section class="q-header">
        <form @submit.prevent="saveData">
          <q-select
            v-model="status"
            :options="statusOptions"
            label="Select Status"
            outlined
            emit-value
            map-options
            class="q-mt-md"
          />

          <q-btn type="submit" :loading="loadBtn" label="Save" class="q-mt-md custom-btn">
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
      status: 0,
      localDialog: false,
      statusOptions: [
        { label: 'TODO', value: 0 },
        { label: 'ON PROGRESS', value: 1 },
        { label: 'DONE', value: 2 },
      ],
    }
  },
  props: ['dialogVisible', 'getTodo', 'statusId'],
  watch: {
    dialogVisible(newVal) {
      this.localDialog = newVal
    },
    localDialog(newVal) {
      this.$emit('update:dialogVisible', newVal)
    },
  },
  methods: {
    async saveData() {
      this.loadBtn = true
      console.log('Done', this.statusId)

      try {
        const response = await this.$api.patch(`/status/${this.statusId}`, {
          status: this.status,
        })
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
        await this.getTodo()
        console.log('Done', this.statusId)
        this.$emit('closeDialog')
        this.loadBtn = false
      } catch (error) {
        handleError(error)
        throw error,

        this.loadBtn = false
      }
    },
  },
}
</script>
