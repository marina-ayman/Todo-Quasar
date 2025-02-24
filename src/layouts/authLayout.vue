<template :class="themeClass">

  <q-layout>
    <q-toggle v-model="isDarkMode"/>
   
    
    <q-page-container>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: this.$q.dark.isActive,
      drawer: true
    };
  },
  computed: {
    themeClass() {
      return this.isDarkMode ? 'dark-mode' : 'light-mode';
    },
  },
  watch: {
    isDarkMode(newVal) {
      this.$q.dark.set(newVal);
      document.body.className = this.themeClass;
    },
  },
  mounted() {
    document.body.className = this.themeClass;
  },
};
</script>
