// intersect.js
const out = document.getElementById("out");

VOR_APP.fillSelect("vor1", "WAL");
VOR_APP.fillSelect("vor2", "POL");

const mapState = VOR_APP.createMap("map");

document.getElementById("go").addEventListener("click", async () => {
  mapState.clear();
  out.textContent = "Calling API…";

  try {
    const v1 = VOR_APP.getVor("vor1");
    const v2 = VOR_APP.getVor("vor2");
    if (v1.id === v2.id) throw new Error("VOR1 and VOR2 must be different");

    const data = await VOR_APP.apiGet("/intersect", {
      p1lat: v1.lat, p1lon: v1.lon, brg1: VOR_APP.bearing("brg1"),
      p2lat: v2.lat, p2lon: v2.lon, brg2: VOR_APP.bearing("brg2"),
    });

    out.textContent = JSON.stringify(data, null, 2);

    const [s1, s2] = data.solutions;

    mapState.add(L.marker([v1.lat, v1.lon]).bindPopup(`VOR1: ${v1.name}`));
    mapState.add(L.marker([v2.lat, v2.lon]).bindPopup(`VOR2: ${v2.name}`));
    mapState.add(L.circleMarker([s1.lat, s1.lon], { radius: 7 }).bindPopup("Solution A"));
    mapState.add(L.circleMarker([s2.lat, s2.lon], { radius: 7 }).bindPopup("Solution B"));

    mapState.fitTo([[v1.lat, v1.lon],[v2.lat, v2.lon],[s1.lat, s1.lon],[s2.lat, s2.lon]]);
  } catch (err) {
    out.textContent = `Error: ${err.message}`;
  }
});
