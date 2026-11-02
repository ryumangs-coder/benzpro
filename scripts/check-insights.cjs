const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('home.js', 'utf8');
const start = source.indexOf('    function normalize(list)');
const end = source.indexOf('    function readCache()', start);
assert(start > 0 && end > start);
const normalize = vm.runInNewContext('(' + source.slice(start, end).trim() + ')');
// Public API fixture: status is intentionally absent, as observed 2026-11-02.
const publicPost = {slug:'public-guide', title:'공개 가이드', publish_at:'2026-11-02 12:00:00'};
assert.equal(normalize([publicPost]).length, 1);
assert.equal(normalize([{...publicPost, status:'published'}]).length, 1);
for (const status of ['draft', 'scheduled', 'private', '']) {
  assert.equal(normalize([{...publicPost, status}]).length, 0);
}
assert.equal(normalize([null, {}, {...publicPost, title:''}, {...publicPost, slug:''}]).length, 0);
assert.equal(normalize([publicPost, publicPost]).length, 1);
assert.equal(normalize(Array.from({length:15}, (_, i)=>({...publicPost, slug:'guide-'+i}))).length, 10);
assert.equal(normalize([{...publicPost, slug:'old', publish_at:'2026-10-01'}, publicPost])[0].slug, 'public-guide');
const html = fs.readFileSync('index.html','utf8');
assert(html.includes('3-year-isp-expiration-maintenance-checklist'));
assert(html.includes('mercedes-mbux-voice-control-commands-guide'));
assert(source.includes('var userPaused = true;'));
console.log('Insight public API/cache compatibility, explicit draft exclusion, invalid data, sorting, deduplication, limit and fixed guide links passed.');
