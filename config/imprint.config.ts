import { assert } from '@stefanprobst/assert'
import { createUrl } from '@stefanprobst/request'

import type { Locale } from '~/config/i18n.config'

const redmineId = process.env['NEXT_PUBLIC_REDMINE_ID']

/**
 * @see https://fundament.acdh.oeaw.ac.at/imprint-service
 */
export function createImprintUrl(locale: Locale): URL {
  assert(
    redmineId != null,
    'Failed to generate imprint. Please provide a redmine service issue via NEXT_PUBLIC_REDMINE_ID environment variable.',
  )

  return createUrl({
    baseUrl: 'https://shared.acdh.oeaw.ac.at',
    pathname: '/acdh-common-assets/api/imprint.php',
    searchParams: {
      serviceID: redmineId,
      outputLang: locale,
    },
  })
}
