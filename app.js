const links = [...document.querySelectorAll('.site-header nav a')];
const sections = [...document.querySelectorAll('main > section[id]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      for (const link of links) {
        const current = link.getAttribute('href') === '#' + entry.target.id;
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, {rootMargin: '-15% 0px -55% 0px'});
  sections.forEach(section => observer.observe(section));
}

// Track the visible PLC and POCO section independently from the main site navigation.
if (document.body.matches('.plc-detail, .poco-detail, .kickcan-detail')) {
  const toc = document.querySelector('.section-nav');
  const tocLinks = [...toc.querySelectorAll('a[href^="#"]')];
  const tocSections = tocLinks.map(link => document.querySelector(link.getAttribute('href')));
  let queued = false;
  const updateToc = () => {
    queued = false;
    const threshold = toc.getBoundingClientRect().bottom + 120;
    let active = -1;
    tocSections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= threshold) active = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3) active = tocLinks.length - 1;
    tocLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const queueToc = () => {
    if (!queued) { queued = true; requestAnimationFrame(updateToc); }
  };
  window.addEventListener('scroll', queueToc, {passive:true});
  window.addEventListener('resize', queueToc);
  window.addEventListener('load', queueToc);
  updateToc();
}

// Switch the existing POCO clips within one stable viewing frame.
const pocoDemo = document.querySelector('.poco-detail .poco-demo-block');
if (pocoDemo) {
  const buttons = [...pocoDemo.querySelectorAll('[data-poco-src]')];
  const player = pocoDemo.querySelector('.poco-demo-scene img');
  const caption = pocoDemo.querySelector('.poco-demo-scene figcaption');
  buttons.forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    player.src = button.dataset.pocoSrc;
    player.alt = button.dataset.pocoAlt;
    caption.textContent = button.dataset.pocoCaption;
  }));
}
