"""Import a dated dealer workbook. Raw rows and identifiers never leave memory."""
import argparse
import collections
import datetime as dt
import json
from pathlib import Path
import re
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def read_book(path):
    with zipfile.ZipFile(path) as z:
        strings = [''.join(x.itertext()) for x in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS)]
        def read(index):
            result = []
            for row in ET.fromstring(z.read(f'xl/worksheets/sheet{index}.xml')).findall('.//m:sheetData/m:row', NS):
                data = {}
                for cell in row.findall('m:c', NS):
                    v = cell.find('m:v', NS)
                    text = v.text if v is not None else ''
                    if cell.get('t') == 's' and text:
                        text = strings[int(text)]
                    if cell.get('t') == 'inlineStr':
                        text = ''.join(cell.find('m:is', NS).itertext())
                    data[re.sub(r'\d', '', cell.get('r'))] = text or ''
                result.append(data)
            return result
        primary, secondary = read(1), read(2)
        assert primary[0].get('P') == '모델명' and primary[0].get('AK') == '재고 상태', '원본 열 구조 확인 필요'
        assert secondary[0].get('L') == 'Model' and secondary[0].get('E') == '판매여부', '원본 열 구조 확인 필요'
        return primary[1:], secondary[1:]

def normalize(s):
    name = re.sub(r'\s+', ' ', s.replace('Mercedes-', '').replace('Coupé', 'Coupe').replace('EXCLUSIVE', 'Exclusive').replace('AVANTGARDE', 'Avantgarde').replace('Hybrid', 'HYBRID')).strip()
    if name.casefold() in ('c 200 final edition', 'c 200 amg line special edition'):
        return 'C 200 AMG Line Special Edition'
    return name


TRANSLATIONS = {
    'ARTICO man-made leather / DINAMICA microfibre black with crystal grey': '아티코 인조 가죽/다이나미카, 블랙/크리스탈 그레이',
    'elbaite green metallic': '엘바이트 그린 메탈릭', 'lavender silver metallic': '라벤더 실버 메탈릭',
    'ARTICO man-made leather beige': '아티코 인조 가죽, 베이지',
    'Leather macchiato beige / black': '가죽, 마키아토 베이지/블랙',
    'Nappa leather hazelnut brown / espresso brown': '나파 가죽, 헤이즐넛 브라운/에스프레소 브라운',
    'black ARTICO man-made leather': '아티코 인조 가죽, 블랙', 'leather black': '가죽, 블랙',
    'designo nappa leather black/titanium grey pearl': '나파 가죽, 블랙/티타늄 그레이 펄',
}
def korean(s):
    s = TRANSLATIONS.get(s, s).replace('MANUFAKTUR', '마누팍투어').replace('ARTICO', '아티코')
    if not s or re.fullmatch(r'[0-9A-Z]+', s):
        raise ValueError('한글 색상명 확인 필요: ' + s)
    if re.search(r'[a-z]{3,}', s):
        raise ValueError('색상 번역 필요: ' + s)
    return s

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('workbook')
    ap.add_argument('--as-of', required=True, type=dt.date.fromisoformat)
    args = ap.parse_args()
    primary, secondary = read_book(args.workbook)
    serial = (args.as_of - dt.date(1899, 12, 30)).days
    by_id = {r.get('N'): r for r in primary if r.get('N')}
    colors = json.loads((ROOT / 'colors.js').read_text().split('=', 1)[1].strip().rstrip(';'))
    def color_name(model, code, kind):
        family = re.search(r'GLA|GLB|GLC|GLE|GLS|EQA|EQB|EQE|EQS|CLE|CLA|GT|SL|[ACEGS](?= )', model).group()
        candidates = []
        for name, palette in colors.items():
            if family.lower() not in name.lower().replace('-class', ''):
                continue
            for color in palette[kind]:
                if color['code'].rstrip('UA').zfill(3) == code.zfill(3):
                    candidates.append(color['name'])
        candidates = list(dict.fromkeys(candidates))
        if len(candidates) != 1:
            print(f'색상명 확인 필요: {model} {kind} {code} (공개 화면에는 코드 대신 상담 확인 표시)')
            return '색상 상담 확인'
        return candidates[0]
    def due(value):
        try:
            return 0 < float(value) <= serial
        except (ValueError, TypeError):
            return False
    def blocked(r):
        return r.get('B') == '배정재고' or r.get('AN') in ('계약 확정', '가계약 체결', '배정 완료') or r.get('AK') == '배정' or r.get('AS') != '판매 가능' or str(r.get('AO', '')).strip().upper() == 'YES'
    units = {}
    marks = {}
    def mark(category, benefit=''):
        return (1 if '위탁' in category else 0) | (2 if '전시' in category else 0) | (4 if re.search(r'hot\s*car|핫카', benefit, re.I) else 0) | (8 if re.search(r'\+?\s*1\s*[%％]', benefit) and ('전시' in category or '전시' in benefit) else 0)
    for r in primary:
        if not r.get('N') or blocked(r) or r.get('AK') != '미배정' or r.get('AN') != '미배정':
            continue
        if r.get('AL') != '입고 물량' or r.get('AP') in ('선적', 'Vehicle produced', 'Purchase order created', 'Invoice verification created') or not due(r.get('J')):
            continue
        units[r['N']] = (normalize(r['P']), 'MY' + r['W'][-2:], korean(r.get('Y', '')) + (' / ' + korean(r['Z']) if r.get('Z') else ''), korean(r.get('AA', '')))
        marks[r['N']] = mark(r.get('B', '') + r.get('AG', ''))
    added = 0
    for r in secondary:
        if not r.get('H') or not r.get('L') or r.get('E', '') != '' or not due(r.get('F')):
            continue
        p = by_id.get(r['H'])
        if p and blocked(p):
            continue
        marks[r['H']] = marks.get(r['H'], 0) | mark(r.get('C', ''), r.get('B', ''))
        if r['H'] in units:
            continue
        model = normalize(r['L'])
        exterior = p.get('Y') if p else color_name(model, r.get('P', ''), 'exterior')
        interior = p.get('AA') if p else color_name(model, r.get('Q', ''), 'interior')
        if p and p.get('Z'):
            exterior += ' / ' + p['Z']
        units[r['H']] = (model, 'MY' + r['R'][-2:], korean(exterior), korean(interior))
        added += 1
    groups = collections.Counter(units.values())
    rows = [dict(zip(('name', 'my', 'exterior', 'interior', 'count'), (*key, count))) for key, count in sorted(groups.items())]
    group_marks = collections.defaultdict(int)
    for unit, combination in units.items():
        group_marks[combination] |= marks.get(unit, 0)
    for row, combination in zip(rows, sorted(groups)):
        row['accent'] = group_marks[combination]
    assert rows, '출고 가능한 재고가 없어 교체 중단'
    payload = {'asOf': args.as_of.isoformat(), 'combinations': rows}
    pending = ROOT / 'ready-stock-data.js.tmp'
    pending.write_text('/* Public combinations only; generated by scripts/import-stock.py. */\nwindow.BENZ_READY_STOCK = ' + json.dumps(payload, ensure_ascii=False, indent=2) + ';\n')
    pending.replace(ROOT / 'ready-stock-data.js')
    print(json.dumps({'vehicles': len(units), 'combinations': len(rows), 'models': len(set((r['name'], r['my']) for r in rows)), 'secondaryAdded': added}, ensure_ascii=False))

if __name__ == '__main__':
    main()
