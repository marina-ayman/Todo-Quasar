<template :class="themeClass">
  <q-layout>
    <!-- <q-toggle v-model="isDarkMode" label="Dark Mode"/> -->
    
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: localStorage.getItem("theme")
        ? localStorage.getItem("theme") === "dark"
        : this.$q.dark.isActive,    };
  },
  computed: {
    themeClass() {
      return this.isDarkMode ? 'dark-mode' : 'light-mode';
    },
  },
  watch: {
    isDarkMode(newVal) {
      this.$q.dark.set(newVal);
      localStorage.setItem("theme", newVal ? "dark" : "light");
      document.body.className = this.themeClass;
    },
  },
  mounted() {
    this.$q.dark.set(this.isDarkMode);
    document.body.className = this.themeClass;
  },
};
</script>
