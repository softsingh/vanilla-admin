
// Hide Sidebar by default on small screens
if (window.innerWidth <= 768) {
   document.body.classList.add('sidebar-hidden');
}

function clearMenuItemOpenActive(currentMenuItem) {
   menuItems.forEach(menuItem => {
      if(menuItem !== currentMenuItem) {
         menuItem.classList.remove('active');
         menuItem.classList.remove('open')
      }
   })
}

const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(menuItem => menuItem.addEventListener('click', ()=>{
   clearMenuItemOpenActive(menuItem);
   menuItem.classList.add('active');
   menuItem.classList.toggle('open')
}))

const body = document.querySelector('body');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const navbarToggle = document.querySelector('.navbar-toggle');

sidebarToggle.addEventListener('click', ()=>{
   body.classList.toggle('sidebar-hidden')
})

// Toggle Sidebar visibility when Screen Overlay is clicked
const screenOverlay = document.querySelector('.screen-overlay');

screenOverlay.addEventListener('click', ()=>{
   document.body.classList.toggle('sidebar-hidden');
});

navbarToggle.addEventListener('click', ()=>{
   body.classList.toggle('sidebar-hidden')
})

searchInputWrapper = document.querySelector('.navbar .search-input-wrapper');
searchInput = document.querySelector('.navbar .search-input-wrapper .search-input');

searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', (event)=> {
   searchInputWrapper.classList.add('show');
   searchInput.focus();
   searchInput.value='';
   event.stopPropagation();
})

searchCloser = document.querySelector('.search-closer');
searchCloser.addEventListener('click', ()=> {
   searchInputWrapper.classList.remove('show');
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' || event.ctrlKey && event.key === '/') {
    searchInputWrapper.classList.remove('show');
  }

  if (event.ctrlKey && event.key === '/') {
    searchInputWrapper.classList.add('show');
    searchInput.focus();
    searchInput.value='';
  }
});

// Dropdown Menu
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach((dropdownToggle) => {
   dropdownToggle.addEventListener('click',(event) => {
      const parent = event.currentTarget.parentElement;
      const dropdownMenu = parent.querySelector('.dropdown-menu');
      dropdownMenu.classList.toggle('show');
      event.stopPropagation();
   })
})

//Click on empty area
document.addEventListener('click', (event) => {

   // Close any of the open dropdown-menu
   const dropdownMenus = document.querySelectorAll('.dropdown-menu');

   dropdownMenus.forEach((dropdownMenu) => {
      if(dropdownMenu.classList.contains('show')) {
         if(event.currentTarget !== dropdownMenu) {
            //alert(event.currentTarget.classList)
            dropdownMenu.classList.remove('show');
         }
      }
   })

   // Close Navbar search-input
   if(searchInputWrapper.classList.contains('show')) {
      //alert(event.target.ClassList)
      if(event.target !== searchInput) {
         searchInputWrapper.classList.remove('show');
      }
   }
})