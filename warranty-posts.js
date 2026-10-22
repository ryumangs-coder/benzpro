(function () {
  var skip = /가격|비용 차이|프로모션|딜러|사설 연장/;
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function card(post) {
    return '<a class="wr-post" data-slug="' + esc(post.slug) + '" href="https://mercedes.benzpro.co.kr/posts/' + encodeURIComponent(post.slug) + '" target="_blank" rel="noopener noreferrer">' +
      '<img src="' + esc(post.thumbnail) + '" alt="" loading="lazy" width="88" height="70" />' +
      "<span>" + esc(post.title) + "<small>읽어 보기 →</small></span></a>";
  }
  window.BenzWarrantyPosts = function (root) {
    root = root || document;
    var box = root.querySelector("[data-warranty-live]");
    if (!box || box.getAttribute("data-done") || !window.fetch) return;
    box.setAttribute("data-done", "1");
    var seen = {};
    Array.prototype.forEach.call(root.querySelectorAll("a.wr-post[data-slug]"), function (a) {
      seen[a.getAttribute("data-slug")] = true;
    });
    fetch("https://mercedes.benzpro.co.kr/api/posts?q=" + encodeURIComponent("보증") + "&limit=100")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var posts = (data.posts || []).filter(function (p) {
          return p && p.status === "published" && p.category === "워런티" && p.slug && p.title && p.thumbnail && !seen[p.slug] && !skip.test(p.title);
        });
        posts.sort(function (a, b) {
          return String(b.publish_at || b.created_at || "").localeCompare(String(a.publish_at || a.created_at || ""));
        });
        posts = posts.slice(0, 6);
        if (!posts.length) return;
        box.innerHTML = posts.map(card).join("");
        var wrap = box.closest("[data-warranty-live-wrap]");
        if (wrap) wrap.hidden = false;
      })
      .catch(function () {});
  };
})();
