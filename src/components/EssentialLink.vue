<template>
  <q-item clickable tag="a" target="_blank">
    <router-link :to="props.link" active-class="text-primary" class="customText text-h6 q-mx-md">
      <q-item-section>
        <q-item-label>
          <q-icon v-if="props.icon" :name="props.icon" />

          {{ props.title }}</q-item-label
        >
      </q-item-section>
    </router-link>
  </q-item>
</template>

<script setup>
const props = defineProps({
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
})
</script>
