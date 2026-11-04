"""Fixture regression: exclude allocations, sales, restrictions, future dates; dedupe."""
import contextlib
import datetime as dt
import io
import json
from pathlib import Path
import runpy
import sys
import tempfile

module = runpy.run_path(str(Path(__file__).with_name('import-stock.py')))
main = module['main']
base = dict(N='one', B='전국재고', AN='미배정', AK='미배정', AS='판매 가능', AL='입고 물량', AP='PDI 완료', J='46000', P='E 200 EXCLUSIVE', W='2026', Y='폴라 화이트', AA='가죽, 블랙', Q='PRIVATE MEMO', D='PRIVATE LOCATION')
rows = [base]
for number, updates in enumerate([
    {'B':'배정재고'}, {'AN':'계약 확정'}, {'AN':'가계약 체결'}, {'AO':'YES'},
    {'AS':'판매 제한'}, {'AK':'배정', 'AN':'배정 완료'},
    {'J':'50000'}, {'J':''}, {'AL':'예정 물량'}, {'AP':'선적'}
]):
    rows.append(dict(base, N=str(number), **updates))
secondary = [dict(H='one', L='E 200 EXCLUSIVE', R='2026', E='', F='46000', C='전시차재고', B='Hot Car [+1%] 전시차특별할인프로그램', O='PRIVATE MEMO')]
secondary += [dict(H='sold', L='E 200', E='판매완료', F='46000'), dict(H='demo', L='E 200', E='데모카완료', F='46000')]
with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    (root / 'colors.js').write_text('window.BENZ_COLORS = {};')
    main.__globals__.update(ROOT=root, read_book=lambda path: (rows, secondary))
    original = sys.argv
    sys.argv = ['import-stock.py', 'fixture.xlsx', '--as-of', '2026-10-30']
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            main()
    finally:
        sys.argv = original
    output = (root / 'ready-stock-data.js').read_text()
    payload = json.loads(output.split('=', 1)[1].strip().rstrip(';'))
    assert len(payload['combinations']) == 1
    assert payload['combinations'][0]['count'] == 1
    assert payload['combinations'][0]['accent'] == 14
    assert 'PRIVATE' not in output
    assert 'Hot Car' not in output and '전시차' not in output and '1%' not in output
print('Import fixtures passed: allocations, contracts, sales, restrictions, future/unknown dates, shipping, duplicates and private columns.')
