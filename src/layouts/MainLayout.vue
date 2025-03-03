<template :class="themeClass">
  <q-layout view="hHh lpR fFf">
    <q-header class="q-header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="custom-btn"
        />

        <q-toolbar-title>
          <router-link to="/dashboard" class="q-mr-xl quick-task">
          
            <q-img src="~assets/img/hour.png" class="text2 img" width="70px" />
           QuickTask </router-link>
        </q-toolbar-title>

        <div>
          <q-btn class="custom-btn" glossy @click="logOut()"> LOG OUT </q-btn>
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

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="q-header">
      <q-list class="q-header">
        <q-item-label header class="text2"> QuickTask Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

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
import EssentialLink from 'components/EssentialLink.vue'
import Permissions from 'src/services/Permission'


export default {
  data() {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        age: 0,
      },
      linksList: [
        {
          title: 'All Users',
          icon: 'code',
          link: '/dashboard',
        },
        {
          title: 'All Todos',
          icon: 'school',
          link: '/dashboard/all_todos/',
          perm: 'view_todos'
        },
        {
          title: 'All Roles',
          icon: 'code',
          link: '/dashboard/roles',
          perm: 'view_roles'
        },
      ],
      isDarkMode: localStorage.getItem("theme")
        ? localStorage.getItem("theme") === "dark"
        : this.$q.dark.isActive,
    }
  },
  watch: {
    isDarkMode(newVal) {
      this.$q.dark.set(newVal);
      localStorage.setItem("theme", newVal ? "dark" : "light");
      document.body.className = this.themeClass;
    },
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen
    },
    async getProfile() {
      try {
        const response = await this.$adminApi.get('/web/profile')
        this.user = response.data.profile
      } catch (error) {
        console.error('error', error.response ? error.response.data : error.message)
      }
    },
    logOut() {
      Permissions.logout()
      this.$router.push('/dashboard/auth/login')

    },
  },
  async mounted() {

    this.$q.dark.set(this.isDarkMode);
    document.body.className = this.themeClass;

    this.rightDrawerOpen = false
    await this.getProfile()

  },
  computed: {
   themeClass() {
      return this.isDarkMode ? 'dark-mode' : 'light-mode';
    },
  },
  components: {
    EssentialLink,
  },
}
</script>

<style>
.img {
  height: auto;
  transform: rotate(-45deg);
  transition: transform 0.5s ease-in-out;
}
</style>
