
(function () {
  // Initialize all widgets on the page
  const roots = document.querySelectorAll('.dual-selector[data-widget-id]');
  if (!roots.length) return;

  roots.forEach(widgetRoot => {
    const id = widgetRoot.dataset.widgetId;
    const fieldName = widgetRoot.dataset.fieldName;
    const isSortable = widgetRoot.dataset.sortable === 'true';

    const chosen = document.getElementById('chosen-' + id);
    const available = document.getElementById('available-' + id);
    const searchChosen = document.getElementById('search-chosen-' + id);
    const searchAvailable = document.getElementById('search-available-' + id);
    const orderInput = document.getElementById(id + '_order');

    const btnLeft = document.getElementById('btn-left-' + id);
    const btnRight = document.getElementById('btn-right-' + id);
    const btnAllLeft = document.getElementById('btn-all-left-' + id);
    const btnAllRight = document.getElementById('btn-all-right-' + id);
    const btnUp = document.getElementById('btn-up-' + id);
    const btnDown = document.getElementById('btn-down-' + id);

    if (!chosen || !available || !orderInput) return;

    // Optional Sortable integration (sortable mode only)
    if (isSortable && typeof Sortable !== 'undefined') {
      Sortable.create(chosen, {
        animation: 150,
        handle: '.sortable-handle',
        ghostClass: 'sortable-ghost',
        onEnd: updateAll,
      });
    }

    // ================
    // CLICK SELECTION
    // ================
    widgetRoot.querySelectorAll('.dual-list').forEach(list => {
      list.addEventListener('click', e => {
        const li = e.target.closest('li');
        if (!li) return;
        const already = li.classList.contains('selected');
        [...list.children].forEach(el => el.classList.remove('selected'));
        if (!already) li.classList.add('selected');
      });
    });

    // ================
    // SORTABLE HELPERS
    // ================
    function ensureHandle(li) {
      if (!isSortable) return;
      if (!li.querySelector('.sortable-handle')) {
        const handle = document.createElement('i');
        handle.className = 'bx bx-move sortable-handle text-muted';
        li.appendChild(handle);
      }
    }

    function removeHandle(li) {
      const h = li.querySelector('.sortable-handle');
      if (h) h.remove();
    }

    // Initialize handles for items already in chosen
    [...chosen.children].forEach(li => ensureHandle(li));

    // ================
    // MOVE FUNCTIONS
    // ================
    function moveItems(from, to, all) {
      const items = all
        ? [...from.children]
        : [...from.querySelectorAll('.selected')];

      if (!items.length) return;

      items.forEach(item => {
        item.classList.remove('selected');
        item.style.display = '';

        if (isSortable && to === chosen) {
          ensureHandle(item);
        } else {
          removeHandle(item);
        }

        to.appendChild(item);
      });

      updateAll();
    }

    btnLeft?.addEventListener('click', () => moveItems(available, chosen, false));
    btnRight?.addEventListener('click', () => moveItems(chosen, available, false));
    btnAllLeft?.addEventListener('click', () => moveItems(available, chosen, true));
    btnAllRight?.addEventListener('click', () => moveItems(chosen, available, true));

    // ================
    // SORT UP / DOWN
    // ================
    btnUp?.addEventListener('click', () => {
      const item = chosen.querySelector('.selected');
      if (!item) return;
      const prev = item.previousElementSibling;
      if (prev) chosen.insertBefore(item, prev);
      updateAll();
    });

    btnDown?.addEventListener('click', () => {
      const item = chosen.querySelector('.selected');
      if (!item) return;
      const next = item.nextElementSibling;
      if (next) chosen.insertBefore(next, item);
      updateAll();
    });

    // ================
    // FILTERING
    // ================
    function filter(list, term) {
      const lower = (term || '').toLowerCase().trim();
      [...list.children].forEach(li => {
        const txt = (li.textContent || '').toLowerCase();
        li.style.display = lower && !txt.includes(lower) ? 'none' : '';
      });
      updateCounts();
    }

    searchChosen?.addEventListener('input', () =>
      filter(chosen, searchChosen.value)
    );
    searchAvailable?.addEventListener('input', () =>
      filter(available, searchAvailable.value)
    );

    function handleEscape(e, input, list) {
      if (e.key === 'Escape') {
        input.value = '';
        filter(list, '');
      }
    }

    searchChosen?.addEventListener('keydown', e =>
      handleEscape(e, searchChosen, chosen)
    );
    searchAvailable?.addEventListener('keydown', e =>
      handleEscape(e, searchAvailable, available)
    );

    // ================
    // KEYBOARD SHORTCUTS
    // ================
    document.addEventListener('keydown', e => {
      const selChosen = chosen.querySelector('.selected');
      const selAvail = available.querySelector('.selected');

      if (e.key === 'Escape') {
        if (searchChosen) searchChosen.value = '';
        if (searchAvailable) searchAvailable.value = '';
        filter(chosen, '');
        filter(available, '');
      }

      if (e.key === 'Enter') {
        if (selAvail) moveItems(available, chosen, false);
        if (selChosen) moveItems(chosen, available, false);
      }

      if (e.key === 'ArrowLeft' && selAvail) {
        moveItems(available, chosen, false);
      }

      if (e.key === 'ArrowRight' && selChosen) {
        moveItems(chosen, available, false);
      }

      if (selChosen && e.key === 'ArrowUp') {
        const prev = selChosen.previousElementSibling;
        if (prev) chosen.insertBefore(selChosen, prev);
        updateAll();
        e.preventDefault();
      }

      if (selChosen && e.key === 'ArrowDown') {
        const next = selChosen.nextElementSibling;
        if (next) chosen.insertBefore(next, selChosen);
        updateAll();
        e.preventDefault();
      }
    });

    // ================
    // UPDATE HELPERS
    // ================
    function updateOrder() {
      const values = [...chosen.children].map(li => li.dataset.value);
      orderInput.value = values.join(',');
    }

    function updateCounts() {
      const visibleCount = list =>
        [...list.children].filter(li => li.style.display !== 'none')
          .length;

      const chosenCount = document.getElementById('chosen-count-' + id);
      const availableCount = document.getElementById('available-count-' + id);

      if (chosenCount) {
        chosenCount.textContent = visibleCount(chosen);
      }
      if (availableCount) {
        availableCount.textContent = visibleCount(available);
      }
    }

    function syncHiddenInputs() {
      const form = chosen.closest('form');
      if (!form) return;

      form
        .querySelectorAll(
          'input.__dual_selector_created[name="' + fieldName + '"]'
        )
        .forEach(el => el.remove());

      [...chosen.children].forEach(li => {
        const val = li.dataset.value;
        if (!val) return;
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = fieldName;
        hidden.value = val;
        hidden.className = '__dual_selector_created';
        form.appendChild(hidden);
      });
    }

    function updateAll() {
      // ensure handles are present if sortable
      if (isSortable) {
        [...chosen.children].forEach(li => ensureHandle(li));
      }
      updateOrder();
      updateCounts();
      syncHiddenInputs();
    }

    // Initial sync
    updateAll();

    // On form submit, ensure order/value are updated
    const form = chosen.closest('form');
    if (form) {
      form.addEventListener('submit', updateAll);
    }

    // Responsive icon switch – you can fill icons as needed
    const updateButtonIcons = () => {
      const isMobile = window.innerWidth <= 944;
      btnRight.innerHTML = isMobile ? '<i class="bx bx-chevron-down fs-4"></i>' : '<i class="bx bx-chevron-right fs-4"></i>';
      btnLeft.innerHTML = isMobile ? '<i class="bx bx-chevron-up fs-4"></i>' : '<i class="bx bx-chevron-left fs-4"></i>';
      btnAllRight.innerHTML = isMobile ? '<i class="bx bx-chevrons-down fs-4"></i>' : '<i class="bx bx-chevrons-right fs-4"></i>';
      btnAllLeft.innerHTML = isMobile ? '<i class="bx bx-chevrons-up fs-4"></i>' : '<i class="bx bx-chevrons-left fs-4"></i>';
    };
    window.addEventListener('resize', updateButtonIcons);
    updateButtonIcons();
  });
})();
