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
