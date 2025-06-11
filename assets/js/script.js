
// Hide Sidebar by default on small screens
if (window.innerWidth <= 768) {
  document.body.classList.add('sidebar-hidden');
}

//////////////////// Dropdown ////////////////////

// Dropdown Notifications Menu
const notificationReads = document.querySelectorAll(
  '.dropdown-notifications-read'
);

notificationReads.forEach((notificationRead) => {
  notificationRead.addEventListener('click', (event) => {
    const notificationsItem = event.currentTarget.closest(
      '.dropdown-notifications-item'
    );
    notificationsItem.classList.toggle('mark-as-read');
    event.stopPropagation();
  });
});

const notificationArchives = document.querySelectorAll(
  '.dropdown-notifications-archive'
);

notificationArchives.forEach((notificationArchive) => {
  notificationArchive.addEventListener('click', (event) => {
    const notificationsItem = event.currentTarget.closest(
      '.dropdown-notifications-item'
    );
    notificationsItem.style.display = 'none';
    event.stopPropagation();
  });
});

//////////////////// Navbar ////////////////////

// Navbar Command Palette Input
commandPaletteInputWrapper = document.querySelector('.navbar .command-palette-input-wrapper');
commandPaletteInput = document.querySelector(
  '.navbar .command-palette-input-wrapper .command-palette-input'
);

commandPaletteButton = document.querySelector('.command-palette-button');
commandPaletteButton?.addEventListener('click', (event) => {
  showNavbarCommandPaletteInput(event);
  event.stopPropagation();
});

commandPaletteCloser = document.querySelector('.command-palette-closer');
commandPaletteCloser?.addEventListener('click', () => {
  commandPaletteInputWrapper.classList.remove('show');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' || (event.ctrlKey && event.key === '\\')) {
    commandPaletteInputWrapper.classList.remove('show');
  }

  if (event.ctrlKey && event.key === '\\') {
    showNavbarCommandPaletteInput();
  }
});

// Show Navbar Command Palette Box
function showNavbarCommandPaletteInput(event) {
  hideAllDropdowns(event);
  commandPaletteInputWrapper.classList.add('show');
  commandPaletteInput.focus();
  commandPaletteInput.value = '';
}

// Click on empty area to close Navbar command-palette-input
if (commandPaletteInputWrapper) {
  document.documentElement.addEventListener('click', (event) => {
    if (commandPaletteInputWrapper.classList.contains('show')) {
      if (event.target !== commandPaletteInput) {
        commandPaletteInputWrapper.classList.remove('show');
      }
    }
  });
}

//////////////////// Modal Confirm Demo ////////////////////

const tglDemoModalConfirm = document.querySelector(
  '[type="tgl-demo-modal-confirm"]'
);

tglDemoModalConfirm?.addEventListener('click', () => {
  modalConfirm('Are you sure to delete the file?', {
    iconType: bxIconEnum.DANGER,
    headingText: 'Delete',
    button1Text: 'Yes',
    button2Text: 'No',
    button3Text: 'Cancel',
  }).then((ret) => {
    const lblDemoModalConfirm = document.getElementById('lblDemoModalConfirm');
    if (lblDemoModalConfirm) {
      lblDemoModalConfirm.innerText = 'Returned = ' + ret;
    }
  });
})

//////////////////// Theme Toggle ////////////////////

const themeToggle = document.querySelector('.theme-toggle .nav-link i');

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    themeToggle.classList.remove('bx-moon');
    themeToggle.classList.add('bx-sun');
  } else {
    themeToggle.classList.remove('bx-sun');
    themeToggle.classList.add('bx-moon');
  }
});

//////////////////// User List (Dashboard) ////////////////////

// Delete User List Item
const userListDelToggles = document.querySelectorAll(
  '[type="tgl-user-list-del"]'
);

userListDelToggles.forEach((delToggle) =>
  delToggle.addEventListener('click', (event) => {
    modalConfirm('Are you sure to delete the user?', {
      iconType: bxIconEnum.DANGER,
      headingText: 'Delete',
      button1Text: 'Yes',
      button2Text: 'No',
    }).then((ret) => {
      if (ret === 1) {
        const tableRow = delToggle.closest('tr');
        tableRow.parentNode.removeChild(tableRow);
      }
      else {
        return;
      }
    });
  })
);


