最近终于完整的完成了一个自己的 App：[LumaLog: Prompt Library（图记）](/posts/20260927-ios_development_lumalog/)。初衷是一开始想着有很多很好看的图片，但是实在是找不到地方存放他们，存着存着，心里负担很重，历史的删还是不删，这都让我苦恼。提示词又很长，用一个txt保存也费劲。


## 我是如何开发的

我从未写过任何一个Swift App，原因很简单，我懒，我只会Python，训训模型什么的，之前自学过一段时间的Swift语法，但是觉得很枯燥无味，就没有继续了，也没有从头到位研究过底层的模型和多线程机制。

但是有了Codex之后，好像很多事情都变化了，我发现开发一个iOS App如此简单，我从GPT 5.6 Sol一直用到GPT 6 Astra，烧了不知道多少次Reset，因为模型其实挺傻的，他们对HTML好像很擅长，对于Swift UI我觉得还比较弱，各种Bug，可能Claude会好一些，但是我被封了两个号之后，慢慢失去了耐心，可能要出差到Singapore/Japan才能使劲的蹬一下这个模型吧，笑：）。

Anyway，最后还是成功了ship了一个版本，我非常开心，我自己用下来，虽然还有不少瑕疵，但是总算是一个能用的版本，能满足我的一些需求。


<figure class="image-gallery">
<figure><a href="/posts/20260927-ios_development_lumalog/assets/ios-timeline.jpg"><img src="/posts/20260927-ios_development_lumalog/assets/ios-timeline.jpg" alt="LumaLog iOS Timeline，按月份浏览收藏的作品" width="1320" height="2868" loading="lazy"></a><figcaption>按时间浏览作品。</figcaption></figure>
<figure><a href="/posts/20260927-ios_development_lumalog/assets/ios-detail.jpg"><img src="/posts/20260927-ios_development_lumalog/assets/ios-detail.jpg" alt="LumaLog iOS 详情页，图片与 Prompt、模型、评分一起保存" width="1320" height="2868" loading="lazy"></a><figcaption>把作品和创作记录放在一起。</figcaption></figure>
</figure>

然后就是Mac版本，这也并不容易，我好像是突然有了灵感，MCP这个和LumaLog在一起感觉是绝配。但是这没有我想的那么容易，Mac上的UI很容易出问题，Codex根本无法胜任，经过反复调试和验证，最终把这些问题逐一解决了。我发现MCP可以让我更懒了，比如我有了一个多啦A梦的小朋友画画，我和Codex说『参考那个多啦A梦生成一个天使兽』，Codex自己去我的Prompt库找，然后去生成，效果真的很不错。

<figure><a href="/posts/20260927-ios_development_lumalog/assets/04-reference-create.png"><img src="/posts/20260927-ios_development_lumalog/assets/04-reference-create.png" alt="Agent 读取 LumaLog 中的参考素材，继续创作" width="2880" height="1575" loading="lazy"></a><figcaption>从收藏的参考素材，延续新创作。</figcaption></figure>

<figure><a href="/posts/20260927-ios_development_lumalog/assets/05-agent-save.png"><img src="/posts/20260927-ios_development_lumalog/assets/05-agent-save.png" alt="Agent 把新作品和 Prompt 保存回 LumaLog" width="2880" height="1575" loading="lazy"></a><figcaption>保存作品，也留下起点。</figcaption></figure>


有的人会说，一个文件夹不就完事了，那么费劲干啥。可是文件夹我不喜欢，它不能回溯，也不能在手机上弄一个浮动的壁纸我每天都可以赏心悦目的看着，而且同步也麻烦，不好管理，LumaLog直接打通iCloud Drive，我没有任何存储的心智负担，可能我有一些精神洁癖吧。

<figure><a href="/posts/20260927-ios_development_lumalog/assets/mac-creation-library.png"><img src="/posts/20260927-ios_development_lumalog/assets/mac-creation-library.png" alt="LumaLog Mac 作品资料库和选中作品的 Prompt 详情" width="2880" height="1575" loading="lazy"></a><figcaption>Mac 上的作品资料库。</figcaption></figure>



## 上线之后

当然，上线之后肯定几乎是没有什么人购买的，2 USD的门槛还是挺高的，尤其是我并没有什么名气和宣发能力的情况下，Anyway，就像X上的那个自由工作者一样，Have Fun，这件事才是最重要的。

我还开发了其他的一些个人用起来非常爽的App，应该马上就会完成审核，感觉我可能还是更喜欢后AI时代，一个人有无限可能，虽然可能工作不保，没办法在互联网大厂慢悠悠的做事，被挤出来，但是挤出来之后呢，我可能有了自己的自由，有了自己的时间，可以更加从容的审视这个世界和自己。

可能我开发这个App，目的还是留下美把，最近在读蒋勋的 『美学四讲』，好像有一些共鸣。

- [了解 LumaLog：iOS、Mac 与 MCP](/posts/20260927-ios_development_lumalog/)
- [在 App Store 查看 LumaLog](https://apps.apple.com/cn/app/lumalog-prompt-library/id6816669352)
- [使用问题或建议，联系我](/posts/20260927-ios_development_lumalog/support/)


