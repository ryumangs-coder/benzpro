const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('bp-measure.js', 'utf8');
function setup(host = 'benzpro.co.kr', flag = '', title = '벤츠프로') {
  const listeners = {};
  const document = {
    title, readyState: 'loading', referrer: '',
    addEventListener(type, fn, capture) { (listeners[type] ||= []).push({ fn, capture }); },
    createElement() { return {}; }, head: { appendChild() {} }
  };
  const window = { localStorage: { getItem(key) { return key === 'benzpro-ga-test' ? flag : ''; } } };
  const location = new URL(`https://${host}/`);
  vm.runInNewContext(source, { window, document, location, URL, console });
  return { window, listeners, click(href, type = 'click') {
    const link = {
      href: new URL(href, location).href,
      getAttribute(key) { return key === 'href' ? href : null; },
      hasAttribute(key) { return key === 'href'; }, matches() { return false; },
      closest(selector) { return selector === 'a[href], [data-pick]' ? this : null; }
    };
    // A nested icon represents both static and dynamically inserted links.
    const event = { target: { closest() { return link; } },
      preventDefault() { assert.fail('Navigation must remain unchanged'); },
      stopPropagation() { assert.fail('Other listeners must remain active'); } };
    for (const listener of listeners[type] || []) listener.fn(event);
  }, events() { return Array.from(window.dataLayer || []).filter(a => a[0] === 'event' && a[1] === '카톡'); } };
}
for (const href of ['/chat', '/chat/?from=cta', 'https://benzpro.co.kr/chat',
  'https://www.benzpro.co.kr/chat', 'https://pf.kakao.com/_YxnqWX/chat',
  'https://open.kakao.com/o/example']) {
  const env = setup();
  assert.equal(env.listeners.click.length, 1);
  assert.equal(env.listeners.click[0].capture, true);
  env.click(href);
  assert.equal(env.events().length, 1, href);
  const payload = env.events()[0][2];
  assert.equal(payload.event_category, 'conversion');
  assert.equal(payload.event_label, 'kakao_consulting');
  assert.equal(payload.transport_type, 'beacon');
  env.click(href);
  assert.equal(env.events().length, 2, 'Separate rapid clicks must both count');
}
for (const href of ['tel:01091649639', '/quote', 'https://example.com/chat', 'https://pf.kakao.com.evil.test/chat']) {
  const env = setup(); env.click(href); assert.equal(env.events().length, 0, href);
}
const early = setup('benzpro.co.kr', '', '');
early.click('/chat');
assert.equal(early.events().length, 0);
early.listeners.DOMContentLoaded[0].fn();
assert.equal(early.events().length, 1, 'Early click queues after GA initialization');
const local = setup('localhost'); local.click('/chat'); assert.equal(local.events().length, 0);
const dry = setup('benzpro.co.kr', 'dry'); dry.click('/chat');
assert.equal(dry.events().length, 0);
assert.equal(dry.window.__bpEvents.filter(e => e.name === '카톡').length, 1);
for (const file of fs.readdirSync('.').filter(f => f.endsWith('.html'))) {
  assert.equal((fs.readFileSync(file, 'utf8').match(/bp-measure\.js\?v=20261030b/g) || []).length, 1, file);
}
console.log('Kakao event payload, beacon, link coverage, rapid clicks, early queue, environment and HTML cache checks passed.');
