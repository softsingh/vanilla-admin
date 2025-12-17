(function () {
  // Get widget root
  const widgetRoot = document.querySelector(".dual-selector[data-widget-id]");
  if (!widgetRoot) return;

  const id = widgetRoot.dataset.widgetId;
  const fieldName = widgetRoot.dataset.fieldName;

  const chosenList = document.getElementById("chosen-" + id);
  const availableList = document.getElementById("available-" + id);
  const orderInput = document.getElementById(id + "_order");
  const valuesContainer = document.getElementById(id + "_values_container");
  const searchChosen = document.getElementById("search-chosen-" + id);
  const searchAvailable = document.getElementById("search-available-" + id);

  if (!chosenList || !availableList) return;
  if (typeof Sortable === "undefined") return;

  // Sortable for chosen list
  Sortable.create(chosenList, {
    animation: 150,
    handle: ".sortable-handle",
    ghostClass: "sortable-ghost",
    onEnd: updateOrderAndValues,
  });

  // Buttons
  const btnLeft = document.getElementById("btn-left-" + id);       // available → chosen
  const btnRight = document.getElementById("btn-right-" + id);     // chosen → available
  const btnAllLeft = document.getElementById("btn-all-left-" + id);   // all available → chosen
  const btnAllRight = document.getElementById("btn-all-right-" + id); // all chosen → available

  btnLeft?.addEventListener("click", () => moveItems(availableList, chosenList, false));
  btnRight?.addEventListener("click", () => moveItems(chosenList, availableList, false));
  btnAllLeft?.addEventListener("click", () => moveItems(availableList, chosenList, true));
  btnAllRight?.addEventListener("click", () => moveItems(chosenList, availableList, true));

  // Single selection with toggle off
  document.querySelectorAll(".dual-list").forEach(list => {
    list.addEventListener("click", e => {
      const li = e.target.closest("li");
      if (!li) return;
      const already = li.classList.contains("selected");
      [...list.children].forEach(el => el.classList.remove("selected"));
      if (!already) li.classList.add("selected");
    });
  });

  function ensureHandle(li) {
    if (!li.querySelector(".sortable-handle")) {
      const handle = document.createElement("i");
      handle.className = "bx bx-move sortable-handle text-muted";
      li.appendChild(handle);
    }
  }
  function removeHandle(li) {
    const h = li.querySelector(".sortable-handle");
    if (h) h.remove();
  }

  function moveItems(from, to, all) {
    const items = all ? [...from.children] : [...from.querySelectorAll(".selected")];
    if (!items.length) return;
    items.forEach(item => {
      item.classList.remove("selected");
      item.style.display = "";
      if (to === chosenList) ensureHandle(item); else removeHandle(item);
      to.appendChild(item);
    });
    updateOrderAndValues();
    updateCounts();
  }

  function filterList(list, term) {
    const lower = (term || "").toLowerCase().trim();
    [...list.children].forEach(li => {
      const txt = (li.textContent || "").toLowerCase();
      li.style.display = lower && !txt.includes(lower) ? "none" : "";
    });
    updateCounts();
  }

  searchAvailable?.addEventListener("input", () => filterList(availableList, searchAvailable.value));
  searchChosen?.addEventListener("input", () => filterList(chosenList, searchChosen.value));

  function handleEscapeKey(e, input, list) {
    if (e.key === "Escape") {
      input.value = "";
      filterList(list, "");
    }
  }
  searchAvailable?.addEventListener("keydown", e => handleEscapeKey(e, searchAvailable, availableList));
  searchChosen?.addEventListener("keydown", e => handleEscapeKey(e, searchChosen, chosenList));

  function syncValuesToForm() {
    const form = chosenList.closest("form");
    if (!form) return;
    form.querySelectorAll(`input.__dual_selector_created[name="${fieldName}"]`).forEach(el => el.remove());
    [...chosenList.children].forEach(li => {
      const val = li.dataset.value;
      if (!val) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = fieldName;
      input.value = val;
      input.className = "__dual_selector_created";
      form.appendChild(input);
    });
  }

  function updateOrderAndValues() {
    const order = [...chosenList.children].map(li => li.dataset.value || "").filter(Boolean);
    orderInput.value = order.join(",");
    [...chosenList.children].forEach(li => ensureHandle(li));
    syncValuesToForm();
  }

  function updateCounts() {
    const visible = list => [...list.children].filter(li => getComputedStyle(li).display !== "none").length;
    document.getElementById("available-count-" + id).textContent = visible(availableList);
    document.getElementById("chosen-count-" + id).textContent = visible(chosenList);
  }

  const form = chosenList.closest("form");
  if (form) form.addEventListener("submit", () => updateOrderAndValues());

  [...chosenList.children].forEach(li => ensureHandle(li));
  updateOrderAndValues();
  updateCounts();

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