# LumaLog marketing page and privacy policy

- `index.html`: public product landing page at `/posts/20260927-ios_development_lumalog/`, including iOS screenshots, Mac MCP capabilities, App Store download, and author links.
- `privacy/index.html`: public bilingual privacy policy at `/posts/20260927-ios_development_lumalog/privacy/`.
- `support/index.html`: bilingual support page and contact email for App Store Connect.
- `about/index.html`: same product landing page at the existing marketing URL. Keep its content in sync with `index.html`; each page has its own canonical URL.
- `landing.css`: responsive product landing page styles.
- `landing-i18n.js`: complete Chinese/English landing-page copy. Uses the browser's first preferred language on initial visit (`zh-*` selects Chinese; other languages select English). The header language buttons save a namespaced local preference; blocked storage falls back gracefully. Support and privacy pages retain their existing bilingual content.
- `assets/`: original iOS and Mac screenshot assets and app icon used by the landing page.
- `style.css`: existing styles used by the support and privacy pages.

App Store: https://apps.apple.com/app/id6816669352
Author: https://theodoruszq.github.io/ and https://github.com/theodoruszq
MCP and Agent tools are Mac-only; do not imply these are available in the iOS app.

The privacy policy currently mirrors `Release/PrivacyPolicy.txt` in the PromptKeep app project. When changing the app's data handling or policy wording, update both copies before publishing.

This directory is maintained as a static product page and is not listed by the site's blog generator. Do not create a generated post with the same slug: its article would replace the landing page `index.html`. Use a separate slug for a development article. The support and privacy pages remain at their existing URLs.
