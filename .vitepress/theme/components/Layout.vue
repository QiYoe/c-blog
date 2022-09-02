<template>
  <Layout>
    <template #doc-after>
      <Waline />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>