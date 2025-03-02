<!-- eslint-disable max-len -->
<template>
  <div
    class="fullscreen text-primary text-center q-pa-md flex flex-center"
  >
    <div>
      <div class="text-weight-bold" style="font-size: 45vh; opacity: 0.3">
       {{ $t('403') }}
      </div>
      <div class="text-h5 text-weight-bold">
        <p>  Oops. Nothing here...    </p>
          
          <q-btn color="white" class="text-blue" label="Go Back" @click="goBack"/>
       
      </div>
    </div>
  </div>
</template>

<script>

export default {
  goBack() {
      // this.$router.go(-1)
      this.$router.push('/dashboard')
    },
}
</script>

<style>
.fullscreen {
  background: linear-gradient(135deg, #99dfff, #ffffff);
}
</style>
