import type { Plurals as _Plurals } from '@/app/i18n/dictionaries'
import type { Locale } from '~/config/i18n.config'

export interface Dictionary {
  app: {
    'change-language-to': string
    'toggle-color-scheme': string
  }
  language: Record<Locale, string>
  page: {
    'skip-to-main-content': string
  }
  pages: {
    '404': {
      metadata: {
        title: string
      }
    }
    '500': {
      metadata: {
        title: string
      }
    }
    home: {
      metadata: {
        title: string
      }
    }
    imprint: {
      metadata: {
        title: string
      }
    }
    'geo-visualisation': {
      metadata: {
        title: string
      }
    }
    'network-visualisation': {
      metadata: {
        title: string
      }
    }
  }
  home: {
    'explore-graph': string
    'explore-map': string
    intro: HtmlString
  }
  form: {
    'nothing-found': string
    search: string
    'remove-item': string
  }
}
