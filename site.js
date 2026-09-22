/* Make It WOW! – shared site script (loaded by every page)
   Mobile navigation drawer (slides in from the right).
   Links are plain <a href> tags, so navigation still works if this file fails to load. */
(function () {
  var toggle = document.getElementById('nav-toggle');
  var panel = document.getElementById('mobile-menu');
  var backdrop = document.getElementById('menu-backdrop');
  var closeBtn = document.getElementById('nav-close');
  if (!toggle || !panel) return;

  var desktop = window.matchMedia('(min-width: 768px)');

  function isOpen() { return panel.getAttribute('data-open') === 'true'; }

  function setOpen(open) {
    panel.setAttribute('data-open', String(open));
    if (backdrop) backdrop.setAttribute('data-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';   // stop the page scrolling behind the drawer
    // wait a beat: the drawer is still visibility:hidden on the very first frame, and hidden elements can't take focus
    if (open && closeBtn) setTimeout(function () { if (isOpen()) closeBtn.focus(); }, 60);
  }

  toggle.addEventListener('click', function () { setOpen(true); });

  if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); toggle.focus(); });
  if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); toggle.focus(); });

  // Close after choosing a link
  panel.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { setOpen(false); toggle.focus(); return; }
    // Keep keyboard focus inside the drawer while it is open
    if (e.key === 'Tab') {
      var f = panel.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Close if the window grows to desktop width
  function onResize(e) { if (e.matches && isOpen()) setOpen(false); }
  if (desktop.addEventListener) desktop.addEventListener('change', onResize);
  else if (desktop.addListener) desktop.addListener(onResize);
})();
