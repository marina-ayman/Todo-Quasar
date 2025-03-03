<template>
  <q-item clickable tag="a" target="_blank">
    <router-link
      :to="link"
      v-if="perm ? can(perm) : true"
      exact-active-class="text-primary"
      class="customText text-h6 q-mx-md"
    >
      <q-item-section>
        <q-item-label>
          <q-icon v-if="icon" :name="icon" />
            {{ title }}</q-item-label
        >
      </q-item-section>
    </router-link>
  </q-item>
</template>

<script>
import Permissions from 'src/services/Permission'

export default {

  props: {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '#',
    },
    icon: {
      type: String,
      default: '',
    },
    perm: {
      type: String,
      default: '',
    }
  },

  methods: {
    can(perm) {
      return Permissions.hasPermission(perm)
    }
  }

}
</script>
