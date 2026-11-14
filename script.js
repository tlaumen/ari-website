/* ARI.engineer – ingenieur.html: onderwerpkeuze en projectfilter */
(function () {
  'use strict';

  var topics = {
    fundering: {
      kicker: 'ONDERWERP 01',
      title: 'Funderingen',
      intro: 'Wij ontwerpen funderingen die passen bij de grond, de constructie, de omgeving en het budget.',
      doe: ['Paalfunderingen', 'Trekpalen', 'Fundering op staal (strook of poeren)', 'Draagvermogen en zettingen van de fundering', 'Omgevingsbeïnvloeding']
    },
    zettingen: {
      kicker: 'ONDERWERP 02',
      title: 'Zettingen',
      intro: 'Hoeveel zakt de grond en hoe snel? Wij beoordelen zetting onder gebouwen, ophogingen en wegen.',
      doe: ['Zettingsprognoses en verschilzettingen', 'Voorbelasting en verticale drainage', 'Restzettingen op lange termijn', 'Effect op kabels, leidingen en aansluitingen']
    },
    stabiliteit: {
      kicker: 'ONDERWERP 03',
      title: 'Stabiliteit',
      intro: 'Blijft het staan, ook bij extra belasting of hoog water? Wij rekenen het door en ontwerpen de versterking als het nodig is.',
      doe: ['Stabiliteit van taluds', 'Dijken', 'Spoorbanen', 'Wegen', 'Ontgraving en tijdelijke bouwfasen', 'Begaanbaarheid bouwterrein', 'Versterkingsontwerp waar nodig']
    },
    damwand: {
      kicker: 'ONDERWERP 04',
      title: 'Damwandconstructies',
      intro: 'Hoe diep kun je veilig ontgraven, en wat doet dat met het pand ernaast? Wij rekenen het door en ontwerpen de wand.',
      doe: ['Damwanden en combiwanden', 'Oeverconstructies', 'Stempeling en verankering', 'Vervormingen en trillingen voor de omgeving', 'Uitvoeringsaspecten']
    },
    advies: {
      kicker: 'ONDERWERP 05',
      title: 'Overig geotechnisch werk',
      intro: 'Geen standaard vraag? Dan is het vaak juist een interessant geotechnisch probleem. Vertel ons wat je nodig hebt.',
      doe: ['Grondonderzoek: opzet en interpretatie', 'Toetsing en second opinion', 'Haalbaarheid en uitvoerbaarheid', 'Geotechnische vraagstukken op maat']
    }
  };

  var filterDefs = [
    { id: 'fundering', label: 'Funderingen' },
    { id: 'zettingen', label: 'Zettingen' },
    { id: 'stabiliteit', label: 'Stabiliteit' },
    { id: 'damwand', label: 'Damwandconstructies' },
    { id: 'advies', label: 'Overig geotechnisch werk' }
  ];

  var all = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var tiles = all('.topic');
  var panelArt = document.getElementById('panel-art');
  var kicker = document.getElementById('panel-kicker');
  var title = document.getElementById('panel-title');
  var intro = document.getElementById('panel-intro');
  var list = document.getElementById('panel-list');
  var pills = document.getElementById('pills');
  var cards = all('#cards .card');

  var currentTopic = 'fundering';
  var currentFilter = 'alle';

  function kindsOf(card) {
    return (card.getAttribute('data-kinds') || '').split(/\s+/).filter(Boolean);
  }

  function hasProjects(kind) {
    return cards.some(function (c) { return kindsOf(c).indexOf(kind) !== -1; });
  }

  /* ----- Onderwerp ----- */
  function selectTopic(id) {
    if (!topics[id]) return;
    currentTopic = id;
    var t = topics[id];

    tiles.forEach(function (tile) {
      tile.setAttribute('aria-pressed', tile.getAttribute('data-topic') === id ? 'true' : 'false');
    });

    kicker.textContent = t.kicker;
    title.textContent = t.title;
    intro.textContent = t.intro;

    list.textContent = '';
    t.doe.forEach(function (text) {
      var li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });

    var source = tiles.filter(function (tile) { return tile.getAttribute('data-topic') === id; })[0];
    var art = source.querySelector('.art').cloneNode(true);
    panelArt.textContent = '';
    panelArt.appendChild(art);
  }

  /* ----- Filter ----- */
  function setFilter(id) {
    currentFilter = id;
    cards.forEach(function (card) {
      card.hidden = !(id === 'alle' || kindsOf(card).indexOf(id) !== -1);
    });
    all('.pill', pills).forEach(function (pill) {
      pill.setAttribute('aria-pressed', pill.getAttribute('data-filter') === id ? 'true' : 'false');
    });
  }

  function buildPills() {
    var defs = [{ id: 'alle', label: 'Alle' }].concat(filterDefs.filter(function (f) { return hasProjects(f.id); }));
    defs.forEach(function (f) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pill';
      b.setAttribute('data-filter', f.id);
      b.setAttribute('aria-pressed', 'false');
      b.textContent = f.label;
      b.addEventListener('click', function () { setFilter(f.id); });
      pills.appendChild(b);
    });
  }

  /* ----- Mobiel: onderwerpen klappen open terwijl je scrolt ----- */
  var mq = window.matchMedia('(max-width: 760px)');
  var items = all('.topic-item');
  var topicsEl = document.querySelector('.topics');
  var REF = 0.45;          /* referentielijn: 45% van de schermhoogte */
  var activeIdx = -1;      /* onderwerp dat openstaat; -1 = nog geen */
  var locked = false;
  var ticking = false;

  function indexFor(id) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].querySelector('.topic').getAttribute('data-topic') === id) return i;
    }
    return -1;
  }

  function buildItems() {
    items.forEach(function (item) {
      var btn = item.querySelector('.topic');
      var id = btn.getAttribute('data-topic');
      var t = topics[id];

      var more = document.createElement('div');
      more.className = 'topic-more';
      more.id = 'more-' + id;
      var inner = document.createElement('div');
      inner.className = 'topic-more__in';
      var pad = document.createElement('div');
      pad.className = 'topic-more__pad';

      var p = document.createElement('p');
      p.textContent = t.intro;

      var row = document.createElement('div');
      row.className = 'btn-row';
      var a1 = document.createElement('a');
      a1.href = '#referenties';
      a1.className = 'btn btn--accent btn--sm';
      a1.textContent = 'Bekijk projecten';
      a1.addEventListener('click', function () { setFilter(hasProjects(id) ? id : 'alle'); });
      var a2 = document.createElement('a');
      a2.href = '#contact';
      a2.className = 'btn btn--line btn--sm';
      a2.textContent = 'Bespreek jouw vraag';
      row.appendChild(a1);
      row.appendChild(a2);

      var k = document.createElement('span');
      k.className = 'kicker';
      k.textContent = 'WAT WIJ DOEN';
      var ul = document.createElement('ul');
      t.doe.forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
      });

      pad.appendChild(p);
      pad.appendChild(row);
      pad.appendChild(k);
      pad.appendChild(ul);
      inner.appendChild(pad);
      more.appendChild(inner);
      item.appendChild(more);
      btn.setAttribute('aria-controls', more.id);
    });
  }

  /* Het laatste onderwerp waarvan de bovenkant boven de referentielijn staat. */
  function computeActive() {
    var ref = window.innerHeight * REF;
    var idx = -1;
    for (var i = 0; i < items.length; i++) {
      if (items[i].getBoundingClientRect().top <= ref) idx = i; else break;
    }
    return idx;
  }

  /* Eerdere onderwerpen worden een compacte rij, het actieve staat open, latere blijven dicht. */
  function paint(idx, open) {
    items.forEach(function (item, i) {
      var isOpen = open && i === idx;
      item.classList.toggle('is-passed', i < idx);
      item.classList.toggle('is-open', isOpen);
      item.querySelector('.topic').setAttribute('aria-pressed', isOpen ? 'true' : 'false');
    });
  }

  /* Wisselt het actieve onderwerp. Wat boven het scherm inkrimpt of groeit, wordt direct
     weggecorrigeerd met een scrollcorrectie, zodat de pagina niet onder je duim wegspringt.
     Alleen het openklappen zelf is geanimeerd. */
  function activate(idx) {
    var anchor = idx >= 0 ? items[idx] : null;
    var before = anchor ? anchor.getBoundingClientRect().top : 0;
    activeIdx = idx;
    topicsEl.classList.add('no-anim');
    paint(idx, false);
    void topicsEl.offsetHeight;
    if (anchor) {
      var shift = anchor.getBoundingClientRect().top - before;
      if (shift) window.scrollBy({ top: shift, left: 0, behavior: 'instant' });
    }
    window.requestAnimationFrame(function () {
      topicsEl.classList.remove('no-anim');
      window.requestAnimationFrame(function () {
        if (activeIdx === idx) paint(idx, true);
      });
    });
  }

  function onScroll() {
    if (!mq.matches || locked || ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var idx = computeActive();
      if (idx !== activeIdx) activate(idx);
    });
  }

  /* Tik op een onderwerp (of een knop bovenaan): open het en scroll er zacht naartoe. */
  function goTo(idx) {
    var item = items[idx];
    if (idx === activeIdx) {
      var open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      item.querySelector('.topic').setAttribute('aria-pressed', open ? 'true' : 'false');
      return;
    }
    locked = true;
    activate(idx);
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        var top = item.getBoundingClientRect().top;
        window.scrollBy({ top: top - window.innerHeight * 0.2, behavior: 'smooth' });
        window.setTimeout(function () { locked = false; onScroll(); }, 900);
      });
    });
  }

  function onModeChange() {
    if (mq.matches) {
      var idx = computeActive();
      activeIdx = idx;
      paint(idx, true);
    } else {
      items.forEach(function (item) { item.classList.remove('is-open', 'is-passed'); });
      selectTopic(currentTopic);
    }
  }

  /* ----- Koppelingen ----- */
  all('[data-topic]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var id = el.getAttribute('data-topic');
      if (mq.matches) {
        currentTopic = id;
        if (!el.classList.contains('topic')) e.preventDefault();
        goTo(indexFor(id));
      } else {
        selectTopic(id);
      }
    });
  });

  all('[data-show]').forEach(function (el) {
    el.addEventListener('click', function () {
      var mode = el.getAttribute('data-show');
      setFilter(mode === 'topic' && hasProjects(currentTopic) ? currentTopic : 'alle');
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (mq.addEventListener) mq.addEventListener('change', onModeChange); else if (mq.addListener) mq.addListener(onModeChange);

  buildPills();
  setFilter('alle');
  selectTopic('fundering');
  buildItems();
  if (mq.matches) onModeChange();
})();
