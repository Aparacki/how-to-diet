import {color, spacing} from '@shared/utils/css-helpers'

export const APP_TITLE = 'Digital Sign'
export const SYNCANO_PROJECT_INSTANCE = process.env.SYNCANO_PROJECT_INSTANCE
export const SENTRY_DSN = process.env.SENTRY_DSN
export const RELEASE = process.env.RELEASE
export const SENTRY_ENV = process.env.SENTRY_ENV
export const UI = {
  contentWidth: '960px',
  spacing: spacing(32),
  radius: '5px',
  colors: {
    // Borders, lines, etc.
    ui: color('#d3d7e0'),
    primary: color('#494de4'),
    positive: color('#26c344'),
    negative: color('#EB5757'),
    // Main text color
    default: color('#56687C'),
    // Meta text color
    meta: color('#999999'),
    // Icons color
    icon: color('#ccc'),
  },
  width: {
    xxl: '1440px',
    xl: '1300px',
    lg: '1024px',
    l: '720px',
    toString: () => '769px',
    sm: '650px',
    xs: '480px',
  },
}
