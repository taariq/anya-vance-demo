// Interactivity for the Lisp/Scheme comparison page.
// Only toggles the `hidden` attribute on existing DOM elements; never
// inserts or templates HTML (no innerHTML use), so no escaping concern
// applies to this file (see CHANGE_PLAN.md step 3 / AR-008 disposition).
(function () {
  'use strict';

  var DEFAULT_TOPIC = 'history';
  var activeTopic = DEFAULT_TOPIC;

  function getSections() {
    return document.querySelectorAll('[data-topic]');
  }

  function getNavButtons() {
    return document.querySelectorAll('button[data-topic], [role="tab"][data-topic]');
  }

  function applyActiveTopic() {
    var sections = getSections();
    for (var i = 0; i < sections.length; i++) {
      var el = sections[i];
      if (el.tagName && el.tagName.toLowerCase() === 'section') {
        if (el.getAttribute('data-topic') === activeTopic) {
          el.hidden = false;
          el.classList.remove('hidden-topic');
        } else {
          el.hidden = true;
          el.classList.add('hidden-topic');
        }
      }
    }

    var buttons = getNavButtons();
    for (var j = 0; j < buttons.length; j++) {
      var btn = buttons[j];
      var isActive = btn.getAttribute('data-topic') === activeTopic;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  }

  function handleTopicClick(topic) {
    // Clicking the already-active topic is a no-op: state and DOM
    // remain unchanged (plan s7, D-1).
    if (topic === activeTopic) {
      return;
    }
    activeTopic = topic;
    applyActiveTopic();
  }

  function init() {
    var buttons = getNavButtons();
    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var topic = btn.getAttribute('data-topic');
          if (topic) {
            handleTopicClick(topic);
          }
        });
      })(buttons[i]);
    }
    // On load, default topic ('history') is visible and the other four
    // are hidden once JS runs (plan step 3). If this script never loads,
    // the shipped HTML/CSS leave every section visible (plan s12).
    applyActiveTopic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
