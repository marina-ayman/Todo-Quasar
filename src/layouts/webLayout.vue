<template :class="themeClass">
  <q-layout view="hHh lpR fFf">
    <q-header class="q-mx-xl q-pa-sm q-header" style="border-radius: 0px 0px 15px 15px">
      <q-toolbar>
        <q-toolbar-title>
          <router-link to="/profile" class="q-mr-xl quick-task"> 
          
            <q-img src="~assets/img/hour.png" class="text2 imgg" width="90px" />
          QuickTask </router-link>

          <router-link to="/todos" active-class="text-primary" class="customText text-h6 q-mx-md">
            Todos
          </router-link>
          <router-link to="/profile" active-class="text-primary" class="customText text-h6 q-mx-md">
            Profile
          </router-link>
        </q-toolbar-title>

        <div>
          <q-btn class="custom-btn" @click="logOut()"> LOG OUT </q-btn>
          <q-toggle v-model="isDarkMode" class="q-mb-md text-blue-6 q-pt-md" />
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleRightDrawer"
            class="text-blue-6"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      :width="250"
      :breakpoint="400"
      :style="{ borderRadius: '20px', overflow: 'hidden' }"
      :class="themeClass"
    >
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
      >
        <q-list
          padding
          class="q-header q-mx-md"
          :style="{
            borderRadius: '20px',
            overflow: 'hidden',
            marginTop: '30px',
          }"
        >
          <q-item clickable v-ripple active>
            <q-item-section avatar>
              <q-icon name="email"></q-icon>
            </q-item-section>

            <q-item-section> {{ user.email }} </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="star"></q-icon>
            </q-item-section>

            <q-item-section> {{ user.age }} years</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="send"></q-icon>
            </q-item-section>

            <q-item-section> profile </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="drafts"></q-icon>
            </q-item-section>

            <q-item-section> My Tasks </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img
        class="q-mt-md q-ml-md absolute-top"
        src="../assets/img/back.png"
        style="height: 150px"
        width="218px"
        :style="{ borderRadius: '20px', overflow: 'hidden' }"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="60px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-blue-9 text-h5">{{ user.firstName }} {{ user.lastName }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      rightDrawerOpen: false,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        age: 0,
      },
      isDarkMode: localStorage.getItem("theme")
        ? localStorage.getItem("theme") === "dark"
        : this.$q.dark.isActive,
    };
  },
  watch: {
    isDarkMode(newVal) {
      this.$q.dark.set(newVal);
      localStorage.setItem("theme", newVal ? "dark" : "light");
      document.body.className = this.themeClass;
    },
  },
  methods: {
    toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen;
    },
    async getProfile() {
      try {
        const response = await this.$api.get('/web/profile');
        console.log('Profile Data:', response);
        this.user = response.data.profile;
      } catch (error) {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
      }
    },
    logOut() {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      this.$router.push('/auth/login');
    },
  },
  async mounted() {
    this.$q.dark.set(this.isDarkMode);
    document.body.className = this.themeClass;
    await this.getProfile();

  },
  computed: {
    themeClass() {
      return this.isDarkMode ? 'dark-mode' : 'light-mode';
    },
  },
};

</script>
<style>
/* .imgg {
  height: auto;
  transform: rotate(-45deg);
  transition: transform 0.5s ease-in-out;
} */
</style>
