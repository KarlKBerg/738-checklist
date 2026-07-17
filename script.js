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

let currentStage = "preflight";
function displayChecklist(stage) {
  const container = document.querySelector(".checklist-container");
  if (!container) return;
  container.innerHTML = "";

  checklist.forEach((check) => {
    const checkDiv = document.createElement("div");
    checkDiv.classList.add("check");

    const squareDiv = document.createElement("div");
    squareDiv.classList.add("square");

    const checkIcon = document.createElement("i");
    checkIcon.classList.add("fa-solid", "fa-check", "invis");

    const item = document.createElement("span");
    item.classList.add("item");
    item.textContent = check.item;

    const slc = document.createElement("span");
    slc.classList.add("slc");
    slc.textContent = "SLC";

    const divider = document.createElement("hr");
    divider.classList.add("divider");

    const value = document.createElement("span");
    value.classList.add("value");
    value.textContent = check.value;
    if (check.completed) {
      checkDiv.classList.add("completed");
      squareDiv.classList.add("square-completed");
      checkIcon.classList.remove("invis");
    } else {
      checkDiv.classList.remove("completed");
      squareDiv.classList.remove("square-completed");
      checkIcon.classList.add("invis");
    }
    // Only display checks for the current stage
    if (check.stage === currentStage) {
      container.appendChild(checkDiv);
      checkDiv.appendChild(squareDiv);
      squareDiv.appendChild(checkIcon);
      checkDiv.appendChild(item);
      if (check.slc) {
        checkDiv.appendChild(slc);
      }
      checkDiv.appendChild(divider);
      checkDiv.appendChild(value);
    }
  });
  completeCheck();
}
displayChecklist(currentStage);

// Eventlistener for completing checks
function completeCheck() {
  const checklistContainer = document.querySelector(".checklist-container");
  const checks = checklistContainer.querySelectorAll(".check");
  if (!checklistContainer || !checks) return;
  checks.forEach((c) => {
    c.addEventListener("click", (event) => {
      const clickedName = event.currentTarget.querySelector(".item").innerHTML;

      const correctCheck = checklist.filter(
        (check) => check.item === clickedName,
      );
      correctCheck[0].completed = !correctCheck[0].completed;
      displayChecklist(currentStage);
      displaySidebarStages();
    });
  });
}

// Display sidebar buttons
function displaySidebarStages() {
  const container = document.querySelector(".menu");
  if (!container) return;
  container.innerHTML = "";
  stages.forEach((stage, index) => {
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("menu-item");

    const buttonName = document.createElement("span");
    buttonName.classList.add("inter", "stage-name");
    buttonName.textContent = stage.toUpperCase().replace("-", " ");

    const itemCompletion = document.createElement("span");
    itemCompletion.classList.add("menu-item-completion", "inter");

    const checkAmounts = checklist.filter((obj) => obj.stage === stage);
    const completedAmounts = checklist.filter(
      (obj) => obj.completed && obj.stage === stage,
    );
    itemCompletion.innerText =
      completedAmounts.length + "/" + checkAmounts.length;
    if (index === 0) {
      buttonDiv.classList.add("active");
    }

    container.appendChild(buttonDiv);
    buttonDiv.appendChild(buttonName);
    buttonDiv.appendChild(itemCompletion);
  });
  const menuItem = container.querySelectorAll(".menu-item");
  menuItem.forEach((i) => {
    i.addEventListener("click", (event) => {
      menuItem.forEach((el) => el.classList.remove("active"));
      event.currentTarget.classList.add("active");
      // Set currentStage to the same value as clicked element
      const selectedStageName =
        event.currentTarget.querySelector(".stage-name").textContent;
      currentStage = selectedStageName.toLowerCase().replace(" ", "-");
      displayChecklist(currentStage);
    });
  });
}
displaySidebarStages();

const resetListButton = document.querySelector(".reset-list");
const resetAllButton = document.querySelector(".reset-all");

function resetList() {
  checklist.forEach((check) => {
    if (check.stage === currentStage) {
      check.completed = false;
    }
  });
  displayChecklist(currentStage);
  displaySidebarStages();
}
resetListButton.addEventListener("click", resetList);
resetAllButton.addEventListener("click", resetAll);
function resetAll() {
  checklist.forEach((check) => {
    check.completed = false;
  });
  currentStage = stages[0];
  displayChecklist(currentStage);
  displaySidebarStages();
}

function updateText() {
  const phaseName = document.getElementById("phase-info-name");
  const phaseNumber = document.getElementById("phase-number-info");
}
