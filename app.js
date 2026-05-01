const icons = {
  range: '<path d="M4 12h3m10 0h3M8 7a6 6 0 0 1 8 0M8 17a6 6 0 0 0 8 0M10 10a3 3 0 0 1 4 0M10 14a3 3 0 0 0 4 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M12 9v7"/>',
  motion: '<path d="M4 18c3-4 5-6 8-6s5 2 8 6"/><path d="M7 12c2-3 3.5-4 5-4s3 1 5 4"/><circle cx="12" cy="5" r="2"/>',
  dial: '<circle cx="12" cy="12" r="8"/><path d="M12 12 16 8"/><path d="M8 18h8"/>',
  track: '<path d="M5 19c3-8 11-6 14-14"/><path d="M4 11h4m8 2h4M8 5h4"/>',
  wave: '<path d="M4 12h2l2-5 4 10 3-7 2 2h3"/>',
  touch: '<path d="M8 11V7a2 2 0 1 1 4 0v4"/><path d="M12 10V5a2 2 0 1 1 4 0v7"/><path d="M16 11v1a5 5 0 0 1-10 0v-1"/>',
  tilt: '<path d="M4 17 17 4"/><circle cx="8" cy="14" r="2"/><path d="M14 18h6"/>',
  joystick: '<path d="M12 4v8"/><circle cx="12" cy="4" r="2"/><path d="M6 20h12l-2-8H8l-2 8Z"/>',
  drop: '<path d="M12 3s6 6.3 6 11a6 6 0 0 1-12 0c0-4.7 6-11 6-11Z"/>',
  axis: '<path d="M12 12 4 8m8 4 7-5m-7 5v8"/><path d="M4 8v5l8 4 8-5V7l-8-4-8 5Z"/>'
};

const state = {
  activeType: "all",
  search: ""
};

function iconSvg(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.axis}</svg>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function pinRows(pins) {
  return pins.map(([label, target]) => `<li><span>${label}</span><strong>${target}</strong></li>`).join("");
}

function codeBlock(code, id) {
  return `
    <div class="code-shell">
      <button class="icon-button copy-button" data-copy="${id}" aria-label="Copy Arduino code">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h10v12H8z"/><path d="M6 16H4V4h12v2"/></svg>
        <span>Copy</span>
      </button>
      <pre><code id="${id}">${escapeHtml(code)}</code></pre>
    </div>
  `;
}

function sensorCard(sensor) {
  const searchText = [
    sensor.name,
    sensor.part,
    sensor.kit,
    sensor.type,
    sensor.intro,
    sensor.workshopUse,
    sensor.pins.flat().join(" "),
    sensor.notes.join(" ")
  ].join(" ").toLowerCase();

  return `
    <article class="card sensor-card" data-type="${sensor.type}" data-search="${escapeHtml(searchText)}">
      <button class="card-summary" aria-expanded="false" aria-controls="${sensor.id}-panel">
        <span class="icon-badge">${iconSvg(sensor.icon)}</span>
        <span class="card-title">
          <strong>${sensor.name}</strong>
          <small>${sensor.part} - ${sensor.kit}</small>
        </span>
        <span class="type-chip">${sensor.type}</span>
        <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="card-panel" id="${sensor.id}-panel" hidden>
        <p class="intro">${sensor.intro}</p>
        <div class="detail-layout">
          <div>
            <h3>${sensor.connectionTitle || "Wiring"}</h3>
            <ul class="pin-list">${pinRows(sensor.pins)}</ul>
          </div>
          <div>
            <h3>Workshop Use</h3>
            <p>${sensor.workshopUse}</p>
          </div>
          <div>
            <h3>Notes</h3>
            <ul class="notes">${sensor.notes.map((note) => `<li>${note}</li>`).join("")}</ul>
          </div>
        </div>
        ${sensor.code ? `<h3>${sensor.codeTitle || "Starter Code"}</h3>${codeBlock(sensor.code, `${sensor.id}-code`)}` : ""}
      </div>
    </article>
  `;
}

function exampleCard(example) {
  return `
    <article class="card example-card">
      <button class="card-summary" aria-expanded="false" aria-controls="${example.id}-panel">
        <span class="icon-badge system-icon">${iconSvg("axis")}</span>
        <span class="card-title">
          <strong>${example.name}</strong>
          <small>${example.parts.join(" + ")}</small>
        </span>
        <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="card-panel" id="${example.id}-panel" hidden>
        <p class="intro">${example.concept}</p>
        <div class="system-pattern">${example.pattern}</div>
        <div class="detail-layout two-column">
          <div>
            <h3>Build</h3>
            <ul class="notes">${example.build.map((step) => `<li>${step}</li>`).join("")}</ul>
          </div>
          <div>
            <h3>Parts</h3>
            <ul class="pin-list">${example.parts.map((part) => `<li><span>${part}</span><strong>kit</strong></li>`).join("")}</ul>
          </div>
        </div>
        <h3>Arduino Sketch</h3>
        ${codeBlock(example.code, `${example.id}-code`)}
      </div>
    </article>
  `;
}

function renderSensors() {
  const grid = document.querySelector("#sensor-grid");
  const filters = document.querySelector("#sensor-filters");
  if (!grid || !filters) return;

  const types = ["all", ...Array.from(new Set(sensors.map((sensor) => sensor.type)))];
  filters.innerHTML = types.map((type) => `
    <button class="filter-button ${type === "all" ? "active" : ""}" data-type="${type}" type="button">${type}</button>
  `).join("");

  grid.innerHTML = sensors.map(sensorCard).join("");

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    state.activeType = button.dataset.type;
    filters.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    filterSensors();
  });

  document.querySelector("#sensor-search").addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    filterSensors();
  });
}

function renderInventory() {
  const target = document.querySelector("#inventory-pills");
  if (!target || !Array.isArray(inventorySummary)) return;
  target.innerHTML = inventorySummary.map((item) => `<span>${item}</span>`).join("");
}

function filterSensors() {
  document.querySelectorAll(".sensor-card").forEach((card) => {
    const matchesType = state.activeType === "all" || card.dataset.type === state.activeType;
    const matchesSearch = !state.search || card.dataset.search.includes(state.search);
    card.hidden = !(matchesType && matchesSearch);
  });
}

function renderExamples() {
  const grid = document.querySelector("#examples-grid");
  const actuatorGrid = document.querySelector("#actuator-grid");
  if (!grid || !actuatorGrid) return;

  actuatorGrid.innerHTML = actuatorNotes.map((actuator) => `
    <article class="actuator-card">
      <h3>${actuator.name}</h3>
      <p>${actuator.use}</p>
      <dl>
        <div><dt>Pins</dt><dd>${actuator.pins}</dd></div>
        <div><dt>Care</dt><dd>${actuator.caution}</dd></div>
      </dl>
    </article>
  `).join("");

  grid.innerHTML = examples.map(exampleCard).join("");
}

function bindExpandableCards() {
  document.addEventListener("click", (event) => {
    const summary = event.target.closest(".card-summary");
    if (!summary) return;
    const panel = document.getElementById(summary.getAttribute("aria-controls"));
    const expanded = summary.getAttribute("aria-expanded") === "true";
    summary.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  });
}

function bindCopyButtons() {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".copy-button");
    if (!button) return;

    const code = document.getElementById(button.dataset.copy).innerText;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    button.classList.add("copied");
    button.querySelector("span").textContent = "Copied";
    setTimeout(() => {
      button.classList.remove("copied");
      button.querySelector("span").textContent = "Copy";
    }, 1200);
  });
}

renderInventory();
renderSensors();
renderExamples();
bindExpandableCards();
bindCopyButtons();
