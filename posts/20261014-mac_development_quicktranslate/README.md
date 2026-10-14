# QuickTranslate public pages

- Marketing: https://theodoruszq.github.io/posts/20261014-mac_development_quicktranslate/
- Support: https://theodoruszq.github.io/posts/20261014-mac_development_quicktranslate/support/
- Privacy: https://theodoruszq.github.io/posts/20261014-mac_development_quicktranslate/privacy/
- About alias: https://theodoruszq.github.io/posts/20261014-mac_development_quicktranslate/about/

Bilingual static pages following the existing product-page structure. Publish this repository through its existing GitHub Pages workflow to make these URLs available. No App Store download URL is included until the real listing is available.

`index.html` and `about/index.html` share the same product content, with separate canonical URLs. Keep both in sync. `assets/app-icon.png` comes from the QuickTranslate project.

Copy reflects the App Store build and source reviewed on 2026-10-14: macOS 15+, local Vision OCR, Apple Translation or configured AI endpoints, memory-only translation cache, local JSON API-key storage. Update privacy and support content when app behavior changes. Do not describe credentials as encrypted or Keychain-only without changing the implementation.

This directory is maintained independently of the blog generator. Do not add a generated post with the same slug, which would overwrite the product landing page. No blog listing or generated sitemap entry is added.

Marketing pages redesigned from `Previews/appstore_screenshots.html`: lime accents, large headlines, five feature sections, original app screenshots, responsive layout, and Chinese/English switching (`landing.js`, no storage). Support and privacy keep their existing styles. Screenshot assets were copied from `Previews/assets/`. The reference’s Keychain claim is intentionally omitted because current credentials use local JSON storage.
