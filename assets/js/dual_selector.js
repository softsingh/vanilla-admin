(function () {
  // Find the widget container dynamically
  const widgetRoot = document.querySelector(`[data-widget-id]`);
  if (!widgetRoot) return;

  const id = widgetRoot.dataset.widgetId;
  const fieldName = widgetRoot.dataset.fieldName;

  console.log(id)

  const chosen = document.getElementById("chosen-" + id);
  const available = document.getElementById("available-" + id);
  const searchChosen = document.getElementById("search-chosen-" + id);
  const searchAvailable = document.getElementById("search-available-" + id);
  const orderInput = document.getElementById(id + "_order");

  // Buttons
  const btnLeft = document.getElementById("btn-left-" + id);
  const btnRight = document.getElementById("btn-right-" + id);
  const btnAllLeft = document.getElementById("btn-all-left-" + id);
  const btnAllRight = document.getElementById("btn-all-right-" + id);
  const btnUp = document.getElementById("btn-up-" + id);
  const btnDown = document.getElementById("btn-down-" + id);

  // ================
  // CLICK SELECTION
  // ================
  document.querySelectorAll(".dual-list").forEach(list => {
    list.addEventListener("click", e => {
      const li = e.target.closest("li");
      if (!li) return;
      const already = li.classList.contains("selected");
      [...list.children].forEach(el => el.classList.remove("selected"));
      if (!already) li.classList.add("selected");
    });
  });

  // ================
  // MOVE FUNCTIONS
  // ================
  function moveSelected(from, to) {
    const item = from.querySelector(".selected");
    if (!item) return;
    item.classList.remove("selected");
    item.style.display = "";
    to.appendChild(item);
    updateAll();
  }

  function moveAll(from, to) {
    [...from.children].forEach(li => {
      li.classList.remove("selected");
      li.style.display = "";
      to.appendChild(li);
    });
    updateAll();
  }

  // Attach move events
  btnLeft?.addEventListener("click", () => moveSelected(available, chosen));
  btnRight?.addEventListener("click", () => moveSelected(chosen, available));
  btnAllLeft?.addEventListener("click", () => moveAll(available, chosen));
  btnAllRight?.addEventListener("click", () => moveAll(chosen, available));

  // ================
  // SORT UP / DOWN
  // ================
  btnUp?.addEventListener("click", () => {
    const item = chosen.querySelector(".selected");
    if (!item) return;
    const prev = item.previousElementSibling;
    if (prev) chosen.insertBefore(item, prev);
    updateOrder();
  });

  btnDown?.addEventListener("click", () => {
    const item = chosen.querySelector(".selected");
    if (!item) return;
    const next = item.nextElementSibling;
    if (next) chosen.insertBefore(next, item);
    updateOrder();
  });

  // ================
  // FILTERING
  // ================
  function filter(list, term) {
    const lower = term.toLowerCase().trim();
    [...list.children].forEach(li => {
      li.style.display = lower && !li.textContent.toLowerCase().includes(lower)
        ? "none" : "";
    });
    updateCounts();
  }

  searchChosen.addEventListener("input", () => filter(chosen, searchChosen.value));
  searchAvailable.addEventListener("input", () => filter(available, searchAvailable.value));

  // ESC clears search
  function handleEscape(e, input, list) {
    if (e.key === "Escape") {
      input.value = "";
      filter(list, "");
    }
  }
  searchChosen.addEventListener("keydown", e => handleEscape(e, searchChosen, chosen));
  searchAvailable.addEventListener("keydown", e => handleEscape(e, searchAvailable, available));

  // ================
  // KEYBOARD SHORTCUTS
  // ================
  document.addEventListener("keydown", e => {

    const selChosen = chosen.querySelector(".selected");
    const selAvail = available.querySelector(".selected");

    if (e.key === "Escape") {
      searchChosen.value = "";
      searchAvailable.value = "";
      filter(chosen, "");
      filter(available, "");
    }

    if (e.key === "Enter") {
      if (selAvail) moveSelected(available, chosen);
      if (selChosen) moveSelected(chosen, available);
    }

    if (e.key === "ArrowLeft" && selAvail) {
      moveSelected(available, chosen);
    }

    if (e.key === "ArrowRight" && selChosen) {
      moveSelected(chosen, available);
    }

    if (selChosen && e.key === "ArrowUp") {
      const prev = selChosen.previousElementSibling;
      if (prev) chosen.insertBefore(selChosen, prev);
      updateOrder();
      e.preventDefault();
    }

    if (selChosen && e.key === "ArrowDown") {
      const next = selChosen.nextElementSibling;
      if (next) chosen.insertBefore(next, selChosen);
      updateOrder();
      e.preventDefault();
    }
  });

  // ================
  // UPDATE HELPERS
  // ================
  function updateOrder() {
    const values = [...chosen.children].map(li => li.dataset.value);
    orderInput.value = values.join(",");
  }

  function updateCounts() {
    document.getElementById("chosen-count-" + id).textContent =
      [...chosen.children].filter(li => li.style.display !== "none").length;

    document.getElementById("available-count-" + id).textContent =
      [...available.children].filter(li => li.style.display !== "none").length;
  }

  function syncHiddenInputs() {
    const form = chosen.closest("form");
    if (!form) return;

    form.querySelectorAll('input.__dual_selector_created').forEach(el => el.remove());

    [...chosen.children].forEach(li => {
      const hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = fieldName;
      hidden.value = li.dataset.value;
      hidden.className = "__dual_selector_created";
      form.appendChild(hidden);
    });
  }

  function updateAll() {
    updateOrder();
    updateCounts();
    syncHiddenInputs();
  }

  updateAll();

  // Responsive icon switch (same logic, but reversed icons)
  const updateButtonIcons = () => {
    const isMobile = window.innerWidth <= 944;
    btnRight.innerHTML = isMobile ? '<i class="bx bx-chevron-down fs-4"></i>' : '<i class="bx bx-chevron-right fs-4"></i>';
    btnLeft.innerHTML = isMobile ? '<i class="bx bx-chevron-up fs-4"></i>' : '<i class="bx bx-chevron-left fs-4"></i>';
    btnAllRight.innerHTML = isMobile ? '<i class="bx bx-chevrons-down fs-4"></i>' : '<i class="bx bx-chevrons-right fs-4"></i>';
    btnAllLeft.innerHTML = isMobile ? '<i class="bx bx-chevrons-up fs-4"></i>' : '<i class="bx bx-chevrons-left fs-4"></i>';
  };
  window.addEventListener("resize", updateButtonIcons);
  updateButtonIcons();
})();