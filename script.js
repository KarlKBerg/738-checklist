"use strict";
import { checklist } from "./js/checks.js";

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
    } else {
      checkDiv.classList.remove("completed");
      squareDiv.classList.remove("square-completed");
    }
    container.appendChild(checkDiv);
    checkDiv.appendChild(squareDiv);
    squareDiv.appendChild(checkIcon);
    checkDiv.appendChild(item);
    if (check.slc) {
      checkDiv.appendChild(slc);
    }
    checkDiv.appendChild(divider);
    checkDiv.appendChild(value);
  });
}
displayChecklist(currentStage);
/*
const stateContainer = document.querySelector(".checklist-state");
const state = stateContainer.querySelectorAll("span");

state.forEach((s) => {
  s.addEventListener("click", (event) => {
    state.forEach((el) => el.classList.remove("active"));
    event.target.classList.add("active");
    // show/hide checklists
    const checklistContainer = document.querySelector(".checklists-container");
    const checklist = checklistContainer.querySelectorAll(".each");
    let clickedChecklist = event.currentTarget.dataset.checklist;
    checklist.forEach((el) => {
      el.classList.toggle("hidden", el.dataset.checklist !== clickedChecklist);
    });
  });
});

*/
