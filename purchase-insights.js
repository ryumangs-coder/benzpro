/* Public Insights shares one cost topic. Split its search results by subject. */
(function () {
  var status = document.getElementById('purchase-insights-status');
  if (!status || !window.fetch) return;
  var origin = 'https://mercedes.benzpro.co.kr';
  var taxTopic = /절세|세무|세금|부가세|부가가치세|취득세|소득세|법인세|비용처리|비용 처리/;
  var topics = [
    { id: 'insight-tax-titles', label: '절세', query: '절세', matches: function (title) { return taxTopic.test(title); } },
    { id: 'insight-finance-titles', label: '금융', query: '금융', matches: function (title) { return !taxTopic.test(title) && /금융|리스|할부|잔가|렌트/.test(title); } }
  ];

  function selectPosts(posts, topic) {
    if (!Array.isArray(posts)) throw new Error('Invalid posts');
    var seen = new Set();
    return posts.filter(function (post) {
      return post && post.content_category === 'cost' &&
        (post.status == null || post.status === 'published') &&
        typeof post.title === 'string' && typeof post.slug === 'string' &&
        post.title.trim() && /^[\p{L}\p{N}_-]+$/u.test(post.slug) && topic.matches(post.title);
    }).sort(function (a, b) {
      return String(b.publish_at || b.created_at || '').localeCompare(String(a.publish_at || a.created_at || ''));
    }).filter(function (post) {
      if (seen.has(post.slug)) return false;
      seen.add(post.slug);
      return true;
    }).slice(0, 4);
  }

  function article(post, topic) {
    var item = document.createElement('li');
    var link = document.createElement('a');
    var copy = document.createElement('span');
    var badge = document.createElement('span');
    var title = document.createElement('span');
    link.href = origin + '/posts/' + encodeURIComponent(post.slug);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', post.title + ' (새 창)');
    copy.className = 'hp-insight-copy';
    badge.className = 'hp-insight-tag';
    badge.textContent = topic.label;
    title.className = 'hp-insight-title';
    title.textContent = post.title;
    copy.append(badge, title);
    link.append(copy);
    item.append(link);
    return item;
  }

  function load(topic) {
    var list = document.getElementById(topic.id);
    if (!list) return Promise.resolve('');
    var fallback = Array.from(list.children);
    var skeleton = fallback.map(function () {
      var item = document.createElement('li');
      item.className = 'hp-insight-skeleton';
      item.setAttribute('aria-hidden', 'true');
      return item;
    });
    list.replaceChildren.apply(list, skeleton);
    list.setAttribute('aria-busy', 'true');
    var controller = new AbortController();
    var timeout = window.setTimeout(function () { controller.abort(); }, 6000);
    var params = new URLSearchParams({ q: topic.query, limit: '100' });
    return fetch(origin + '/api/posts?' + params, { signal: controller.signal })
      .then(function (response) {
        if (!response.ok) throw new Error('Posts unavailable');
        return response.json();
      }).then(function (payload) {
        var posts = selectPosts(payload.posts, topic);
        if (posts.length < 4) throw new Error('Too few categorized posts');
        list.replaceChildren.apply(list, posts.map(function (post) { return article(post, topic); }));
        return '';
      }).catch(function () {
        list.replaceChildren.apply(list, fallback);
        list.insertAdjacentHTML('afterend', '<p class="hp-insight-load-error" data-insight-list="' + topic.id + '">최신 ' + topic.label + ' 글을 불러오지 못해 기존 추천 글을 표시합니다.</p>');
        return topic.label;
      }).finally(function () {
        window.clearTimeout(timeout);
        list.removeAttribute('aria-busy');
      });
  }

  status.textContent = '최신 인사이트 글을 불러오는 중입니다.';
  Promise.all(topics.map(load)).then(function (failed) {
    var labels = failed.filter(Boolean);
    status.textContent = labels.length ? labels.join('·') + ' 최신 글 조회에 실패했습니다. 기존 추천 글을 표시합니다.' : '최신 인사이트 글을 불러왔습니다.';
  });
})();
