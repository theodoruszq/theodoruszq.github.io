I finally finished and shipped an app of my own: [LumaLog: Prompt Library](/posts/20260927-ios_development_lumalog/). It started with a simple problem: I had so many beautiful images, but nowhere I really wanted to keep them. As they accumulated, they became a mental burden. Should I delete the old ones or not? Even that bothered me. And the prompts were so long that keeping them in text files was a chore, too.

## How I built it

I had never written a Swift app before. The reason is simple: I’m lazy. I know Python, mostly for things like training models. I once spent some time teaching myself Swift syntax, but found it so dry that I stopped. I had never properly explored the underlying models or how multithreading works, either.

But with Codex, a lot of things seemed to change. I discovered that developing an iOS app could be surprisingly easy. I went from GPT 5.6 Sol all the way to GPT 6 Astra, burning through more resets than I can remember. The models can be pretty clueless, though. They seem good at HTML, but I find them much weaker at SwiftUI, with bugs everywhere. Maybe Claude would have been better, but after two of my accounts were banned, I gradually lost patience. Perhaps I’ll need a business trip to Singapore or Japan before I can really put that model through its paces. Haha. 🙂

Anyway, I did eventually ship a version, and I was very happy about it. After using it myself, I can still see plenty of rough edges, but at least it works and meets some of my needs.

<figure class="image-gallery">
<figure><a href="/posts/20260927-ios_development_lumalog/assets/ios-timeline.jpg"><img src="/posts/20260927-ios_development_lumalog/assets/ios-timeline.jpg" alt="LumaLog iOS Timeline with saved creations grouped by month" width="1320" height="2868" loading="lazy"></a><figcaption>Browse work over time.</figcaption></figure>
<figure><a href="/posts/20260927-ios_development_lumalog/assets/ios-detail.jpg"><img src="/posts/20260927-ios_development_lumalog/assets/ios-detail.jpg" alt="LumaLog iOS entry details with artwork, prompt, model, and rating" width="1320" height="2868" loading="lazy"></a><figcaption>Keep the work and its creative record together.</figcaption></figure>
</figure>

Then came the Mac version, which wasn’t easy either. Somewhere along the way, inspiration struck: MCP and LumaLog felt like a perfect match. The implementation itself turned out to be straightforward—though Codex couldn’t handle it at all. I borrowed some of my wife’s Cursor subscription quota and got it done pretty quickly. I discovered that MCP lets me be even lazier. For example, I had a childlike drawing of Doraemon saved in my library. I told Codex, “Use that Doraemon picture as a reference and make an Angemon.” Codex went into my prompt library, found the reference, and generated the image. The result was really good.

<figure><a href="/posts/20260927-ios_development_lumalog/assets/04-reference-create.png"><img src="/posts/20260927-ios_development_lumalog/assets/04-reference-create.png" alt="An agent reads a saved LumaLog reference for a new creation" width="2880" height="1575" loading="lazy"></a><figcaption>Turn a saved reference into another creation.</figcaption></figure>

<figure><a href="/posts/20260927-ios_development_lumalog/assets/05-agent-save.png"><img src="/posts/20260927-ios_development_lumalog/assets/05-agent-save.png" alt="An agent saves new artwork and its prompt back to LumaLog" width="2880" height="1575" loading="lazy"></a><figcaption>Save the creation and its starting point.</figcaption></figure>

Some people might say, “Why go to all this trouble? Isn’t a folder enough?” But I don’t like folders for this. They don’t let me retrace the creative process, or turn a picture into a little floating wallpaper on my phone that I can enjoy every day. Syncing is a hassle, too, and the whole thing is difficult to manage. LumaLog connects directly to iCloud Drive, so I don’t have to think about where everything is stored. Maybe I’m a little obsessive about keeping my mental space tidy.

<figure><a href="/posts/20260927-ios_development_lumalog/assets/mac-creation-library.png"><img src="/posts/20260927-ios_development_lumalog/assets/mac-creation-library.png" alt="LumaLog Mac library with the selected artwork and its saved prompt" width="2880" height="1575" loading="lazy"></a><figcaption>The creative library on Mac.</figcaption></figure>

## After launch

Of course, hardly anyone has bought it since launch. Two US dollars is still a fairly high barrier, especially when I have neither much of a reputation nor much ability to promote it. Anyway, like that freelancer on X says: have fun. That’s what matters most.

I’ve also made a few other apps that I really enjoy using myself, and they should be through review soon. I think I might actually prefer this post-AI era: one person has so many possibilities. Of course, my job might not be safe. I might no longer be able to take things at a leisurely pace at a big tech company, and could end up being pushed out. But what happens after that? Perhaps I’ll have more freedom and time of my own, and be able to look at the world—and myself—with a little more calm.

Maybe what I really wanted from this app was to preserve beauty. I’ve been reading Chiang Hsun’s *Four Lectures on Aesthetics* lately, and something in it seems to resonate with me.

- [Explore LumaLog: iOS, Mac, and MCP](/posts/20260927-ios_development_lumalog/)
- [View LumaLog on the App Store](https://apps.apple.com/app/id6816669352)
- [Get in touch with questions or suggestions](/posts/20260927-ios_development_lumalog/support/)
