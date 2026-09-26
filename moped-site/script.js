/* =====================================================================
   EDIT THIS SECTION to change your business info, prices, and hours.
   You shouldn't need to touch anything below the "RENDERING" line.
   ===================================================================== */

const CONFIG = {
  businessName: "BackyardMechanic",
  email: "williams.truman34@gmail.com",
  mobileFee: "$10–15",               // added for on-site (mobile) jobs
  timeZone: "Pacific/Honolulu",
};

// Weekly availability. Days: 0=Sun, 1=Mon, ... 6=Sat. Hours are 24h format.
// A day can have more than one block, e.g. [[9, 11], [14, 17]].
const AVAILABILITY = {
  1: [[17, 19]],   // Monday    5–7 PM
  3: [[14, 18]],   // Wednesday 2–6 PM
  6: [[14, 17]],   // Saturday  2–5 PM
};

// price = labor. Parts are billed separately at cost.
const SERVICES = {
  simple: [
    { name: "Oil change",            price: "$25 + parts", desc: "Drain, new engine oil, check drain plug & screen.", time: "~20 min" },
    { name: "Air filter replacement",price: "$15 + parts", desc: "Remove, inspect airbox, install new filter.",      time: "~15 min" },
    { name: "Spark plug replacement",price: "$20 + parts", desc: "New plug, gapped to spec. Old plug checked for clues.", time: "~20 min" },
    { name: "Quick-service bundle",  price: "$45", desc: "Oil + air filter + spark plug together. Save $15.", time: "~45 min" },
    { name: "Gear oil change",       price: "$25 + parts", desc: "Final-drive gear oil drain and refill.",            time: "~20 min" },
    { name: "Brake adjustment",      price: "$30 + parts", desc: "Adjust drum/cable brakes, check pads and shoes.",   time: "~40 min" },
    { name: "Battery test / install",price: "$15 + parts", desc: "Check battery voltage; install new or charge if needed.", time: "~15 min" },
    { name: "Bulb replacement",      price: "$10 + parts", desc: "Headlight, tail, or turn signal bulbs.",            time: "~20 min" },
  ],
  complex: [
    { name: "Carburetor cleaning",     price: "$70", desc: "Full teardown, ultrasonic/solvent clean, jets and passages cleared, idle set.", time: "1.5–2 hrs" },
    { name: "Carburetor replacement",  price: "$60 + parts",    desc: "Install new carb, tune idle and mixture. Carb billed as part.", time: "~1 hr" },
    { name: "Valve adjustment",        price: "$70–90", desc: "Set valve clearances to spec. Fixes ticking, hard starts, power loss.", time: "1.5–2 hrs" },
    { name: "CVT belt replacement",    price: "$50–70 + parts", desc: "New drive belt, inspect rollers and clutch.", time: "~1 hr" }, ],
  car: [
    { name: "Code scan + once-over",   price: "$30",    desc: "OBD2 scan with BlueDriver, explanation of codes, and a flashlight inspection of the engine bay and underside.", time: "~30 min" },
  ],
};

/* ============================ RENDERING ============================ */

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Format 17 -> "5 PM", 14.5 -> "2:30 PM"
function fmtHour(h) {
  const hour = Math.floor(h);
  const min = Math.round((h - hour) * 60);
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return min ? `${h12}:${String(min).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
}

function fmtBlock([start, end]) {
  return `${fmtHour(start)} – ${fmtHour(end)}`;
}

// Current day and hour in Hawaii, no matter where the visitor is.
function nowInHawaii() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CONFIG.timeZone,
    weekday: "short", hour: "numeric", minute: "numeric", hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const hour = (Number(get("hour")) % 24) + Number(get("minute")) / 60;
  return { day, hour };
}

function renderServices() {
  const makeCard = (s) => `
    <article class="card">
      <div class="card-head"><h4>${s.name}</h4><span class="price">${s.price}</span></div>
      <p>${s.desc}</p>
      <span class="time">⏱ ${s.time}</span>
    </article>`;
  document.getElementById("simple-services").innerHTML = SERVICES.simple.map(makeCard).join("");
  document.getElementById("complex-services").innerHTML = SERVICES.complex.map(makeCard).join("");
  document.getElementById("car-services").innerHTML = SERVICES.car.map(makeCard).join("");
  document.getElementById("mobile-fee-note").textContent =
    `Mobile service: quick services only, within Laie, add ${CONFIG.mobileFee}. Kahuku, Hau'ula, and all specialist jobs are drop-off at the garage. Specialist quotes are ranges because older or neglected engines take longer; I'll confirm the price before starting.`;
}

function renderAvailability() {
  const { day: today, hour } = nowInHawaii();

  // Week grid
  document.getElementById("week-grid").innerHTML = DAY_NAMES.map((name, i) => {
    const blocks = AVAILABILITY[i];
    const classes = ["day", blocks ? "available" : "", i === today ? "today" : ""].join(" ");
    const hoursText = blocks ? blocks.map(fmtBlock).join("<br>") : "Closed";
    return `<div class="${classes}"><div class="day-name">${name}</div><div class="day-hours">${hoursText}</div></div>`;
  }).join("");

  // Open-now pill
  const pill = document.getElementById("open-status");
  const current = (AVAILABILITY[today] || []).find(([s, e]) => hour >= s && hour < e);
  if (current) {
    pill.textContent = `● Open now until ${fmtHour(current[1])}`;
    pill.className = "status-pill open";
  } else {
    pill.textContent = "● Closed right now";
    pill.className = "status-pill closed";
  }

  // Next opening
  document.getElementById("next-open").textContent = current ? "" : `Next available: ${findNextOpening(today, hour)}`;
}

function findNextOpening(today, hour) {
  for (let offset = 0; offset < 8; offset++) {
    const d = (today + offset) % 7;
    for (const [start] of AVAILABILITY[d] || []) {
      if (offset > 0 || start > hour) {
        const label = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : DAY_NAMES[d];
        return `${label} at ${fmtHour(start)}`;
      }
    }
  }
  return "Send a request and I'll reply with a time.";
}

function populateForm() {
  const serviceSelect = document.getElementById("service-select");
  const all = [
    ...SERVICES.simple.map((s) => ({ ...s, group: "Quick services" })),
    ...SERVICES.complex.map((s) => ({ ...s, group: "Specialist services" })),
    ...SERVICES.car.map((s) => ({ ...s, group: "Cars" })),
  ];
  const groups = [...new Set(all.map((s) => s.group))];
  serviceSelect.innerHTML =
    `<option value="">Choose a service…</option>` +
    groups.map((g) => `<optgroup label="${g}">` +
      all.filter((s) => s.group === g).map((s) => `<option>${s.name} (${s.price})</option>`).join("") +
      `</optgroup>`).join("") +
    `<option>Something else / not sure — see details</option>`;

  const slotSelect = document.getElementById("slot-select");
  const slots = Object.entries(AVAILABILITY).flatMap(([d, blocks]) =>
    blocks.map((b) => `${DAY_NAMES[d]} ${fmtBlock(b)}`));
  slotSelect.innerHTML = slots.map((s) => `<option>${s}</option>`).join("") +
    `<option>Other time — see details</option>`;
}

function handleForm() {
  const form = document.getElementById("request-form");
  const error = document.getElementById("form-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    if (!data.name.trim() || !data.vehicle.trim() || !data.service) {
      error.textContent = "Please fill in your name, vehicle, and service.";
      return;
    }
    const isSpecialist = SERVICES.complex.some((s) => data.service.startsWith(s.name));
    if (isSpecialist && data.where.startsWith("Mobile")) {
      error.textContent = "Specialist jobs are done at the garage. Please choose drop-off.";
      return;
    }
    error.textContent = "";

    const subject = `Service request: ${data.service.split(" (")[0]} — ${data.name}`;
    const body = [
      `Name: ${data.name}`,
      `Phone: ${data.phone || "—"}`,
      `Vehicle: ${data.vehicle}`,
      `Service: ${data.service}`,
      `Preferred time: ${data.slot}`,
      `Location: ${data.where}`,
      ``,
      `Details:`,
      data.details || "—",
    ].join("\n");

    window.location.href =
      `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function fillBusinessInfo() {
  document.getElementById("biz-name").textContent = CONFIG.businessName;
  document.querySelector(".biz-name-footer").textContent = CONFIG.businessName;
  document.title = CONFIG.businessName;
  const link = document.getElementById("email-link");
  link.href = `mailto:${CONFIG.email}`;
  link.textContent = CONFIG.email;
  document.getElementById("year").textContent = new Date().getFullYear();
}

fillBusinessInfo();
renderServices();
renderAvailability();
populateForm();
handleForm();
setInterval(renderAvailability, 60 * 1000); // refresh open/closed every minute
