<template>
  <p>
    <vue-cusdis
      :attrs="{
        host: 'https://c-cusdis-heroku-vercel-5mfuo3vte-qiyoe.vercel.app',
        appId: '807faa8b-2528-4c4f-af19-4df79e0e40cf',
        pageId: path,
        pageTitle: title,
        pageUrl: path,
        theme: 'light',
      }"
      lang="zh-cn"
    ></vue-cusdis>
  </p>
</template>

<script setup>
import VueCusdis from "vue-cusdis";
import { useData, useRoute } from "vitepress";
import { onMounted } from "vue";

const { title } = useData();
const { path } = useRoute();

onMounted(() => {
  let isDark = true;
  const VPBtns = document.getElementsByClassName("VPSwitch VPSwitchAppearance");
  const iframe = document.getElementsByTagName("iframe");

console.log(111, iframe, iframe[0]);
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  iframe[0].onload = () => {
    if (query.matches) {
      iframe[0].contentWindow.document.getElementById("root").style =
        "background: #242424; color: #fff";
    } else {
      iframe[0].contentWindow.document.getElementById("root").style =
        "background: #fff; color: #000";
    }
  }
  

  for (let i = 0; i < VPBtns.length; i++) {
    if (VPBtns[i]) {
      VPBtns[i].onclick = () => {
        console.log(4444);
        if (iframe[0]) {
          if (isDark) {
            isDark = false;
            iframe[0].contentWindow.document.getElementById("root").style =
              "background: #242424; color: #fff";
          } else {
            isDark = true;
            iframe[0].contentWindow.document.getElementById("root").style =
              "background: #fff; color: #000";
          }
        }
      };
    }
  }
});
</script>


