
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

navbarToggle.addEventListener('click', ()=>{
   body.classList.toggle('sidebar-hidden')
})

// Toggle Sidebar visibility when Screen Overlay is clicked
const screenOverlay = document.querySelector('.screen-overlay');

screenOverlay.addEventListener('click', ()=>{
   document.body.classList.toggle('sidebar-hidden');
});