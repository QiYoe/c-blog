import {
  HeadConfig,
  LocaleConfig,
  SiteData,
  PageData
} from './shared';
import { MarkdownOptions } from './markdown';

import { Options as VuePluginOptions } from '@vitejs/plugin-vue'

import {
  AliasOptions,
  UserConfig as ViteConfig,
} from 'vite'

export type RawConfigExports<ThemeConfig = any> =
  | UserConfig<ThemeConfig>
  | Promise<UserConfig<ThemeConfig>>
  | (() => UserConfig<ThemeConfig> | Promise<UserConfig<ThemeConfig>>)

  export interface SiteConfig<ThemeConfig = any>
  extends Pick<
    UserConfig,
    | 'markdown'
    | 'vue'
    | 'vite'
    | 'shouldPreload'
    | 'mpa'
    | 'lastUpdated'
    | 'ignoreDeadLinks'
    | 'buildEnd'
    | 'transformHtml'
  > {
  root: string
  srcDir: string
  site: SiteData<ThemeConfig>
  configPath: string | undefined
  themeDir: string
  outDir: string
  tempDir: string
  alias: AliasOptions
  pages: string[]
}

export interface UserConfig<ThemeConfig = any> {
  extends?: RawConfigExports<ThemeConfig>
  base?: string
  lang?: string
  title?: string
  titleTemplate?: string | boolean
  description?: string
  head?: HeadConfig[]
  appearance?: boolean
  themeConfig?: ThemeConfig
  locales?: Record<string, LocaleConfig>
  markdown?: MarkdownOptions
  lastUpdated?: boolean
  /**
   * Options to pass on to `@vitejs/plugin-vue`
   */
  vue?: VuePluginOptions
  /**
   * Vite config
   */
  vite?: ViteConfig

  srcDir?: string
  srcExclude?: string[]
  outDir?: string
  shouldPreload?: (link: string, page: string) => boolean

  /**
   * Configure the scroll offset when the theme has a sticky header.
   * Can be a number or a selector element to get the offset from.
   */
  scrollOffset?: number | string

  /**
   * Enable MPA / zero-JS mode
   * @experimental
   */
  mpa?: boolean

  /**
   * Don't fail builds due to dead links.
   *
   * @default false
   */
  ignoreDeadLinks?: boolean

  /**
   * Build end hook: called when SSG finish.
   * @param siteConfig The resolved configuration.
   */
  buildEnd?: (siteConfig: SiteConfig) => Promise<void>

  /**
   * HTML transform hook: runs before writing HTML to dist.
   */
  transformHtml?: (
    code: string,
    id: string,
    ctx: {
      siteConfig: SiteConfig
      siteData: SiteData
      pageData: PageData
      title: string
      description: string
      head: HeadConfig[]
      content: string
    }
  ) => Promise<string | void>
}


