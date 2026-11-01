"""Merge the channel's public upload feed into a persistent video catalogue; no API key."""
import json, urllib.request, xml.etree.ElementTree as ET, unicodedata
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3nLPkOiDJhPKoTgUQ1GMgA'
ns = {'a':'http://www.w3.org/2005/Atom','yt':'http://www.youtube.com/xml/schemas/2015'}
with urllib.request.urlopen(URL, timeout=30) as response:
    feed = ET.fromstring(response.read())
latest = [{'id':e.findtext('yt:videoId',namespaces=ns),'title':unicodedata.normalize('NFC',e.findtext('a:title',namespaces=ns)), 'published':e.findtext('a:published',namespaces=ns)} for e in feed.findall('a:entry',ns)]
if not latest or any(not v['id'] or not v['title'] for v in latest):
    raise ValueError('Empty or invalid feed; preserving the existing catalogue')
path=ROOT/'benz-videos.json'
old=json.loads(path.read_text())['videos']
ids={v['id'] for v in latest}
path.write_text(json.dumps({'videos':latest+[v for v in old if v['id'] not in ids]}, ensure_ascii=False, indent=2)+'\n')
print(f'Catalogue: {len(latest)} recent uploads, previous videos preserved')
