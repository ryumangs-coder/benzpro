"""Extract only customer-facing retail rows; never publish the PDF or partner data."""
import json
import re
from pathlib import Path
import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/mingookim/Downloads/(MBRO202611)_November MB Partner Communication Package.pdf')

def pct(s):
    found = re.findall(r'(\d+)\s*%', s or '')
    return int(found[-1]) if found else 0

rows = []
with pdfplumber.open(SOURCE) as pdf:
    for page in [3, 4]:
        for table in pdf.pages[page-1].extract_tables():
            for row in table:
                if len(row) != 15 or not row[3] or not (str(row[1]).startswith('MY2') or (row[1] == 'MY' and 'ceGdLeCs' in row[3])):
                    continue
                name = row[3].replace('\n', ' ').strip()
                year = 'MY27' if row[1] == 'MY2' else row[1]
                if 'registered' in name or 'reg GisTt' in name or 'trademark' in name:
                    name = 'M-AMG GT 43'
                if 'ceGdLeCs' in name:
                    name = 'GLC 300 4M electric (Incl. AMG Line / AMG Line+)'
                    year = 'MY27'
                raw = str(row[7] or '')
                nums = re.findall(r'(\d+)\s*%', raw)
                mbm = int(nums[0]) if nums else 0
                lease = mbm
                if 'OL/LTR' in raw:
                    lease = int(nums[-1])
                    if 'IF' not in raw:
                        mbm = 0
                rows.append({'my':year, 'name':name, 'cash':pct(row[5]) if '%' in str(row[5]) else None,
                    'cashWon':1000000 if '100만원' in str(row[5]) else 0,
                    'mbm':mbm, 'leaseAdd':lease, 'retain':pct(row[9]), 'conquest':pct(row[12]),
                    'conquestEW':'EW' in str(row[12]), 'ew':bool(row[6]), 'page':page})
                if name == 'GLC 300 4M electric (Incl. AMG Line / AMG Line+)':
                    rows[-1].update(cash=None, cashWon=0, mbm=0, leaseAdd=0, retain=1, conquest=0, ew=False)
                if year == 'MY27' and name in ['M-AMG GT 43', 'M-AMG GT 55 4M+']:
                    rows[-1]['retain'] = 2
assert len(rows) > 100
assert all(r['my'] in ['MY26', 'MY27'] for r in rows)
(ROOT / 'november-retail.js').write_text('/* Sanitized customer retail terms, November package pp.3–4. */\nwindow.NOVEMBER_RETAIL = ' + json.dumps(rows,ensure_ascii=False,indent=2) + ';\n')
print(f'Extracted {len(rows)} retail rows; no staff incentives, identifiers or source images exported.')
