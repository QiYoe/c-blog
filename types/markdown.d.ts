import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import { IThemeRegistration } from 'shiki';

export type ThemeOptions =
  | IThemeRegistration
  | { light: IThemeRegistration; dark: IThemeRegistration }

export interface MarkdownOptions extends MarkdownIt.Options {
  lineNumbers?: boolean
  config?: (md: MarkdownIt) => void
  anchor?: {
    permalink?: anchor.AnchorOptions['permalink']
  }
  attrs?: {
    leftDelimiter?: string
    rightDelimiter?: string
    allowedAttributes?: string[]
    disable?: boolean
  }
  theme?: ThemeOptions
  // https://github.com/nagaozen/markdown-it-toc-done-right
  toc?: any
  externalLinks?: Record<string, string>
}
