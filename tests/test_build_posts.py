"""Exercise the publishing boundary, generated language URLs and safe unpublishing."""
from contextlib import redirect_stdout
from html.parser import HTMLParser
from pathlib import Path
from tempfile import TemporaryDirectory
import io
import json
import shutil
import subprocess
import sys
import unittest
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'scripts'))
from build_posts import build

class HTML(HTMLParser):
    def __init__(self): super().__init__(); self.nodes=[]
    def handle_starttag(self,tag,attrs): self.nodes.append((tag,dict(attrs)))

class PublishingTests(unittest.TestCase):
    def setUp(self):
        self.temp=TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name)
        for name in ['templates/post.html','posts/index.html','index.html','creations/index.html']:
            target=self.root/name; target.parent.mkdir(parents=True,exist_ok=True)
            shutil.copyfile(ROOT/name,target)
        self.folder=self.root/'content/posts/20260901-example';self.folder.mkdir(parents=True)
        self.meta={'date':'2026-09-01','draft':False,'title':{'zh':'标题 "甲" & 乙','en':'Title "A" & B'},'summary':{'zh':'完整中文简介','en':'A complete English summary'}}
        self.save_meta()
        (self.folder/'zh.md').write_text('中文内容。\n\n## 小节 {#section}\n\n```python\nprint("<hello>")\n```\n')
        (self.folder/'en.md').write_text('English content.\n\n## Section {#section}\n\n```python\nprint("<hello>")\n```\n')
    def save_meta(self): (self.folder/'post.json').write_text(json.dumps(self.meta))
    def build(self,check=False):
        with redirect_stdout(io.StringIO()): return build(self.root,check=check)
    def test_both_urls_are_readable_and_ids_are_unique(self):
        outputs=self.build()
        for lang,prefix in [('zh',''),('en','en/')]:
            html=outputs[f'{prefix}posts/20260901-example/index.html']
            parser=HTML();parser.feed(html)
            visible=[a for tag,a in parser.nodes if a.get('data-translation') and 'hidden' not in a]
            self.assertEqual([a['data-translation'] for a in visible],[lang])
            ids=[a['id'] for _,a in parser.nodes if 'id' in a]
            self.assertEqual(len(ids),len(set(ids)))
            self.assertIn('section',ids)
            self.assertIn('Title &quot;A&quot; &amp; B',html)
            self.assertIn('print',html)
        english=ET.fromstring(outputs['index.en.xml'])
        self.assertEqual(english.findtext('./channel/item/title'),self.meta['title']['en'])
        self.assertIn('/en/posts/',english.findtext('./channel/item/link'))
        self.assertEqual(english.findtext('./channel/language'),'en')
    def test_missing_translation_fails_before_any_output_write(self):
        before=(self.root/'index.html').read_bytes()
        (self.folder/'en.md').unlink()
        with self.assertRaises(FileNotFoundError): self.build()
        self.assertEqual(before,(self.root/'index.html').read_bytes())
        self.assertFalse((self.root/'posts/20260901-example/index.html').exists())
    def test_placeholder_and_empty_summary_cannot_publish(self):
        (self.folder/'en.md').write_text('TODO Write this translation')
        with self.assertRaisesRegex(ValueError,'en.md'): self.build()
        (self.folder/'en.md').write_text('Finished translation.')
        self.meta['summary']['en']=''; self.save_meta()
        with self.assertRaisesRegex(ValueError,'summary.en'):self.build()
    def test_unfinished_drafts_do_not_leak_to_indexes(self):
        self.meta['draft']=True;self.save_meta();(self.folder/'en.md').unlink()
        outputs=self.build()
        self.assertNotIn('20260901-example',''.join(outputs.values()))
    def test_build_is_repeatable_and_check_detects_edits_without_writing(self):
        first=self.build();self.assertEqual(first,self.build());self.build(check=True)
        target=self.root/'posts/20260901-example/index.html';target.write_text('manual change')
        with self.assertRaisesRegex(ValueError,'out of date'):self.build(check=True)
        self.assertEqual(target.read_text(),'manual change')
    def test_unpublishing_removes_only_owned_article_pages(self):
        self.build();self.meta['draft']=True;self.save_meta();self.build()
        self.assertFalse((self.root/'posts/20260901-example/index.html').exists())
        self.assertFalse((self.root/'en/posts/20260901-example/index.html').exists())
        self.assertTrue((self.folder/'zh.md').exists())
    def test_manual_file_is_not_deleted_when_unpublishing(self):
        self.build();target=self.root/'posts/20260901-example/index.html';target.write_text('not generated')
        self.meta['draft']=True;self.save_meta()
        with self.assertRaisesRegex(ValueError,'not owned'):self.build()
        self.assertEqual(target.read_text(),'not generated')
    def test_new_post_creates_local_draft_and_will_not_overwrite_it(self):
        script=self.root/'scripts/new_post.py';script.parent.mkdir();shutil.copyfile(ROOT/'scripts/new_post.py',script)
        args=[sys.executable,str(script),'weekend','--date','2026-09-01']
        result=subprocess.run(args,capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr)
        folder=self.root/'.drafts/weekend'
        self.assertTrue(json.loads((folder/'post.json').read_text())['draft'])
        self.assertTrue((folder/'en.md').exists())
        (folder/'zh.md').write_text('My private draft')
        self.assertNotEqual(subprocess.run(args,capture_output=True).returncode,0)
        self.assertEqual((folder/'zh.md').read_text(),'My private draft')

if __name__=='__main__':unittest.main()
