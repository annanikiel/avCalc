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
      { label: "Trim", action: "FREE, FULL, CORRECT + TO" },
    ]
  },

  start: {
    title: "Start",
    subtitle: "Engine start sequence",
    items: [
      { label: "Carb heat", action: "COLD" },
      { label: "Mixture", action: "RICH" },
      { label: "Master", action: "ON" },
      { label: "Prop area", action: "CLEAR" }
    ]
  },

  power_checks: {
    title: "Power checks",
    subtitle: "Run-up checks",
    items: [
      { label: "Brakes", action: "HOLD" },
      { label: "RPM", action: "SET" },
      { label: "Magnetos", action: "CHECK" },
      { label: "Carb heat", action: "CHECK" }
    ]
  },

  pre_takeoff: {
    title: "Pre-takeoff",
    subtitle: "Before departure",
    items: [
      { label: "Flight controls", action: "FREE & CORRECT" },
      { label: "Trim", action: "SET" },
      { label: "Flaps", action: "SET" },
      { label: "Harnesses", action: "SECURE" }
    ]
  },

  after_landing: {
    title: "After landing",
    subtitle: "Clear runway and tidy up",
    items: [
      { label: "Flaps", action: "UP" },
      { label: "Carb heat", action: "COLD" },
      { label: "Transponder", action: "STANDBY" }
    ]
  },

  shutdown: {
    title: "Shutdown",
    subtitle: "Secure aircraft",
    items: [
      { label: "Avionics", action: "OFF" },
      { label: "Mixture", action: "IDLE CUT-OFF" },
      { label: "Master", action: "OFF" },
      { label: "Keys", action: "REMOVE" }
    ]
  }
};

const CHECKLIST_SEQUENCE = [
  "internal",
  "start",
  "power_checks",
  "pre_takeoff",
  "after_landing",
  "shutdown"
];

/* =========================
   Helpers
   ========================= */

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function createItem({ label, action }) {
  const row = document.createElement("div");
  row.className = "item";

  row.innerHTML = `
    <div class="left">
      <div class="label">${label}</div>
      <div class="action">${action}</div>
    </div>
    <div class="right">
      <input type="checkbox" aria-label="${label} – ${action}">
    </div>
  `;

  const checkbox = row.querySelector("input");

  function sync() {
    row.classList.toggle("done", checkbox.checked);
  }

  checkbox.addEventListener("change", sync);

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

  checklist.items.forEach(item => {
    listEl.appendChild(createItem(item));
  });

   renderNextLink(name);
}

resetBtn.addEventListener("click", () => {
  listEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
    cb.checked = false;
    cb.dispatchEvent(new Event("change"));
  });
});
