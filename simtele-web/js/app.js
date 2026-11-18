/* SIMTELE-WEB | Lógica de los cuatro módulos */
"use strict";

// Imágenes panorámicas de portada. Puedes reemplazar estas direcciones por fotografías propias.
const heroImages = [
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85"
];

let currentSlide = 0;
let slideTimer;
const hero = document.querySelector(".hero");
const slideDots = document.querySelectorAll(".slide-dot");
const slideCurrent = document.getElementById("slideCurrent");

function showSlide(index) {
  currentSlide = index;
  hero.style.backgroundImage = `url("${heroImages[index]}")`;
  slideDots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  slideCurrent.textContent = String(index + 1).padStart(2, "0");
}

function startSlideShow() {
  slideTimer = setInterval(() => showSlide((currentSlide + 1) % heroImages.length), 6000);
}

slideDots.forEach(dot => {
  dot.addEventListener("click", () => {
    clearInterval(slideTimer);
    showSlide(Number(dot.dataset.slide));
    startSlideShow();
  });
});
startSlideShow();

// Menú adaptable para pantallas pequeñas.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = `form-message ${type}`;
}

function readNumber(inputId) {
  const input = document.getElementById(inputId);
  const rawValue = input.value.trim();
  if (rawValue === "") return { valid: false, message: "Completa todos los campos obligatorios." };
  const value = Number.parseFloat(rawValue);
  if (!Number.isFinite(value)) return { valid: false, message: "Introduce un valor numérico válido." };
  return { valid: true, value };
}

// MÓDULO 1: Detención de emergencia.
document.getElementById("brakeForm").addEventListener("submit", event => {
  event.preventDefault();
  const speed = readNumber("speed");
  const reactionTime = readNumber("reactionTime");

  if (!speed.valid || !reactionTime.valid) {
    showMessage("brakeMessage", !speed.valid ? speed.message : reactionTime.message, "error");
    return;
  }
  if (speed.value <= 0 || speed.value > 200) {
    showMessage("brakeMessage", "La velocidad debe ser mayor que 0 y no superar 200 km/h.", "error");
    return;
  }
  if (reactionTime.value <= 0 || reactionTime.value > 30) {
    showMessage("brakeMessage", "El tiempo debe ser mayor que 0 y no superar 30 segundos.", "error");
    return;
  }

  const distance = (speed.value / 3.6) * reactionTime.value;
  const roundedDistance = distance.toFixed(2);
  const isLow = distance <= 30;
  document.getElementById("distanceValue").textContent = roundedDistance;
  document.getElementById("brakeStatus").textContent = isLow ? "Nivel bajo" : "Nivel de atención";
  document.getElementById("brakeExplanation").textContent = isLow
    ? "Según el umbral ficticio de esta práctica, la distancia estimada se encuentra en el nivel bajo."
    : "Según el umbral ficticio de esta práctica, la distancia estimada supera los 30 metros y requiere atención.";
  showMessage("brakeMessage", "Cálculo realizado correctamente.", "success");
});

// MÓDULO 2: Mantenimiento. Arreglo de objetos, push() y splice().
let maintenanceRecords = JSON.parse(localStorage.getItem("simteleMaintenance") || "[]");

function saveMaintenance() {
  localStorage.setItem("simteleMaintenance", JSON.stringify(maintenanceRecords));
}

function renderMaintenance() {
  const table = document.getElementById("maintenanceTable");
  const count = maintenanceRecords.length;
  document.getElementById("maintenanceCount").textContent = String(count).padStart(2, "0");
  document.getElementById("tableCount").textContent = `${count} REGISTRO${count === 1 ? "" : "S"}`;

  if (count === 0) {
    table.innerHTML = '<tr class="empty-row"><td colspan="4">Aún no hay componentes registrados.</td></tr>';
    return;
  }

  table.innerHTML = "";
  maintenanceRecords.forEach((record, index) => {
    const row = document.createElement("tr");
    const statusLabel = record.status === "normal" ? "Normal" : record.status === "revision" ? "Revisión" : "Urgente";
    row.innerHTML = `
      <td>${escapeHTML(record.component)}</td>
      <td>${record.hours.toLocaleString("es-BO")}</td>
      <td><span class="state-pill state-${record.status}">${statusLabel}</span></td>
      <td><button class="delete-btn" type="button" data-delete-maintenance="${index}" aria-label="Eliminar ${escapeHTML(record.component)}">Eliminar</button></td>
    `;
    table.appendChild(row);
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

document.getElementById("maintenanceForm").addEventListener("submit", event => {
  event.preventDefault();
  const component = document.getElementById("component").value.trim();
  const hours = readNumber("usageHours");
  const status = document.getElementById("componentStatus").value;

  if (!component || !hours.valid || !status) {
    showMessage("maintenanceMessage", !component ? "Escribe el nombre del componente." : !hours.valid ? hours.message : "Selecciona el estado del componente.", "error");
    return;
  }
  if (hours.value < 0 || hours.value > 100000) {
    showMessage("maintenanceMessage", "Las horas deben estar entre 0 y 100 000.", "error");
    return;
  }

  maintenanceRecords.push({ component, hours: hours.value, status });
  saveMaintenance();
  renderMaintenance();
  event.target.reset();
  showMessage("maintenanceMessage", "Componente agregado correctamente a la tabla.", "success");
});

document.getElementById("maintenanceTable").addEventListener("click", event => {
  const button = event.target.closest("[data-delete-maintenance]");
  if (!button) return;
  const index = Number(button.dataset.deleteMaintenance);
  maintenanceRecords.splice(index, 1);
  saveMaintenance();
  renderMaintenance();
});

document.getElementById("clearMaintenance").addEventListener("click", () => {
  maintenanceRecords = [];
  saveMaintenance();
  renderMaintenance();
  showMessage("maintenanceMessage", "Se limpiaron los registros de mantenimiento.", "success");
});

// MÓDULO 3: Viento y oscilación. Arreglo, for, forEach, suma y condicionales.
const windInputs = ["wind1", "wind2", "wind3", "wind4", "wind5"];

document.getElementById("windForm").addEventListener("submit", event => {
  event.preventDefault();
  const windMeasurements = [];

  for (let i = 0; i < windInputs.length; i++) {
    const measurement = readNumber(windInputs[i]);
    if (!measurement.valid) {
      showMessage("windMessage", `Medición ${i + 1}: ${measurement.message}`, "error");
      return;
    }
    if (measurement.value < 0 || measurement.value > 200) {
      showMessage("windMessage", `La medición ${i + 1} debe estar entre 0 y 200 km/h.`, "error");
      return;
    }
    windMeasurements.push(measurement.value);
  }

  let sum = 0;
  windMeasurements.forEach(value => { sum += value; });
  const average = sum / windMeasurements.length;
  let maximum = windMeasurements[0];
  for (let i = 1; i < windMeasurements.length; i++) {
    if (windMeasurements[i] > maximum) maximum = windMeasurements[i];
  }

  let classification;
  let description;
  if (average <= 20) {
    classification = "Viento leve";
    description = "El promedio se encuentra en el rango leve de esta clasificación educativa.";
  } else if (average <= 40) {
    classification = "Viento moderado";
    description = "El promedio se encuentra en el rango moderado de esta clasificación educativa.";
  } else {
    classification = "Viento intenso";
    description = "El promedio supera los 40 km/h dentro de los umbrales ficticios de esta práctica.";
  }

  document.getElementById("windAverage").textContent = average.toFixed(2);
  document.getElementById("windMaximum").textContent = maximum.toFixed(2);
  document.getElementById("windAverageCard").textContent = average.toFixed(1);
  document.getElementById("windClass").textContent = classification;
  document.getElementById("windDescription").textContent = description;
  document.getElementById("windMeterFill").style.width = `${Math.min(average, 100)}%`;
  showMessage("windMessage", "Las cinco mediciones fueron analizadas correctamente.", "success");
});

// MÓDULO 4: Sensores. Expresión regular, test() y validación de lectura.
let sensorRecords = JSON.parse(localStorage.getItem("simteleSensors") || "[]");
const sensorPattern = /^SEN-\d{3}$/;

function saveSensors() {
  localStorage.setItem("simteleSensors", JSON.stringify(sensorRecords));
}

function renderSensors() {
  const list = document.getElementById("sensorList");
  const count = sensorRecords.length;
  document.getElementById("sensorCount").textContent = String(count).padStart(2, "0");
  document.getElementById("sensorTableCount").textContent = `${count} REGISTRO${count === 1 ? "" : "S"}`;

  if (count === 0) {
    list.innerHTML = '<div class="sensor-empty">Los sensores validados aparecerán aquí.</div>';
    return;
  }
  list.innerHTML = "";
  sensorRecords.forEach((sensor, index) => {
    const item = document.createElement("div");
    item.className = "sensor-item";
    item.innerHTML = `
      <div><div class="sensor-code">${escapeHTML(sensor.code)}</div><div class="sensor-type">${escapeHTML(sensor.type)}</div></div>
      <div class="sensor-reading">${sensor.reading} <small>LECTURA</small></div>
      <button class="delete-btn" type="button" data-delete-sensor="${index}" aria-label="Eliminar sensor ${escapeHTML(sensor.code)}">Eliminar</button>
    `;
    list.appendChild(item);
  });
}

document.getElementById("sensorForm").addEventListener("submit", event => {
  event.preventDefault();
  const code = document.getElementById("sensorCode").value.trim().toUpperCase();
  const type = document.getElementById("sensorType").value;
  const reading = readNumber("sensorReading");

  if (!code) {
    showMessage("sensorMessage", "El código del sensor no puede estar vacío.", "error");
    return;
  }
  if (!sensorPattern.test(code)) {
    showMessage("sensorMessage", "Código inválido. Utiliza el formato SEN-001 (tres dígitos).", "error");
    return;
  }
  if (!type) {
    showMessage("sensorMessage", "Selecciona el tipo de sensor.", "error");
    return;
  }
  if (!reading.valid) {
    showMessage("sensorMessage", reading.message, "error");
    return;
  }
  if (reading.value < -100000 || reading.value > 100000) {
    showMessage("sensorMessage", "La lectura debe estar entre -100 000 y 100 000.", "error");
    return;
  }
  if (sensorRecords.some(sensor => sensor.code === code)) {
    showMessage("sensorMessage", "Ese código ya está registrado. Utiliza uno diferente.", "error");
    return;
  }

  sensorRecords.push({ code, type, reading: reading.value });
  saveSensors();
  renderSensors();
  event.target.reset();
  showMessage("sensorMessage", `${code} validado y registrado correctamente.`, "success");
});

document.getElementById("sensorList").addEventListener("click", event => {
  const button = event.target.closest("[data-delete-sensor]");
  if (!button) return;
  sensorRecords.splice(Number(button.dataset.deleteSensor), 1);
  saveSensors();
  renderSensors();
});

document.getElementById("clearSensors").addEventListener("click", () => {
  sensorRecords = [];
  saveSensors();
  renderSensors();
  showMessage("sensorMessage", "Se limpiaron los registros de sensores.", "success");
});

// Render inicial: recupera los registros guardados en localStorage.
renderMaintenance();
renderSensors();
