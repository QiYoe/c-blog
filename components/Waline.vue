<template>
  <div id="waline" style="margin: 0 auto; padding: 2rem 0;" />
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import { init } from '@waline/client';
import '@waline/client/dist/waline.css'

const serverURL = 'https://c-vercel-waline.vercel.app';

let waline, isDark = ref(true);

onMounted(() => {
  const toggleBtns = document.getElementsByClassName('VPSwitch VPSwitchAppearance')
  for (let i = 0; i < toggleBtns.length; i++) {
    toggleBtns[i].onclick = function() {
      isDark.value = !isDark.value
      console.log(111, isDark.value);
    }
  }

  waline = init({
    el: '#waline',
    serverURL,
    path: location.pathname,
    dark: isDark.value,
    comment: true,
    pageview: true,
    locale: {
      admin: '可爱的管理员',
      level0: '通脉',
      level1: '锻骨',
      level2: '炼腑',
      level3: '元武',
      level4: '神力',
      level5: '破虚',
    },
  })
})


history.pushState = new Proxy(history.pushState, {
  apply: function (target, thisBinding, args) {
    setTimeout(() => {
      waline.update();
    }, 500);
    return target.apply(thisBinding, args);
  },
});

watch(
  isDark,
  (old, val) => {
    waline.update({ dark: !val })
  },
)
</script>
