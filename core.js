
// Hide Sidebar by default on small screens
if (window.innerWidth <= 768) {
   document.body.classList.add('sidebar-hidden');
}

// Accordions
const accordionHeaders = document.querySelectorAll('.accordion .accordion-header');

accordionHeaders.forEach(accordionHeader => accordionHeader.addEventListener('click', (event) => {
   const curentAccordionItem = accordionHeader.closest('.accordion-item');
   const parentName = curentAccordionItem.getAttribute('parent');

   if (parentName !== '') {
      const parent = document.getElementById(parentName);
      if (parent) {
         const accordionItems = parent.querySelectorAll('.accordion-item');
         accordionItems.forEach((accordionItem) => {
            if (accordionItem !== curentAccordionItem) {
               // Only close accordion-items having parent value equal to accordion id
               if (accordionItem.getAttribute('parent') === parentName) {
                  accordionItem.classList.remove('open')
               }
            }
         });
      }
   }

   curentAccordionItem.classList.toggle('open')
   event.stopPropagation();
}));

// Alert Dismissible btn-close
const alertDismissButtons = document.querySelectorAll('.alert-dismissible .btn-close');

alertDismissButtons.forEach(alertDismissButton => alertDismissButton.addEventListener('click', (event) => {
   const alertDismiss = alertDismissButton.closest('.alert-dismissible');
   alertDismiss.classList.add('d-none');
   event.stopPropagation();
}))


// Sidebar Menu
const menuItems = document.querySelectorAll('.menu>.menu-item');

menuItems.forEach(menuItem => menuItem.addEventListener('click', (event) => {
   clearMenuItemOpenActive(menuItem);
   menuItem.classList.add('active');
   menuItem.classList.toggle('open');
   event.stopPropagation();
}))

// Sidebar Sub-Menu
const menuSubItems = document.querySelectorAll('.menu-sub>.menu-item');

menuSubItems.forEach(menuSubItem => menuSubItem.addEventListener('click', (event) => {
   clearMenuSubItemActive(menuSubItem);

   const menuSubSub = menuSubItem.querySelectorAll('.menu-sub');

   if (menuSubSub.length > 0) {
      menuSubItem.classList.toggle('open');
   }
   else {
      menuSubItem.classList.add('active');
   }

   event.stopPropagation();
}))

const body = document.querySelector('body');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const navbarToggle = document.querySelector('.navbar-toggle');

sidebarToggle.addEventListener('click', () => {
   body.classList.toggle('sidebar-hidden')
})

// Toggle Sidebar visibility when Screen Overlay is clicked
const screenOverlay = document.querySelector('.screen-overlay');

screenOverlay.addEventListener('click', () => {
   document.body.classList.toggle('sidebar-hidden');
});

navbarToggle.addEventListener('click', () => {
   body.classList.toggle('sidebar-hidden')
})

searchInputWrapper = document.querySelector('.navbar .search-input-wrapper');
searchInput = document.querySelector('.navbar .search-input-wrapper .search-input');

searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', (event) => {
   showNavbarSearchInput();
   event.stopPropagation();
})

searchCloser = document.querySelector('.search-closer');
searchCloser.addEventListener('click', () => {
   searchInputWrapper.classList.remove('show');
})

document.addEventListener('keydown', (event) => {
   if (event.key === 'Escape' || event.ctrlKey && event.key === '/') {
      searchInputWrapper.classList.remove('show');
   }

   if (event.ctrlKey && event.key === '/') {
      showNavbarSearchInput()
   }
});

// Dropdown Menu
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach((dropdownToggle) => {
   dropdownToggle.addEventListener('click', (event) => {
      const parent = event.currentTarget.parentElement;
      const dropdownMenu = parent.querySelector('.dropdown-menu');
      hideAllDropdowns();
      dropdownMenu.classList.toggle('show');
      event.stopPropagation();
   })
})

// Dropdown Notifications Menu
const notificationReads = document.querySelectorAll('.dropdown-notifications-read');

notificationReads.forEach((notificationRead) => {
   notificationRead.addEventListener('click', (event) => {
      const notificationsItem = event.currentTarget.closest(".dropdown-notifications-item");
      notificationsItem.classList.toggle('mark-as-read');
      event.stopPropagation();
   })
})

const notificationArchives = document.querySelectorAll('.dropdown-notifications-archive');

notificationArchives.forEach((notificationArchive) => {
   notificationArchive.addEventListener('click', (event) => {
      const notificationsItem = event.currentTarget.closest(".dropdown-notifications-item");
      notificationsItem.style.display = 'none';
      event.stopPropagation();
   })
})

// Modal
const modalToggles = document.querySelectorAll('[data-toggle="modal"]');
modalToggles.forEach(modalToggle => modalToggle.addEventListener('click', (event) => {
   const modalName = modalToggle.getAttribute('data-target');
   if(modalName) { 
      const modal = document.getElementById(modalName);
      if (modal) {
         showModal(modal)
      }
   }
   event.stopPropagation();
}));

// Hide modal when Modal Backdrop is clicked
const modalBackdrop = document.getElementById('modalBackdrop');

modalBackdrop.addEventListener('click', (event) => {
   const modalName = modalBackdrop.getAttribute('data-target');
   alert(modalName)
   if(modalName) { 
      const modal = document.getElementById(modalName);
      if (modal) {
         
         hideModal(modal)
      }
   }
});

function showModal(modal) {
   // Create the Backdrop div
   const backdrop = document.createElement('div');
   backdrop.id = 'modalBackdrop';
   backdrop.className = 'modal-backdrop';
   backdrop.setAttribute('data-target', modal.id);
   document.body.appendChild(backdrop);

   // Show the modal
   modal.classList.add('show');
}

function hideModal(modal) {
   // Remove the Backdrop div
   const backdrop = document.getElementById('modalBackdrop');
   if (backdrop) {
      backdrop.remove();
   }
   // Hide the modal
   modal.classList.remove('show');
}

// Nav
const navItems = document.querySelectorAll('.nav>.nav-item');

navItems.forEach(navItem => navItem.addEventListener('click', (event) => {
   clearNavItemActive(navItem);
   navItem.classList.add('active');
   event.stopPropagation();
}))

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle .nav-link i');

themeToggle.addEventListener('click', () => {
   body.classList.toggle('dark-mode')

   if (body.classList.contains('dark-mode')) {
      themeToggle.classList.remove('bx-moon');
      themeToggle.classList.add('bx-sun');
   }
   else {
      themeToggle.classList.remove('bx-sun');
      themeToggle.classList.add('bx-moon');
   }
})

//Click on empty area
document.documentElement.addEventListener('click', (event) => {

   // Hide all shown Dropdown Menus
   hideAllDropdowns();

   // Close Navbar search-input
   if (searchInputWrapper.classList.contains('show')) {
      if (event.target !== searchInput) {
         searchInputWrapper.classList.remove('show');
      }
   }
})

// Show Navbar Search Box
function showNavbarSearchInput() {
   hideAllDropdowns();

   searchInputWrapper.classList.add('show');
   searchInput.focus();
   searchInput.value = '';
}

// Hide all shown Dropdown Menus
function hideAllDropdowns() {
   const dropdownMenus = document.querySelectorAll('.dropdown-menu');

   dropdownMenus.forEach(dropdownMenu => {
      if (dropdownMenu.classList.contains('show')) {
         if (event.currentTarget !== dropdownMenu) {
            dropdownMenu.classList.remove('show');
         }
      }
   })
}

function clearMenuItemOpenActive(currentMenuItem) {
   menuItems.forEach(menuItem => {
      if (menuItem !== currentMenuItem) {
         menuItem.classList.remove('active');
         menuItem.classList.remove('open')
      }
   })
}

function clearMenuSubItemActive(currentMenuSubItem) {
   menuSubItems.forEach(menuSubItem => {
      if (menuSubItem !== currentMenuSubItem) {
         menuSubItem.classList.remove('active');
      }
   })
}

function clearNavItemActive(currentNavItem) {
   navItems.forEach(navItem => {
      if (navItem !== currentNavItem) {
         navItem.classList.remove('active');
      }
   })
}