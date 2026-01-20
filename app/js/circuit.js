/* =========================
   Circuit Pattern Headings Calculator
   Calculates headings for crosswind, downwind, and base legs
   with wind correction angles
   ========================= */

// Normalize angle to 0-360 range
function normalizeAngle(angle) {
  angle = angle % 360;
  if (angle < 0) angle += 360;
  return angle;
}

// Convert degrees to radians
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Convert radians to degrees
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

// Calculate wind correction angle and heading to fly
function calculateHeading(track, windDir, windSpeed, trueAirspeed) {
  // Wind direction is where wind is coming FROM
  // Calculate the angle between wind direction and track
  const windAngle = normalizeAngle(windDir - track);

  // Calculate wind correction angle using the formula:
  // WCA = arcsin((wind_speed / true_airspeed) * sin(wind_angle))
  const ratio = windSpeed / trueAirspeed;

  // Check if wind speed is greater than airspeed (impossible to maintain track)
  if (ratio > 1) {
    return {
      heading: null,
      wca: null,
      error: "Wind too strong for airspeed"
    };
  }

  const wcaRadians = Math.asin(ratio * Math.sin(toRadians(windAngle)));
  const wca = toDegrees(wcaRadians);

  // Apply wind correction angle to track to get heading
  // The WCA from arcsin already has the correct sign
  const heading = normalizeAngle(track + wca);

  // Calculate ground speed (simplified - for display purposes)
  const headwind = windSpeed * Math.cos(toRadians(windAngle));
  const groundSpeed = trueAirspeed - headwind;

  return {
    heading: Math.round(heading),
    wca: Math.round(Math.abs(wca) * 10) / 10,  // Display absolute value, rounded to 1 decimal
    track: Math.round(track),
    groundSpeed: Math.round(groundSpeed)
  };
}

// Calculate circuit pattern tracks
function calculateCircuitTracks(runwayHeading, pattern) {
  const rwyHdg = normalizeAngle(runwayHeading);

  // Left-handed circuit: turn left (add 90 for crosswind)
  // Right-handed circuit: turn right (subtract 90 for crosswind)
  let crosswindTrack, downwindTrack, baseTrack;

  if (pattern === "left") {
    crosswindTrack = normalizeAngle(rwyHdg + 90);
    downwindTrack = normalizeAngle(rwyHdg + 180);
    baseTrack = normalizeAngle(rwyHdg - 90);
  } else {
    crosswindTrack = normalizeAngle(rwyHdg - 90);
    downwindTrack = normalizeAngle(rwyHdg + 180);
    baseTrack = normalizeAngle(rwyHdg + 90);
  }

  return { crosswindTrack, downwindTrack, baseTrack };
}

// Main calculation function
function compute() {
  // Get inputs
  const rwHeading = parseFloat(document.getElementById("rwHeading").value);
  const pattern = document.getElementById("pattern").value;
  const windDir = parseFloat(document.getElementById("windDir").value);
  const windSpeed = parseFloat(document.getElementById("windSpeed").value);
  const speedCrosswind = parseFloat(document.getElementById("speedCrosswind").value);
  const speedDownwind = parseFloat(document.getElementById("speedDownwind").value);
  const speedBase = parseFloat(document.getElementById("speedBase").value);

  // Validate inputs
  if (isNaN(rwHeading) || isNaN(windDir) || isNaN(windSpeed) ||
      isNaN(speedCrosswind) || isNaN(speedDownwind) || isNaN(speedBase)) {
    alert("Please fill in all fields with valid numbers.");
    return;
  }

  if (rwHeading < 0 || rwHeading > 360 || windDir < 0 || windDir > 360) {
    alert("Headings and wind direction must be between 0 and 360 degrees.");
    return;
  }

  if (windSpeed < 0 || speedCrosswind <= 0 || speedDownwind <= 0 || speedBase <= 0) {
    alert("Speeds must be positive numbers.");
    return;
  }

  // Calculate tracks for each leg
  const tracks = calculateCircuitTracks(rwHeading, pattern);

  // Calculate headings with wind correction for each leg
  const crosswind = calculateHeading(tracks.crosswindTrack, windDir, windSpeed, speedCrosswind);
  const downwind = calculateHeading(tracks.downwindTrack, windDir, windSpeed, speedDownwind);
  const base = calculateHeading(tracks.baseTrack, windDir, windSpeed, speedBase);

  // Display results
  if (crosswind.error) {
    document.getElementById("crosswindHeading").textContent = "—°";
    document.getElementById("crosswindMeta").textContent = crosswind.error;
  } else {
    document.getElementById("crosswindHeading").textContent = crosswind.heading + "°";
    document.getElementById("crosswindMeta").textContent =
      `Track: ${crosswind.track}° | WCA: ${crosswind.wca}° | GS: ${crosswind.groundSpeed} kts`;
  }

  if (downwind.error) {
    document.getElementById("downwindHeading").textContent = "—°";
    document.getElementById("downwindMeta").textContent = downwind.error;
  } else {
    document.getElementById("downwindHeading").textContent = downwind.heading + "°";
    document.getElementById("downwindMeta").textContent =
      `Track: ${downwind.track}° | WCA: ${downwind.wca}° | GS: ${downwind.groundSpeed} kts`;
  }

  if (base.error) {
    document.getElementById("baseHeading").textContent = "—°";
    document.getElementById("baseMeta").textContent = base.error;
  } else {
    document.getElementById("baseHeading").textContent = base.heading + "°";
    document.getElementById("baseMeta").textContent =
      `Track: ${base.track}° | WCA: ${base.wca}° | GS: ${base.groundSpeed} kts`;
  }
}

// Event listeners
document.getElementById("compute").addEventListener("click", compute);

// Optional: Compute on Enter key in any input field
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      compute();
    }
  });
});
