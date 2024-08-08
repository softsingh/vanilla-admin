const menuItems = document.querySelectorAll('.menu-item');
const menuLinks = document.querySelectorAll('.menu-link');

function clearMenuItemOpenActive(currentMenuItem) {
   menuItems.forEach(menuItem => {
      if(menuItem !== currentMenuItem) {
         menuItem.classList.remove('active');
         menuItem.classList.remove('open')
      }
   })
}

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