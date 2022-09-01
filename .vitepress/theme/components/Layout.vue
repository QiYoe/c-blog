<template>
  <Layout>
    <template #doc-after>
      <Gitalk v-if="frontmatter?.showComment ?? true" />
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