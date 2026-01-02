const out = document.getElementById("out");
const r1El = document.getElementById("r1");
const r2El = document.getElementById("r2");

VOR_APP.fillSelect("vor1", "WAL");
VOR_APP.fillSelect("vor2", "POL");

const mapState = VOR_APP.createMap("map"); // your UK-bounded map helper

let pointMarker = null;
let vor1Marker = null;
let vor2Marker = null;

function num(id) {
  const v = Number(document.getElementById(id).value);
  if (!Number.isFinite(v)) throw new Error(`Invalid number in ${id}`);
  return v;
}

function optionalNum(id) {
  const raw = document.getElementById(id).value;
  if (raw === "" || raw === null || raw === undefined) return null;
  const v = Number(raw);
  if (!Number.isFinite(v)) throw new Error(`Invalid number in ${id}`);
  return v;
}

function setPoint(lat, lon, pan = true) {
  document.getElementById("pLat").value = lat.toFixed(6);
  document.getElementById("pLon").value = lon.toFixed(6);

  if (pointMarker) mapState.map.removeLayer(pointMarker);
  pointMarker = L.circleMarker([lat, lon], {
    radius: 8,
    color: "#d00000",      // outline colour
    fillColor: "#ff4d4d",  // fill colour
    fillOpacity: 0.9,
    weight: 2
  }).bindPopup("Point").addTo(mapState.map);

  if (pan) mapState.map.panTo([lat, lon]);
}

function setVorMarkers(v1, v2) {
  if (vor1Marker) mapState.map.removeLayer(vor1Marker);
  if (vor2Marker) mapState.map.removeLayer(vor2Marker);

  vor1Marker = L.marker([v1.lat, v1.lon]).bindPopup(`VOR1: ${v1.name}`).addTo(mapState.map);
  vor2Marker = L.marker([v2.lat, v2.lon]).bindPopup(`VOR2: ${v2.name}`).addTo(mapState.map);
}

async function compute() {
  out.textContent = "Calling API…";
  r1El.textContent = "Radial: —";
  r2El.textContent = "Radial: —";

  const v1 = VOR_APP.getVor("vor1");
  const v2 = VOR_APP.getVor("vor2");
  if (v1.id === v2.id) throw new Error("VOR1 and VOR2 must be different");

  const pLat = num("pLat");
  const pLon = num("pLon");
  const variation = optionalNum("var");

  const params = {
    pLat, pLon,
    v1Lat: v1.lat, v1Lon: v1.lon,
    v2Lat: v2.lat, v2Lon: v2.lon,
  };
  if (variation !== null) params.var = variation;

  const data = await VOR_APP.apiGet("/radials", params);

  const r1 = data.radials.vor1;
  const r2 = data.radials.vor2;
  const typ = data.radials.type;

  r1El.textContent = `Radial (${typ}): ${r1.toFixed(1)}°`;
  r2El.textContent = `Radial (${typ}): ${r2.toFixed(1)}°`;
  out.textContent = JSON.stringify(data, null, 2);

  // Update markers (keep map tidy)
  setVorMarkers(v1, v2);
  setPoint(pLat, pLon, false);

  mapState.fitTo([[pLat, pLon], [v1.lat, v1.lon], [v2.lat, v2.lon]]);
}

document.getElementById("go").addEventListener("click", async () => {
  try { await compute(); }
  catch (err) { out.textContent = `Error: ${err.message}`; }
});

// Click map to set point
mapState.map.on("click", async (e) => {
  setPoint(e.latlng.lat, e.latlng.lng);
  try { await compute(); }
  catch (err) { out.textContent = `Error: ${err.message}`; }
});

// Recompute when VOR selection changes (nice UX)
document.getElementById("vor1").addEventListener("change", async () => {
  try { await compute(); } catch (err) { out.textContent = `Error: ${err.message}`; }
});
document.getElementById("vor2").addEventListener("change", async () => {
  try { await compute(); } catch (err) { out.textContent = `Error: ${err.message}`; }
});

// Initialise markers to match defaults
try {
  const v1 = VOR_APP.getVor("vor1");
  const v2 = VOR_APP.getVor("vor2");
  setVorMarkers(v1, v2);
  setPoint(num("pLat"), num("pLon"), false);
} catch {}
