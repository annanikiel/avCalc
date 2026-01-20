/* =========================
   Checklist data
   ========================= */

const CHECKLISTS = {
  internal: {
    title: "Internal",
    subtitle: "Pre-flight cockpit checks",
    items: [
      { label: "Passenger brief", action: "IF NEEDED" },
      { label: "Seats", action: "ADJUSTED & LOCKED" },
      { label: "Hatches & Harnesses", action: "CLOSED & FASTENED" },
      { label: "Parking brake", action: "AS REQUIRED" },
      { label: "Heaters & air vents", action: "CHECK" },
      { label: "Instruments + Hobbs", action: "CHECK & NOTE" },
      { label: "Radios", action: "OFF" },
      { label: "Circuit breakers", action: "IN & SECURE" },
      { label: "Flight Controls", action: "FREE, FULL, CORRECT" },
      { label: "Trim", action: "FREE, FULL, CORRECT + TO" }
    ]
  },

  start: {
    title: "Start",
    subtitle: "Engine start",
    items: [
      { label: "Cabin Air & Heater", action: "CLOSED" },
      { label: "Throttle friction", action: "OPERATE, SET LOOSE" },
      { label: "Throttle", action: "FULL, FREE, 1/2 INCH OPEN" },
      { label: "Mixture", action: "FULL, FREE, RICH" },
      { label: "Carburettor Heat", action: "FULL, FREE, COLD" },
      { label: "Master Switch", action: "ON" },
      { label: "Key", action: "IN" },
      { label: "Beacon", action: "ON" },
      { label: "Primer (if cold engine)", action: "PRIME & LOCK" },
      { label: "Lookout", action: "'CLEAR PROP'" },
      { label: "Magnetos", action: "BOTH" },
      { label: "Starter", action: "ENGAGE" },
      { label: "Memory items", action: "CARRY OUT" },
      { label: "Ammeter", action: "CHARGING" },
      { label: "Suction", action: "3-5 INCH" },
      { label: "Magnetos", action: "DROP, NO STOP" },
      { label: "Flaps", action: "UP, STAGES, SYMMETRY" },
      { label: "Instruments", action: "SET" },
      { label: "Radios", action: "TUNE, ATIS, CALL" }
    ]
  },

  power_checks: {
    title: "Power checks",
    subtitle: "Run-up checks",
    items: [
      { label: "Position", action: "INTO WIND" },
      { label: "Parking brake", action: "CONSIDER" },
      { label: "Throttle", action: "SET 1200rpm" },
      { label: "Fuel", action: "ON, SUFFICIENT" },
      { label: "Engine Ts & Ps", action: "IN THE GREEN" },
      { label: "Throttle", action: "SET 1700rpm, CHECK BRAKES HOLDING" },
      { label: "Carb Heat", action: "ON, DROP STEADY REVS, SET COLD" },
      { label: "Magnetos", action: "MAX DROP 125rpm, MAX DIFF 50rpm" },
      { label: "Engine Ts & Ps", action: "IN THE GREEN" },
      { label: "Ammeter", action: "CHARGING" },
      { label: "Suction", action: "3-5 INCH" },
      { label: "Throttle", action: "CLOSE, 500 - 700rpm" },
      { label: "Throttle", action: "SET 1200rpm" }
    ]
  },

  pre_takeoff: {
    title: "Pre-takeoff",
    subtitle: "Before departure",
    items: [
      { label: "Trim", action: "SET TO" },
      { label: "Throttle friction", action: "SET 'FINGER TIGHT'" },
      { label: "Mixture", action: "RICH" },
      { label: "Magnetos", action: "BOTH" },
      { label: "Pitot Heat", action: "AS REQUIERED" },
      { label: "Fuel", action: "ON, PRIMER LOCKED" },
      { label: "Flaps", action: "AS REQUIRED" },
      { label: "Hatches & Harnesses", action: "SECURE" },
      { label: "Carb Heat", action: "COLD" },
      { label: "Controls", action: "FULL, FREE" },
      { label: "Transponder", action: "SET ALT" },
      { label: "Lights", action: "AS REQUIRED" }
    ]
  },

  after_landing: {
    title: "After landing",
    subtitle: "Clear runway and tidy up",
    items: [
      { label: "Runway vacated", action: "STOP, SET 1200rpm" },
      { label: "Carb heat", action: "COLD" },
      { label: "Pitot heat", action: "OFF" },
      { label: "Flaps", action: "UP" },
      { label: "Trim", action: "NEUTRAL" },
      { label: "Throttle friction", action: "LOOSE" },
      { label: "Electrics", action: "NON-ESSENTIAL OFF" },
      { label: "Transponder", action: "AS REQUIRED" },
      { label: "Radios", action: "NON-ESSENTIAL OFF" },
    ]
  },

  fuelling: {
    title: "Fuelling",
    subtitle: "Engine shutdown for refuelling",
    items: [
      { label: "Throttle", action: "SET 1200 rpm" },
      { label: "Magnetos", action: "CHECK" },
      { label: "Radios", action: "OFF" },
      { label: "Mixture", action: "IDLE CUT OFF" },
      { label: "Magnetos", action: "OFF, KEY OUT" },
      { label: "Master switch", action: "OFF" },
      { label: "Fuel", action: "OFF" }
    ]
  },

  shutdown: {
    title: "Shutdown",
    subtitle: "Secure aircraft",
    items: [
      { label: "Position", action: "INTO WIND" },
      { label: "Parking brake", action: "AS REQUIRED" },
      { label: "Throttle", action: "SET 1200rpm" },
      { label: "Magnetos", action: "CHECK (NOTE DROP)" },
      { label: "Radios", action: "OFF" },
      { label: "Mixture", action: "IDLE CUT OFF" },
      { label: "Magnetos", action: "OFF, KEY OUT" },
      { label: "Electrics", action: "OFF" },
      { label: "Master switch", action: "OFF" },
      { label: "Fuel", action: "OFF" },
      { label: "Hobbs", action: "NOTE" },
      { label: "Hatches & Harnesses", action: "TIDY & SECURE" },
      { label: "Aircraft", action: "SECURE, CONTROL LOCK" },
    ]
  }
};

const CHECKLIST_SEQUENCE = [
  "internal",
  "start",
  "power_checks",
  "pre_takeoff",
  "after_landing",
  "fuelling",
  "shutdown"
];

/* =========================
   Helpers
   ========================= */

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function createItem({ label, action }, checklistName, itemIndex) {
  const row = document.createElement("div");
  row.className = "item";

   row.innerHTML = `
     <div class="right">
       <input type="checkbox" aria-label="${label} – ${action}">
     </div>
     <div class="left">
       <div class="label">${label}</div>
       <div class="action">${action}</div>
     </div>
   `;

  const checkbox = row.querySelector("input");

  function sync() {
    row.classList.toggle("done", checkbox.checked);
  }

  checkbox.addEventListener("change", () => {
    sync();
    // Save state to localStorage
    const key = `checklist_${checklistName}`;
    const state = JSON.parse(localStorage.getItem(key) || '{}');
    state[itemIndex] = checkbox.checked;
    localStorage.setItem(key, JSON.stringify(state));
  });

  // Tap anywhere on row toggles checkbox
  row.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "input") return;
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change"));
  });

  sync();
  return row;
}

function renderNextLink(currentName) {
  const wrap = document.getElementById("nextWrap");
  if (!wrap) return;

  const idx = CHECKLIST_SEQUENCE.indexOf(currentName);
  if (idx === -1) {
    wrap.innerHTML = "";
    return;
  }

  // Special case: after_landing has two next options (fuelling or shutdown)
  if (currentName === "after_landing") {
    wrap.innerHTML = `
      <a class="card" href="checklist.html?name=fuelling">
        <strong>Next: Fuelling</strong><br/>
        <small>Shutdown for refuelling</small>
      </a>
      <a class="card" href="checklist.html?name=shutdown">
        <strong>Next: Shutdown</strong><br/>
        <small>Secure the aircraft</small>
      </a>
    `;
    return;
  }

  // Special case: fuelling goes to shutdown with "from" parameter
  if (currentName === "fuelling") {
    wrap.innerHTML = `
      <a class="card" href="checklist.html?name=shutdown&from=fuelling">
        <strong>Next: Shutdown</strong><br/>
        <small>Secure the aircraft</small>
      </a>
    `;
    return;
  }

  const nextName = CHECKLIST_SEQUENCE[idx + 1];
  if (!nextName || !CHECKLISTS[nextName]) {
    // End of sequence: show nothing (or show "Back to checklists" if you want)
    wrap.innerHTML = `<a class="card" href="checklists.html"><strong>Back to checklists</strong></a>`;
    return;
  }

  const nextTitle = CHECKLISTS[nextName].title;

  wrap.innerHTML = `
    <a class="card" href="checklist.html?name=${encodeURIComponent(nextName)}">
      <strong>Next: ${nextTitle}</strong><br/>
      <small>Continue to the next checklist</small>
    </a>
  `;
}

/* =========================
   Initialise
   ========================= */

const name = qs("name");
const from = qs("from");
const checklist = CHECKLISTS[name];

const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const listEl = document.getElementById("checklist");
const resetBtn = document.getElementById("resetBtn");

if (!checklist) {
  titleEl.textContent = "Checklist not found";
  subtitleEl.textContent = "";
  listEl.innerHTML = "<p class='hint'>Unknown checklist.</p>";
} else {
  titleEl.textContent = checklist.title;
  subtitleEl.textContent = checklist.subtitle;

  // Create checklist items
  checklist.items.forEach((item, index) => {
    listEl.appendChild(createItem(item, name, index));
  });

  // If on shutdown and came from fuelling, pre-tick common items (3-10)
  if (name === "shutdown" && from === "fuelling") {
    const fuellingState = JSON.parse(localStorage.getItem('checklist_fuelling') || '{}');
    const checkboxes = listEl.querySelectorAll("input[type='checkbox']");

    // Mapping: fuelling items to shutdown items (3-10, indices 2-9)
    // Fuelling[0] (Throttle) -> Shutdown[2]
    // Fuelling[1] (Magnetos CHECK) -> Shutdown[3]
    // Fuelling[2] (Radios) -> Shutdown[4]
    // Fuelling[3] (Mixture) -> Shutdown[5]
    // Fuelling[4] (Magnetos OFF) -> Shutdown[6]
    // Fuelling[5] (Master switch) -> Shutdown[8]
    // Fuelling[6] (Fuel) -> Shutdown[9]

    const mapping = {
      0: 2,  // Throttle
      1: 3,  // Magnetos CHECK
      2: 4,  // Radios
      3: 5,  // Mixture
      4: 6,  // Magnetos OFF
      5: 8,  // Master switch
      6: 9   // Fuel
    };

    Object.entries(mapping).forEach(([fuelIdx, shutdownIdx]) => {
      if (fuellingState[fuelIdx]) {
        checkboxes[shutdownIdx].checked = true;
        checkboxes[shutdownIdx].dispatchEvent(new Event("change"));
      }
    });
  }

   renderNextLink(name);
}

resetBtn.addEventListener("click", () => {
  listEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
    cb.checked = false;
    cb.dispatchEvent(new Event("change"));
  });
});
