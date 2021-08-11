<template>
  <iframe
    width="100%"
    height="410px"
    :src="src"
    frameborder="0">
  </iframe>
</template>

<script>
export default {
  props: ['cssProperty'],
  computed: {
    src() {
      return "https://caniuse.bitsofco.de/embed/index.html?feat=" + this.cssProperty +"&periods=future_1,current,past_1,past_2,past_3&accessible-colours=false"
    }
  }
}
</script>
