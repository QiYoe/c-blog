<template>
  <p
    class="codepen"
    :data-theme-id="theme"
    :data-preview="preview || null"
    :data-editable="editable"
    :data-height="height"
    :data-default-tab="tab"
    :data-user="user"
    :data-slug-hash="slug"
    :data-pen-title="title"
    :data-embed-version="version"
    :style="`height: ${height}px`">
    <span>See the Pen <a :href="href">{{ title }}</a>
    by {{ name || user }} (<a :href="`https://codepen.io/${user}`">@{{user}}</a>)
    on <a href="https://codepen.io">CodePen</a>.</span>
  </p>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
      required: true,
    },

    slug: {
      type: String,
      default: null,
      required: true,
    },

    tab: {
      type: String,
      default: 'result',
    },

    team: {
      type: Boolean,
      default: false,
    },

    user: {
      type: String,
      default: 'qiyoe',
    },

    name: {
      type: String,
      default: null,
    },

    height: {
      type: Number,
      default: 300,
    },

    theme: {
      type: String,
      default: 'dark',
    },

    preview: {
      type: Boolean,
      default: true,
    },

    editable: {
      type: Boolean,
      default: true,
    },

    version: {
      type: String,
      default: null,
    }
  },
  mounted() {
    const codepenScript = document.createElement('script')
    codepenScript.setAttribute('src', 'https://cpwebassets.codepen.io/assets/embed/ei.js')
    codepenScript.async = true
    this.$el.appendChild(codepenScript)
  },
  computed: {
    href() {
      return `https://codepen.io/${this.user}/pen/${this.slug}`
    }
  },
}
</script>

<style>
.codepen {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  margin: 1em 0;
  padding: 1em;
}
</style>
