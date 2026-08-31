"""Create an ignored, bilingual draft without publishing anything."""
import argparse
from datetime import date
from pathlib import Path
import json
import re

ROOT=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('slug',help='Stable URL name, e.g. 20260901-weekend-notes')
parser.add_argument('--date',default=date.today().isoformat(),type=date.fromisoformat)
args=parser.parse_args()
if not re.fullmatch(r'[a-z0-9][a-z0-9_-]*',args.slug):
    parser.error('Use only lowercase letters, digits, hyphens and underscores.')
if (ROOT/'content/posts'/args.slug).exists():
    parser.error('A published source with this name already exists.')
folder=ROOT/'.drafts'/args.slug
if folder.exists(): parser.error('This draft already exists; nothing was overwritten.')
folder.mkdir(parents=True)
meta=dict(date=args.date.isoformat(),draft=True,title={'zh':'TODO 中文标题','en':'TODO English title'},summary={'zh':'TODO 一两句中文简介。','en':'TODO A short English summary.'})
(folder/'post.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
(folder/'zh.md').write_text('TODO 在这里写中文正文，不用重复标题。\n\n## 一个小标题 {#first-section}\n\n支持 **加粗**、[链接](https://example.com/) 和 Markdown 图片。\n')
(folder/'en.md').write_text('TODO Write the English version here, without repeating the title.\n\n## A section heading {#first-section}\n\nKeep matching heading IDs in both versions.\n')
print(f'Draft created: {folder}\nThis folder is ignored by Git. See README.md before publishing.')
