// common.js
(function () {
  const VORS = window.VOR_DATA;

  function fillSelect(selectId, defaultId) {
    const sel = document.getElementById(selectId);
    sel.innerHTML = "";
    for (const v of VORS) {
      const opt = document.createElement("option");
      opt.value = v.id;
      opt.textContent = v.name;
      sel.appendChild(opt);
    }
    sel.value = defaultId ?? VORS[0]?.id;
  }

  function getVor(selectId) {
    const id = document.getElementById(selectId).value;
    const v = VORS.find(x => x.id === id);
    if (!v) throw new Error(`Unknown VOR selection: ${id}`);
    return v;
  }

  function bearing(id) {
    const v = Number(document.getElementById(id).value);
    if (!Number.isFinite(v)) throw new Error(`Bearing in ${id} must be a number`);
    if (v < 0 || v > 360) throw new Error(`Bearing in ${id} must be between 0 and 360`);
    return v;
  }

  // If you prefer wrapping instead of rejection, swap bearing() with this:
  // function bearing(id) {
  //   let v = Number(document.getElementById(id).value);
  //   if (!Number.isFinite(v)) throw new Error(`Bearing in ${id} must be a number`);
  //   v = ((v % 360) + 360) % 360;
  //   document.getElementById(id).value = v;
  //   return v;
  // }

function createMap(
  mapDivId,
  initialLat = 53.55,
  initialLon = -2.6,
  initialZoom = 6
) {
  const UK_BOUNDS = L.latLngBounds(
    [49.5, -9.5],   // SW
    [61.0,  2.5]    // NE
  );

  const map = L.map(mapDivId, {
    maxBounds: UK_BOUNDS,
    maxBoundsViscosity: 1.0,  // fully clamps panning
    minZoom: 5,
    maxZoom: 12
  }).setView([initialLat, initialLon], initialZoom);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { maxZoom: 18 }
  ).addTo(map);

  const state = { map, layers: [] };

  state.clear = () => {
    state.layers.forEach(l => map.removeLayer(l));
    state.layers = [];
  };

  state.add = (layer) => {
    layer.addTo(map);
    state.layers.push(layer);
    return layer;
  };

  state.fitTo = (latlonPairs) => {
    map.fitBounds(latlonPairs, {
      padding: [30, 30],
      maxZoom: 10      // prevents zooming in absurdly on tight fixes
    });
  };

  return state;
}

  async function apiGet(path, params) {
    const base = window.APP_CONFIG?.API_BASE;
    if (!base) throw new Error("Missing APP_CONFIG.API_BASE in config.js");
    const url = `${base}${path}?${new URLSearchParams(params).toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }
    return data;
  }

  // Expose a tiny namespace
  window.VOR_APP = { fillSelect, getVor, bearing, createMap, apiGet };
})();
