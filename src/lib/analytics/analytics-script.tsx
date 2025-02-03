import Script from "next/script";
import type { ReactNode } from "react";

import { matomoBaseUrl, matomoId } from "~/config/analytics.config";

export function AnalyticsScript(): ReactNode {
	if (matomoId == null) {
		return null;
	}

	return <Script dangerouslySetInnerHTML={{ __html: script }} id="analytics" />;
}

const script = `var _paq = window._paq = window._paq || [];
_paq.push(['disableCookies']);
_paq.push(['enableHeartBeatTimer']);
_paq.push(['trackPageView']);
(function() {
  var u="${String(matomoBaseUrl)}";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '${String(matomoId)}']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();`;
