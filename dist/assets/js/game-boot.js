/**
 * Lazy game boot. The engine is only fetched when the player presses play.
 */
(function () {
  const stage = document.getElementById('game-stage');
  if (!stage) return;

  const facade = document.getElementById('game-facade');
  const loading = document.getElementById('game-loading');
  const dataEl = document.getElementById('game-data');
  const canvas = document.getElementById('game-canvas');
  let started = false;

  function fail(message) {
    if (loading) {
      loading.hidden = false;
      loading.textContent = message;
    }
  }

  async function start() {
    if (started) return;
    started = true;
    if (facade) {
      facade.disabled = true;
      facade.style.display = 'none';
    }
    stage.classList.add('is-playing');
    if (loading) loading.hidden = false;

    let data;
    try {
      data = JSON.parse(dataEl.textContent);
    } catch (err) {
      console.error(err);
      fail('Could not read the level data. Reload the page and try again.');
      return;
    }

    try {
      const isJam = data.engine === 'jam';
      const mod = isJam
        ? await import('/assets/js/parking-jam.js')
        : await import('/assets/js/parking-engine.js');
      const init = isJam ? mod.initParkingJam : mod.initParkingGame;
      if (typeof init !== 'function') throw new Error('Game engine failed to load');
      init({ data, stage, canvas });
      if (loading) loading.hidden = true;
      canvas.setAttribute('tabindex', '-1');
      canvas.focus({ preventScroll: true });
      if (isJam) {
        const first = stage.querySelector('.jam-car-btn');
        if (first) first.focus({ preventScroll: true });
      }
    } catch (err) {
      console.error(err);
      fail('The game could not start. Check your connection and reload.');
    }
  }

  if (facade) facade.addEventListener('click', start, { once: true });
})();
