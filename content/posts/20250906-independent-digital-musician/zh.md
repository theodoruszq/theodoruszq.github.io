<p>前一段时间，我在YouTube上上传自己去Hong Kong办理港澳通行证的视频，用了陈奕迅的歌作为背景音乐，没想到YouTube直接说我侵权了，想想好像确实是这样。在中国的媒体上，版权意识淡薄，我传到小红书等等网站上不会有任何的警告。</p>

<p>最近又想把一些生活碎片传到YouTube，背景音乐是个大问题，有个AI这个强大工具之后，我决定制作自己的数字音乐，但是我并没有任何乐理基础。最终，我还是完成了这件事，成功的做出了完全属于自己的第一首纯音乐。</p>

<h2 id="suno-ai">SUNO AI</h2>

<p>早在中国的微信公众号上看到过Suno AI (<a href="https://www.suno.com">https://www.suno.com</a>)的宣传，我也一直以为他的效果很好。我剪辑视频的时候用的是Rain这首钢琴曲，效果很舒缓，我想直接输入Prompt，然后Suno AI的模型直接给我出一个最终的纯音乐就行。我使用的Prompt大概是这样的：</p>

<blockquote>
<p><code>Slow, peaceful piano solo with gentle flowing melody, creating a calm and soothing atmosphere.</code></p>
</blockquote>

<p>很遗憾，我尝试了5，6次，效果都不让我满意，我觉得AI生成的音乐非常平淡，没有激昂的情绪或者是舒缓的感觉，非常生硬。我也尝试把Rain的音乐特点带进去，但是尝试了4，5次之后决定放弃了。</p>

<p>和ChatGPT这个强大助手对话了之后，我觉得制作一个音乐好像没有那么困难，于是我觉得自己使用AI+Mac的GarageBand.app来制作纯音乐。</p>

<h2 id="crafting-song">Crafting Song</h2>

<p>确实，也非常有意思，音乐本质上就是一堆音符的排列组合，以及不同乐器的交织，更进一步说，这些可以用代码表述，而ChatGPT拥有这种能力。ChatGPT告诉我，他可以使用Python生成音乐的源编曲，然后我拖入GarageBand就可以播放和修改了。一个非常典型的代码过程是这样的：</p>

<hr />

<pre tabindex="0"><code># 1) 初始化工程
TEMPO ← 92                    # 速度
BEATS_PER_BAR ← 4             # 4/4，每小节4拍
create MIDI with 1 track on channel 0
set_tempo(track=0, time=0, bpm=TEMPO)

# 2) 便捷函数：把一个音写进轨道
function ADD_NOTE(pitch, start_beat, duration_beats, velocity):
    midi_add_note(track=0, channel=0, pitch, start_beat, duration_beats, velocity)

# 3) 定义和弦循环：C → G → Am → F（各自的三和弦音）
CHORDS ← &#091;
  ("C",  &#091;C,  E,  G ] as MIDI),
  ("G",  &#091;G,  B,  D ] as MIDI),
  ("Am", &#091;A,  C,  E ] as MIDI),
  ("F",  &#091;F,  A,  C ] as MIDI),
]

# 4) 左手伴奏（每小节）
#    低八度根音1拍 → 分解两颗八分（3度、5度）→ 再用根音延音2拍
function LEFT_HAND(triad, bar_start):
    (root, third, fifth) ← triad
    ADD_NOTE(root-12,  bar_start + 0.0, 1.0, 55)   # 低音
    ADD_NOTE(third-12, bar_start + 1.0, 0.5, 50)   # 分解八分
    ADD_NOTE(fifth-12, bar_start + 1.5, 0.5, 50)
    ADD_NOTE(root-12,  bar_start + 2.0, 2.0, 52)   # 延音覆盖后半小节

# 5) 右手旋律（每小节）
#    针对当前和弦名选择一个包含8个八分音符的“动机”，等距铺满整小节
function RIGHT_HAND(chord_name, bar_start):
    MOTIF_MAP ← {
        "C":  &#091;8个八分音符的音高序列],
        "G":  &#091;8个八分音符的音高序列],
        "Am": &#091;8个八分音符的音高序列],
        "F":  &#091;8个八分音符的音高序列],
    }
    motif ← MOTIF_MAP&#091;chord_name]
    for i in 0..7:
        pitch ← motif&#091;i]
        start ← bar_start + i * 0.5       # 每格半拍（八分）
        ADD_NOTE(pitch, start, 0.5, 70)

# 6) 主循环：写入 N 小节（约 1 分钟）
N_BARS ← 20
for bar_index in 0..N_BARS-1:
    (name, triad) ← CHORDS&#091;bar_index mod 4]       # C→G→Am→F循环
    bar_start ← bar_index * BEATS_PER_BAR
    LEFT_HAND(triad, bar_start)
    RIGHT_HAND(name,  bar_start)

# 7) 导出 MIDI 文件
write_midi_to("summer_style.mid")
print("生成完成")</code></pre>

<hr />

<p>我让ChatGPT直接输出了好几个版本，有偏Rain的，有偏久石让的，一开始我不熟悉GarageBand的各个选项是什么意思，截图问了模型好几次，最终我选了一个三种乐器交织的版本。虽然不熟悉这个App怎么使用的，但是最终我还是把每段的乐器给大体上设置好了，大致页面是这样。</p>

<figure><a href="/images/20250906-independent-digital-musician/musician-garageband.png"><img src="/images/20250906-independent-digital-musician/musician-garageband.png" alt="GarageBand 中由钢琴和弦乐组成的 Friday Ocean 编曲" width="3838" height="1176" loading="lazy"></a></figure>

<p>我试听了很多遍，间隔，速度等等，感觉效果还蛮不错的，最终我导出为音乐文件，整个制作过程就差不多结束了。</p>

<p>当然，这个音乐还没有达到我的预想，节奏比较单调，而且没有我预期中的音差和韵律，比我理想中的效果要差不少，我大概能打30～40分左右的样子，但是能走完整个生产流程，我还是比较开心的。</p>

<h2 id="shipping-song">Shipping Song</h2>

<p>我把编辑后的视频+自己的背景音的视频发到了YouTube上，虽然十几个小时寥寥无几的人观看，不过这好像没那么重要，我也找QQ音乐上传了自己的歌曲，成为了一位光荣的独立音乐人，你现在可以使用QQ音乐听我自己做的歌了。</p>

<figure class="video-embed">
<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/qE3Vs4zAqgI" title="Friday Ocean · YouTube" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>
<figcaption><a href="https://www.youtube.com/watch?v=qE3Vs4zAqgI" data-i18n="watchVideo">在 YouTube 观看视频</a></figcaption>
</figure>

<p>QQ音乐平台：theodoruszq《Friday Ocean》 <a href="https://c6.y.qq.com/base/fcgi-bin/u?__=qIYbtpqZvmqA">https://c6.y.qq.com/base/fcgi-bin/u?__=qIYbtpqZvmqA</a></p>

<p>哦，如果你觉得这首曲子不好听的话，你可以尝试多听几遍，可能就好听多了，哈哈 🙂</p>

<h2 id="coda">Coda</h2>

<p>这件事给我的感触比较大，在未来的AI世界，领域之间的门槛被大幅度缩小了。</p>

<p>比如现在我是一位软件工程师，我的音乐基础是5分左右，对应的，一位音乐专家可能有80～90分，但是通过AI，我可以创造出最少30分的作品。虽然相当初级，但是，如果自己更进一步，学习相关的知识（甚至也通过AI），可以更好的操纵AI得到60分甚至70分的作品。</p>

<p>我还有一些实践，这个目标领域如果放到其他不熟悉的领域也是有效的，比如写一本LaTeX书籍，我对LaTeX只有比较浅的了解，但是用了AI之后，我制作的LaTeX书籍的精美程度可能可以打50～60分（实话说，我对Overleaf上的一些模版并不满意），下面这两页就是我最近用LaTeX自印的，当年吴军博士的硅谷来信的一些摘录，可以看到，非常漂亮。</p>

<figure class="image-gallery">
<figure><a href="/images/20250906-independent-digital-musician/musician-latex-page-1.png"><img src="/images/20250906-independent-digital-musician/musician-latex-page-1.png" alt="使用 LaTeX 排版的硅谷来信摘录，第一页" width="2480" height="3508" loading="lazy"></a></figure>

<figure><a href="/images/20250906-independent-digital-musician/musician-latex-page-2.png"><img src="/images/20250906-independent-digital-musician/musician-latex-page-2.png" alt="使用 LaTeX 排版的硅谷来信摘录，第二页" width="2480" height="3508" loading="lazy"></a></figure>
</figure>

<p>总之，AI给我的生活带来了巨变，把非常多的不可能变成了可能，我的视野也变得宽广，感觉自己可以做到之前不少不敢尝试或者门槛比较高的小项目。我相信未来是人类善用AI发挥自己的创造力、效率、服务甚至娱乐的时代。当然，原理性的东西还是不可或缺，在做任何事情之前我们得确保这一点，系统是怎么工作的，然后才是怎么工作的更好的问题。</p>
