# Lumalog development post and privacy policy

- `index.html`: development post placeholder at `/posts/20260927-ios_development_lumalog/`.
- `privacy/index.html`: public bilingual privacy policy at `/posts/20260927-ios_development_lumalog/privacy/`.
- `style.css`: styles shared by these pages.

The privacy policy currently mirrors `Release/PrivacyPolicy.txt` in the PromptKeep app project. When changing the app's data handling or policy wording, update both copies before publishing.

The current post page is a placeholder and is not listed by the site's blog generator. To write the actual post, create `content/posts/20260927-ios_development_lumalog/post.json`, `zh.md`, and `en.md` using the process in the site README, then run `scripts/build_posts.py`. The generated article will replace this placeholder `index.html`. The `privacy/` subpage is separate and will remain at the same URL.
