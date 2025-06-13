
document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector(".navbar .command-palette-input");
    const resultBox = document.querySelector('.command-palette-result');
    const resultCount = document.querySelector('.command-palette-result-count');
    const resultList = document.querySelector('.command-palette-result-list');
    const backdrop = document.querySelector('.command-palette-backdrop');
    const inputWrapper = document.querySelector('.navbar .command-palette-input-wrapper');
    const commandButton = document.querySelector('.command-palette-button');
    const commandCloser = document.querySelector('.command-palette-closer');

    let allLinks = [];

    async function fetchLinks() {
        try {
            const response = await fetch("assets/data/site-map.json");
            if (!response.ok) throw new Error("Failed to fetch links");
            allLinks = await response.json();
        } catch (err) {
            console.error("Global search error:", err);
        }
    }

    function filterLinks(query) {
        const lowerQuery = query.toLowerCase();
        return allLinks.filter(link =>
            link.label.toLowerCase().includes(lowerQuery)
        );
    }

    function renderResults(filtered) {
        resultList.innerHTML = "";

        if (filtered.length === 0) {
            resultCount.textContent = "0 results found";
            resultList.style.display = "none";
            return;
        }

        filtered.forEach(link => {
            const item = document.createElement("a");
            item.setAttribute("href", link.url ? link.url : "#");
            item.setAttribute("target", "_blank");
            item.className = "command-palette-result-item";

            const div = document.createElement("div");
            div.className = "d-flex align-items-center gap-3";

            const icon = document.createElement("i");
            icon.className = link.icon ? link.icon : "bx bx-search fs-5";

            const span = document.createElement("span");
            span.textContent = link.label;

            div.appendChild(icon);
            div.appendChild(span);
            item.appendChild(div);
            resultList.appendChild(item);
        });

        resultCount.textContent = `${filtered.length} result${filtered.length > 1 ? 's' : ''} found`;
        resultBox.style.display = "block";
        resultList.style.display = "block";
    }

    function cleanup() {
        input.value = "";
        resultBox.style.display = "none";
        resultList.innerHTML = "";
        resultCount.textContent = "";
    }

    function showCommandPalette() {
        hideAllDropdowns();
        backdrop?.classList.add('show');
        inputWrapper?.classList.add('show');
        input?.focus();
        input.value = '';
    }

    function hideCommandPalette() {
        hideAllDropdowns();
        backdrop?.classList.remove('show');
        inputWrapper?.classList.remove('show');
        input.value = '';
    }

    function hideAllDropdowns() {
        cleanup();
    }

    // Input handlers
    input?.addEventListener("input", () => {
        const query = input.value.trim();
        if (!query) {
            cleanup();
            return;
        }

        const filtered = filterLinks(query);
        renderResults(filtered);
    });

    input?.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            hideCommandPalette();
        } else if (e.key === "Enter") {
            const activeItem = document.querySelector('.command-palette-result-item.active');
            if (activeItem) {
                e.preventDefault();
                window.open(activeItem.href, '_blank');
                hideCommandPalette();
            }
        } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const items = document.querySelectorAll('.command-palette-result-item');
            let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));

            if (e.key === "ArrowDown") {
                activeIndex = (activeIndex + 1) % items.length;
            } else {
                activeIndex = (activeIndex - 1 + items.length) % items.length;
            }

            items.forEach(item => item.classList.remove('active'));
            if (items[activeIndex]) {
                items[activeIndex].classList.add('active');
                items[activeIndex].scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    });

    input?.addEventListener("focus", () => {
        if (allLinks.length === 0) fetchLinks();
    });

    document.addEventListener("click", (e) => {
        if (!inputWrapper.contains(e.target)) {
            hideCommandPalette();
        }
    });

    commandButton?.addEventListener('click', (e) => {
        showCommandPalette();
        e.stopPropagation();
    });

    commandCloser?.addEventListener('click', () => hideCommandPalette());

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hideCommandPalette();
        } else if (e.ctrlKey && e.key === "\\") {
            showCommandPalette();
        }
    });

    // Load links once on page load
    fetchLinks();
});
