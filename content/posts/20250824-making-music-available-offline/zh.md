<h2 id="motivation">起因</h2>

<blockquote>
<p>这么多年以来，在音乐方面我非常讨厌订阅制，听一首歌，买了一份会员，然后下个月就不能用了，需要持续付费，这种感觉让我想当不爽，音乐又不是软件，它并没有持续更新的属性，而我的对新歌又没有那么热衷，我讨厌这种模式。从高中时代开始，我就有下载离线歌曲的习惯，大学会离线下载到Apple Music，最近需要会员的歌曲越来越多，音乐软件App也越来越臃肿，超多的按钮，超多的广告，而且还分门别类的收费，虽然不贵，但是我没有安全感，也没有选择权。</p>
</blockquote>

<p>那么我该怎么做呢，之前的我依赖Chrome Developer Mode，偷偷的打开开发者模式，然后找到音乐真正的下载链接，再通过wget之类的下载下来。但是就在昨天，我发现他们升级了，在Network Tab下面，我只能看到数据块和一些不知道被怎么编码的blob数据，没办法找到m4a/mp3的链接了。我又去github上找项目，看看是否有mgg音乐格式的解密软件，我也尝试问GPT5，GPT5差不多等于给我一个大耳巴子，收到DRM保护的音乐版权拒绝帮我分析加密过程和解密手段。</p>

<p>好吧，那就只能用最原始的办法了，内录，爆杀所有的加密方法。Apple的硬件质量非常好，对于我没有什么音乐质感追求的人而言，实在是足够了，这篇博客想具体记录下来在MacOS平台如何完成将想听的音乐存到本地，不依赖任何解密算法。</p>

<p>当然，提醒一下，得到的音乐文件不得用于任何商业目的，侵犯别人的劳动成果是不道德的，如果是个人使用，我觉得无伤大雅，权利在自己手中，任何人无权过问。</p>

<h2 id="setup">环境准备</h2>

<p>原理其实很简单，某音乐软件把音乐播放到硬件输出设备（e.g. Mac Mini Speaker）和我们搭建的虚拟硬件（e.g. BlackHole 2ch）上，然后我们播放音乐，通过录音软件直接在电脑系统内部采样音频，并存储为我们需要的音频文件，大概过程像下面这样：</p>

<figure><a href="/images/20250824-making-music-available-offline/offline-audio-flow.png"><img src="/images/20250824-making-music-available-offline/offline-audio-flow.png" alt="音乐经扬声器播放，并通过 BlackHole 与 Audacity 录制的流程图" width="2356" height="1019" loading="lazy"></a></figure>

<p>其实非常的简单，那我们先准备环境吧：</p>

<p>1️⃣ 首先下载Black hole软件（<a href="https://existential.audio/blackhole/">https://existential.audio/blackhole/</a>），这是虚拟声卡，可以将操作系统发出的声音转为数字信号，方便处理，很遗憾我暂时没有捐赠，等后续用的多了，考虑捐赠作者一波。软件很小，不超过1M，安装完成后（需要重启）在“System Settings -&gt; Search audio -&gt; Output”会发现多出一个虚拟设备。注意这里的2ch表示两声道，对于绝大部分用户而言已足够。</p>

<figure><a href="/images/20250824-making-music-available-offline/offline-blackhole-output.png"><img src="/images/20250824-making-music-available-offline/offline-blackhole-output.png" alt="macOS 声音设置中的 BlackHole 2ch 输出设备" width="968" height="412" loading="lazy"></a></figure>

<p>2️⃣ 然后在Spotlight中搜索“audio MIDI Setup.app”，这是苹果自带的音乐设置软件，其中MIDI表示Musical Instrument Digital Interface，这一步我们需要建立一个输出设备，同时输出到硬件和虚拟声卡上，如图：</p>

<figure class="image-gallery">
<figure><a href="/images/20250824-making-music-available-offline/offline-midi-setup.png"><img src="/images/20250824-making-music-available-offline/offline-midi-setup.png" alt="音频 MIDI 设置中的 MusicDump 多输出设备与漂移校正" width="1578" height="586" loading="lazy"></a></figure>

<figure><a href="/images/20250824-making-music-available-offline/offline-musicdump-output.png"><img src="/images/20250824-making-music-available-offline/offline-musicdump-output.png" alt="macOS 声音设置中的 MusicDump 输出设备" width="960" height="466" loading="lazy"></a></figure>
</figure>

<ul>
<li>Primary Device表示这个设备当作Clock Source（时钟源）：因为我们用了多设备，系统用这台主设备的时钟当基准，其他设备用“漂移校正（Drift Correction）”去对齐；</li>

<li>这里的Sample Rate 48kHz表示一秒钟对音频波形采样48000次，是一个非常高的频率了，人耳基本上无法分辨原声和采样后的结果了，何况音乐软件最好的音质的采样率基本都不超过48000次；</li>

<li>设置完毕后，我们应该能在输出设备中看到我们的多设备虚拟输出接口了（右图）。</li>
</ul>

<p>3️⃣ 我们需要下载开源的Audacity软件（<a href="https://www.audacityteam.org/">https://www.audacityteam.org/</a>），选择下载不包含Muse Hub的就行。这里我们需要设置一下输入和输出接口，点击“Audio Setup”，Playback Device选择Mac Mini Speaker，Recording Device选择Black Hole 2ch，Recording Channels选择2，Audio Settings中的SampleRate选择44kHz即可。</p>

<figure><a href="/images/20250824-making-music-available-offline/offline-audacity-setup.png"><img src="/images/20250824-making-music-available-offline/offline-audacity-setup.png" alt="Audacity 中的播放、录音设备和音频设置" width="2842" height="972" loading="lazy"></a></figure>

<h2 id="audio-resampling">音频重采样</h2>

<p>首先我们将Mac的输出设备选择为聚合设备（本文作者的名字是MusicDump），然后开启Audacity的录音按钮（红色圆点），之后迅速打开音乐软件（可能需要先开通一次会员），然后从头开始播放，可以看到Audacity正确的显示了重采样的波形图，音质应该是不错的。</p>

<p>然后就需要考虑导出了，我们前后应该都有空白需要处理，Audacity已经有现成的算子完成这个事情，点击顶部“Effect -&gt; Special -&gt; Truncate Silence”，设置你需要的参数即可，注意需要先选择（可以直接Command+A选择整段，或者你手动选择）你需要处理的音频部分才行。</p>

<p>最后就是存储部分了，也是最有意思的一部分，这里涉及到一些音乐基础知识，选择顶部“File -&gt; Export Audio”可以打开导出配置：</p>

<ul>
<li>WAV：无损，就是将采集到的数字信号完整保留下来，比如一秒有48000个采样点，每个点使用Signed 16bit存储，一般一个几分钟的音乐大概20～30M左右的样子；</li>

<li>MP3：有损，最通用的文件格式，这里采样率不变，但是通过比特率（一秒钟的容量大小，比如一秒钟只能在170kb～210kb左右），也有常量比特率，比如每秒固定192kb，以比特容量为Upper Bound，约束文件体积，这样的代价就是一些超高动态范围的数值会被砍掉；</li>

<li>M4A：有损，压缩算法比MP3略好，差不多256kbps能达到MP3 320kbps的音质效果。</li>
</ul>

<p>这样，你就完成了一首你喜欢音乐的本地存储，完全绕开了任何复杂的音乐加解密算法。</p>

<h2 id="coda">尾巴</h2>

<p>记得多年前读和菜头的时候，一篇文章的标题写的是 “捍卫你的权利”。对我而言，能够自由的下载视频、音频，选择付费方式，可能也是捍卫我的权利。</p>
