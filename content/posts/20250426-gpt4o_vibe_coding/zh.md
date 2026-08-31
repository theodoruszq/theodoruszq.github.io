<h2 id="motivation">Motivation</h2><p>最近发现自己之前下载的和看过的图书实在太多了，之前使用文件夹进行整理过一个版本。但是这非常混乱，我想找某本读过的书，或者是看看之前对这本书的印象怎么样，都会很费力气，正好最近用GPT4o用的非常之多，正好想用他来写一个图书管理软件。</p>
<p>这个软件应该包含什么功能呢，我想的很简单：</p>
<ul>
<li>首先它需要能够列出所有的图书，然后我能很方便的通过关键字搜索</li>
<li>它应该有记录的能力，不是纯静态网页，我能够对一本书记录下“在读/已读/不想读”等等的状态，并且我还能够记录下对这本书的打分情况</li>
<li>我需要额外记录下对某本书的简单笔记（一句话等等），需要一个字段</li>
<li>我应该在局域网下很方便的访问这个网页，不需要在我的Mac-mini上启动任何服务才行，NAS需要承接所有服务器的功能</li>
<li>这个系统后续应该可以很方便的用于影视、音乐等等媒体的管理记录等等</li>
</ul>
<p>在开始之前，我想说我没有什么前端和后端经验，我了解一点点SQLite的知识，我了解一些HTML和CSS的知识，但是我不知道现代前后端框架是如何运作的，我从未真正完成过一个完整的前后端项目，这对我而言其实是一个难题。</p>
<h2 id="vscode-connection-failed">VSCode Connection Failed</h2><p>这里还有个非常有意思的小插曲，我之前通过 VSCode+SSH 连接我的 NAS 的，我可以很方便的编辑我的代码和操作数据，但是自 VSCode-V1.99 之后，我就发现我连接失败了，但是我的SSH又是正常的，这非常的诡异，因为VSCode Remote就是基于SSH的啊。</p>
<p>这是为什么呢？我非常的纳闷，在公司，我每天都用VSCode连接远程服务器写代码，但是在家为什么无法连接我的NAS了呢？我开始找Log，发现是<code>libc.so</code>出了问题，之前可能都是glibc的，但是可以发现它需要musl版本的。</p>
<div class="highlight"><pre tabindex="0" class="chroma"><code class="language-bash" data-lang="bash"><span class="line"><span class="cl">theodoruszq@QiangNAS:~/.vscode-server$ ./code-17baf841131aa23349f217ca7c570c76ee87b957 
</span></span><span class="line"><span class="cl"><span class="o">[</span>2025-04-24 23:02:40<span class="o">]</span> error This machine does not meet Visual Studio Code Server<span class="err">&#39;</span>s prerequisites, expected either...
</span></span><span class="line"><span class="cl">  - find /lib/ld-musl-x86_64.so.1, which is required to run the Visual Studio Code Server in musl environments
</span></span></code></pre></div><p>于是我就开始折腾，直接问GPT4o怎么编译musl版本的glibc，它很快就给了我答案，但是我发现有另外的问题。我需要在NAS上编译musl的glibc，但是需要Entware和opkg来安装cmake和gcc这些编译开发工具，于是我再次问GPT4o，我了解到Entware和opkg是一个东西，按照GPT4o给的指示，我非常轻松且快捷的安装好了opkg，然后编译musl的glibc也非常顺利，我以为把so加到系统里面去就完事大吉了，沾沾自喜。</p>
<p>但是意外果然发生，VSCode的主入口提示我Permission Denied，我以为是权限问题，把vscode-server目录挪来挪去，以为是因为目录没有exec权限，尝试半天并不是，最后经过一系列的错误交互和询问，最后给我的答案是：</p>
<blockquote>
<p>你下载的是 MUSL 编译版 VSCode Server，用在 glibc 系统上，内核直接拒绝执行，表现为：❌ Permission denied，而不是 Exec format error！</p>
</blockquote>
<p>随后它给了我解决办法，在NAS上手动下载vscode-server（glibc版本），重新连接VSCode即可，确实能工作了，不过我在Github上找到其实简单建立一个文件可以暂时绕过这个问题 <code>touch /tmp/vscode-skip-server-requirements-check</code>，我现在也不想知道到底是哪个起了作用，能用就行，能用就行，哈哈。</p>
<h2 id="gpt4o-vibe-coding">GPT4o Vibe Coding</h2><p>GPT4o最近一个月给我带来的震撼太多了，从生成图片到日常的对话聊天，非常之好用。我一开始想让他给我一些整理建议的，但是他建议我写一个软件管理系统。这是我给它的第一句Prompt，它给我推荐了FastAPI+React框架：</p>
<div class="highlight"><pre tabindex="0" class="chroma"><code class="language-text" data-lang="text"><span class="line"><span class="cl">那你要不写个自动整理脚本吧，需要有前端，我得很方便的标记出，哪些我看过，哪些我在读，心得，什么时候开始读，什么时候结束的，感受如何，什么框架比较好
</span></span></code></pre></div><p>哐哐哐一堆写，GPT4o先写了后端，直接使用了SQLite，然后用FastAPI搭建，一番操作猛如虎，确实感觉好像还挺work的，稍微用Prompt改了几个版本，也都蛮好的，基本都是一次运行，没有什么Bug或者错误。</p>
<p>然后就来到了前端，我本来想着都放NAS上得了，但是我好像错了，它React的很多依赖NAS好像都搞不定，并且NAS只需要最后编译的静态网页就完事了，于是我放在Mac上一顿写，用React TS的模版，然后只修改App.tsx就可以搞定所有的事情了。当然还是有一些波折的，一开始网页的宽度非常奇怪，对不齐，而且挤到一起去了，搞半天发现原来是生成的模版的CSS感觉是为手机端服务的，直接全部注释就好了。</p>
<p>最后，还有一些小问题，比如App.tsx的前端IP应该怎么写，以为127.0.0.1可以，然而并不行，需要写服务端的IP，然后还需要开启群晖的WebStation，按照GPT4o的指示一步步开启就好了。</p>
<p>总体的感觉就是，随便你有任何问题，见招拆招，遇事不决，就问GPT4o，帮我了解了很多知识，现在真的是我的老师和生活助手了。</p>
<p>截图一张最后的成品图看看效果，哈哈，非常有成就感。</p>
<figure><img src="/images/20250426-gpt4o_manager.jpg" alt="NAS 图书管理软件界面" loading="lazy" />
</figure>
<p>当然，这个系统还是有不少问题的，美观度不够，没有书籍封面（可以都用GPT4o生成），没有按照打分排序的选项，没有点击直达的功能，这些都是非常有意思的小需求，但是这个系统都是可以被更改的，前端和后端的核心文件只有2个。</p>
<h2 id="coda">Coda</h2><p>GPT4o是我2025年发现的最值得的产品之一，它强大的能力让我的脑力和时间有了很大的结余，我可以站在更高的角度思考问题，并且虽然它有幻觉，但是真正真正的帮我教会了很多知识，比如FlowMatching，EulerSampler，DDIM等等，思路非常清晰，还可以帮我看论文，写TamperMonkey的JS代码，杠杆作用非常大。在2023和2024年的时候，我当时使用感觉还没有这么强，但是感觉今年明显是上了一个台阶，有了一些质的变化。</p>
<p>当然他也有很多不足，这个系统我用了整整44轮的Prompt轮询才得到基本满意的答案，它有时也困惑，毕竟我给它的是只言片语，它并没有看到我的操作界面和环境，但是毕竟我也是一名行业内人士，我给他必要的信息就好了，方向给的正确，它能够知道怎么走就行。</p>
<p>我也渐渐发觉，GPT4o轻易的打破了专家之间的壁垒，我现在可以很轻松的了解一些Linux内核的知识，或者一些Docker相关的知识，还有一些编译原理的知识，这些知识我在大学的时候没有接触到或者没有学好，但是现在，好像这些壁垒被消融掉了，包括我自己所在的视觉算法领域。</p>
<p>对人工智能拭目以待吧，这是一个激动人心的时代，是最好的时代，可能也是最坏的时代。</p>
<p>Qiang<br/>
2025/04/26, Shenzhen</p>
