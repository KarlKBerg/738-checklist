"use strict";
import { checklist } from "./js/checks.js";

const stages = [
  "preflight",
  "before-start",
  "before-taxi",
  "before-takeoff",
  "after-takeoff",
  "cruise",
  "descent",
  "approach",
  "landing",
  "after-landing",
  "shutdown",
  "securing-aircraft",
];

let currentStage = stages[0];

// ==== PERSISTENCE (optional, delete this block to remove) ====
const STORAGE_KEY = "b738-checklist-state";

function saveState() {
  const state = {
    currentStage,
    completed: checklist.map((c) => c.completed),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    if (stages.includes(state.currentStage)) currentStage = state.currentStage;
    if (Array.isArray(state.completed)) {
      // Only restore if the checklist length matches, so editing
      // checks.js doesn't misalign saved flags with the wrong items.
      if (state.completed.length === checklist.length) {
        checklist.forEach(
          (c, i) => (c.completed = Boolean(state.completed[i])),
        );
      }
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ==== HELPERS ====

function stageLabel(stage) {
  return stage.toUpperCase().replaceAll("-", " ");
}

function stageTitle(stage) {
  const withSpaces = stage.replaceAll("-", " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function checksForStage(stage) {
  return checklist.filter((c) => c.stage === stage);
}

function stageIsComplete(stage) {
  const checks = checksForStage(stage);
  return checks.length > 0 && checks.every((c) => c.completed);
}

// Re-render everything that depends on state. One entry point means
// no caller can forget to update part of the UI.
function render() {
  displayChecklist();
  displaySidebarStages();
  updateText();
}

// ==== CHECKLIST ====

function displayChecklist() {
  const container = document.querySelector(".checklist-container");
  if (!container) return;
  container.innerHTML = "";

  // PREV / NEXT navigation
  const navDiv = document.createElement("div");
  navDiv.classList.add("next-pre-btn-div");

  const prevBtn = document.createElement("button");
  prevBtn.classList.add("prev-btn", "nav-btn");
  prevBtn.textContent = "PREV";
  if (currentStage === stages[0]) prevBtn.classList.add("invis");

  const nextBtn = document.createElement("button");
  nextBtn.classList.add("next-btn", "nav-btn");
  nextBtn.textContent = "NEXT";
  if (currentStage === stages.at(-1)) nextBtn.classList.add("invis");

  navDiv.append(prevBtn, nextBtn);
  container.appendChild(navDiv);

  // Checks for the current stage. dataset.index stores the item's
  // position in the full checklist array, so the click handler can
  // find it without matching on displayed text.
  checklist.forEach((check, index) => {
    if (check.stage !== currentStage) return;

    const checkDiv = document.createElement("div");
    checkDiv.classList.add("check");
    checkDiv.dataset.index = index;
    // Keyboard + screen reader support
    checkDiv.setAttribute("role", "checkbox");
    checkDiv.setAttribute("aria-checked", String(check.completed));
    checkDiv.tabIndex = 0;

    const squareDiv = document.createElement("div");
    squareDiv.classList.add("square");

    const checkIcon = document.createElement("i");
    checkIcon.classList.add("fa-solid", "fa-check");

    const item = document.createElement("span");
    item.classList.add("item");
    item.textContent = check.item;

    const divider = document.createElement("hr");
    divider.classList.add("divider");

    const value = document.createElement("span");
    value.classList.add("value");
    value.textContent = check.value;

    if (check.completed) {
      checkDiv.classList.add("completed");
      squareDiv.classList.add("square-completed");
    } else {
      checkIcon.classList.add("invis");
    }

    squareDiv.appendChild(checkIcon);
    checkDiv.append(squareDiv, item);

    if (check.slc) {
      const slc = document.createElement("span");
      slc.classList.add("slc");
      slc.textContent = "SLC";
      checkDiv.appendChild(slc);
    }

    checkDiv.append(divider, value);
    container.appendChild(checkDiv);
  });

  if (stageIsComplete(currentStage)) {
    displayCompleteBanner(container);
  }
}

function displayCompleteBanner(container) {
  const completeDiv = document.createElement("div");
  completeDiv.classList.add("complete-div");

  const message = document.createElement("span");
  message.classList.add("checklist-complete");
  message.textContent = "CHECKLIST COMPLETE";

  completeDiv.appendChild(message);

  // No NEXT on the final stage — nowhere to go
  if (currentStage !== stages.at(-1)) {
    const button = document.createElement("button");
    button.classList.add("next-complete-btn");
    button.textContent = "NEXT";
    completeDiv.appendChild(button);
  }

  container.appendChild(completeDiv);
}

// ==== SIDEBAR ====

function displaySidebarStages() {
  const container = document.querySelector(".menu");
  if (!container) return;
  container.innerHTML = "";

  stages.forEach((stage) => {
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("menu-item");
    // Store the stage id directly — no lowercasing/re-hyphenating later
    buttonDiv.dataset.stage = stage;
    if (stage === currentStage) buttonDiv.classList.add("active");

    const buttonName = document.createElement("span");
    buttonName.classList.add("inter", "stage-name");
    buttonName.textContent = stageLabel(stage);

    const itemCompletion = document.createElement("span");
    itemCompletion.classList.add("menu-item-completion", "inter");
    const checks = checksForStage(stage);
    const done = checks.filter((c) => c.completed).length;
    itemCompletion.textContent = `${done}/${checks.length}`;

    buttonDiv.append(buttonName, itemCompletion);
    container.appendChild(buttonDiv);
  });
}

// ==== HEADER ====

function updateText() {
  const phaseNameBig = document.getElementById("phase-name-big");
  const phaseName = document.getElementById("phase-info-name");
  const phaseNumber = document.getElementById("phase-number-info");

  phaseName.textContent = stageLabel(currentStage);
  phaseNameBig.textContent = stageTitle(currentStage);

  const phase = String(stages.indexOf(currentStage) + 1).padStart(2, "0");
  phaseNumber.textContent = `PHASE ${phase}`;
}

// ==== STATE CHANGES ====

function goToStage(stage) {
  if (!stages.includes(stage)) return;
  currentStage = stage;
  saveState();
  render();
}

function nextStage() {
  const i = stages.indexOf(currentStage);
  if (i < stages.length - 1) goToStage(stages[i + 1]);
}

function prevStage() {
  const i = stages.indexOf(currentStage);
  if (i > 0) goToStage(stages[i - 1]);
}

function toggleCheck(index) {
  const check = checklist[index];
  if (!check) return;
  check.completed = !check.completed;
  saveState();
  render();
}

function resetList() {
  checksForStage(currentStage).forEach((c) => (c.completed = false));
  saveState();
  render();
}

function resetAll() {
  checklist.forEach((c) => (c.completed = false));
  currentStage = stages[0];
  saveState();
  render();
}

// ==== EVENT DELEGATION ====
// One listener per container, attached once. Re-rendering never
// requires re-wiring anything.

document
  .querySelector(".checklist-container")
  .addEventListener("click", (event) => {
    const check = event.target.closest(".check");
    if (check) {
      toggleCheck(Number(check.dataset.index));
      return;
    }
    if (event.target.closest(".next-btn, .next-complete-btn")) nextStage();
    else if (event.target.closest(".prev-btn")) prevStage();
  });

// Space/Enter toggles the focused check
document
  .querySelector(".checklist-container")
  .addEventListener("keydown", (event) => {
    if (event.key !== " " && event.key !== "Enter") return;
    const check = event.target.closest(".check");
    if (!check) return;
    event.preventDefault();
    toggleCheck(Number(check.dataset.index));
  });

document.querySelector(".menu").addEventListener("click", (event) => {
  const item = event.target.closest(".menu-item");
  if (item) goToStage(item.dataset.stage);
});

document.querySelector(".reset-list").addEventListener("click", resetList);
document.querySelector(".reset-all").addEventListener("click", resetAll);

// ==== INIT ====
loadState();
render();
