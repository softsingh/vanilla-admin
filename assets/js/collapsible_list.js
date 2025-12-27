function initContactlist(prefix) {
    const outer = document.getElementById(prefix + '-clist-outer');
    if (!outer) return;

    const container = outer.querySelector(`#${prefix}-clist-container`);
    if (!container) return;

    const btnUp = outer.querySelector(`#btn_${prefix}_move_up`);
    const btnDown = outer.querySelector(`#btn_${prefix}_move_down`);
    const orderInput = outer.querySelector(`#${prefix}_order`);

    function getSortableItems() {
        return Array.from(container.querySelectorAll('.' + prefix + '-clist-item')).filter(item => {
            if (item.classList.contains('d-none')) return false;
            const mainInput = item.querySelector(
                'input[name$="-main_field"], input[name$="-email"], input[name$="-phone_number"], textarea[name$="-address"]'
            );

            const deleteInput = item.querySelector('input[name$="-DELETE"]');
            const hasValue = mainInput && mainInput.value.trim() !== '';
            const markedDelete = deleteInput && deleteInput.checked;
            return hasValue && !markedDelete;
        });
    }

    function getOpenItem() {
        return container.querySelector('.' + prefix + '-clist-item.open');
    }

    function getCurrentIndex() {
        const items = getSortableItems();
        const openItem = getOpenItem();
        if (!openItem) return -1;
        return items.indexOf(openItem);
    }

    function setOpenItemByIndex(index) {
        const items = getSortableItems();
        items.forEach((it, i) => {
            if (i === index) it.classList.add('open'); else it.classList.remove('open');
        });
    }

    function swapItems(i, j) {
        const items = getSortableItems();
        if (i < 0 || j < 0 || i >= items.length || j >= items.length) return;
        const parent = items[i].parentNode;
        if (i < j) parent.insertBefore(items[j], items[i]);
        else parent.insertBefore(items[i], items[j]);
        setOpenItemByIndex(j);
        updateSortIndices();
    }

    function updateSortIndices() {
        const allItems = Array.from(container.querySelectorAll('.' + prefix + '-clist-item'));
        const sortable = getSortableItems();
        const orderIds = [];

        sortable.forEach((item, idx) => {
            const sortInput = item.querySelector('input[name$="-sort_index"]');
            if (sortInput) sortInput.value = idx;
            const idInput = item.querySelector('input[name$="-id"]');
            if (idInput && idInput.value) orderIds.push(idInput.value);
        });

        if (orderInput) orderInput.value = orderIds.join(',');
    }

    let plural = ""

    switch (prefix) {
        case "address":
            plural = "addresses"
            break;

        case "email":
            plural = "emails"
            break;

        case "phone":
            plural = "phones"
            break;
    }

    const statusSelects = container.querySelectorAll(
        `select[id^="id_${plural}-"][id$="-status"]`
    );

    statusSelects.forEach(select => {
        // set initial state
        updateStatusClass(select);

        // update when user changes selection
        select.addEventListener('change', () => {
            updateStatusClass(select);
        });
    });

    function updateStatusClass(select) {
        const clistItem = select.closest(`.${prefix}-clist-item`);
        if (!clistItem) return;

        clistItem.classList.remove('success-highlight', 'warning-highlight', 'danger-highlight');
        if (select.value == "verified") clistItem.classList.add('success-highlight');
        if (select.value == "obsolete") clistItem.classList.add('warning-highlight');
    }

    if (btnUp) {
        btnUp.addEventListener('click', function (e) {
            const index = getCurrentIndex();
            if (index > 0) swapItems(index, index - 1);
            e.currentTarget.blur();
        });
    }

    if (btnDown) {
        btnDown.addEventListener('click', function (e) {
            const index = getCurrentIndex();
            const items = getSortableItems();
            if (index >= 0 && index < items.length - 1) swapItems(index, index + 1);
            e.currentTarget.blur();
        });
    }

    document.addEventListener('DOMContentLoaded', updateSortIndices);

    const form = container.closest('form');
    if (form) {
        form.addEventListener('submit', function () {
            updateSortIndices();
        });
    }
}


function markContactFormDeleted(button, prefix) {
    // Find the contact form container (accordion item)
    const item = button.closest('.' + prefix + '-clist-item');
    if (!item) return;

    // Confirm and mark for deletion
    modalConfirm(
        `Are you sure you want to delete this ${prefix}?`,
        { iconType: bxIconEnum.DANGER, headingText: "Delete", button1Text: "Yes", button2Text: "No" }
    ).then(function (ret) {
        if (ret === 1) {
            item.classList.add('d-none');
        }
    });
}

