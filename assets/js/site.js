/* Site behaviour: collapsing top menu and the mobile "Follow" button.
   Plain JavaScript, no libraries needed. */
(function () {
  'use strict';

  var WIDE = 925; // px; matches the stylesheet's 57.8125em breakpoint

  function init() {
    var nav = document.getElementById('site-nav');
    var toggle = nav && nav.querySelector('.greedy-nav__toggle');
    var visible = nav && nav.querySelector('.visible-links');
    var hidden = nav && nav.querySelector('.hidden-links');
    var masthead = document.querySelector('.masthead');

    // Top menu: move links that don't fit into a drop-down behind the toggle button.
    function fitNav() {
      if (!nav || !toggle || !visible || !hidden) return;
      while (hidden.firstElementChild) visible.appendChild(hidden.firstElementChild);
      toggle.classList.remove('hidden');
      var room = nav.clientWidth - toggle.offsetWidth - 30;
      while (visible.offsetWidth > room && visible.children.length > 1) {
        hidden.insertBefore(visible.lastElementChild, hidden.firstChild);
      }
      if (!hidden.children.length) {
        toggle.classList.add('hidden');
        hidden.classList.add('hidden');
        toggle.classList.remove('close');
        toggle.setAttribute('aria-expanded', 'false');
      }
      // The header is fixed, so push the page down by its height.
      if (masthead) document.body.style.paddingTop = masthead.offsetHeight + 'px';
    }

    if (toggle && hidden) {
      toggle.addEventListener('click', function () {
        var open = hidden.classList.toggle('hidden') === false;
        toggle.classList.toggle('close', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    // Sidebar "Follow" button (shown on narrow screens only).
    var follow = document.querySelector('.author__urls-wrapper button');
    var links = document.querySelector('.author__urls');
    if (follow && links) {
      follow.addEventListener('click', function () {
        var open = links.style.display !== 'block';
        links.style.display = open ? 'block' : '';
        follow.classList.toggle('open', open);
        follow.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var pending = false;
    window.addEventListener('resize', function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () {
        pending = false;
        fitNav();
        if (links && window.innerWidth >= WIDE) {
          links.style.display = '';
          if (follow) follow.classList.remove('open');
        }
      });
    });

    fitNav();
    // Re-measure once web fonts have loaded, since they change link widths.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
