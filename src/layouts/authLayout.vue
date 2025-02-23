<template :class="themeClass">
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  watch: {
    themeClass(newClass) {
      document.body.className = newClass
    },
    async mounted() {
      document.body.className = this.themeClass
      this.$q.dark.set(true)
    },
    computed: {
      themeClass() {
        return this.$q.dark.isActive ? 'dark-mode' : 'light-mode'
      },
    },
  },
}
</script>
