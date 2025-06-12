
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

// // Navbar Command Palette Input
// const commandPaletteBackdrop = document.querySelector(
//   '.command-palette-backdrop');
// const commandPaletteInputWrapper = document.querySelector('.navbar .command-palette-input-wrapper');
// const commandPaletteInput = document.querySelector(
//   '.navbar .command-palette-input-wrapper .command-palette-input'
// );

// const commandPaletteButton = document.querySelector('.command-palette-button');
// commandPaletteButton?.addEventListener('click', (event) => {
//   showCommandPaletteInput(event);
//   event.stopPropagation();
// });

// const commandPaletteCloser = document.querySelector('.command-palette-closer');
// commandPaletteCloser?.addEventListener('click', (event) => {
//   // commandPaletteInputWrapper.classList.remove('show');
//   hideCommandPaletteInput(event);
// });

// document.addEventListener('keydown', (event) => {
//   if (event.key === 'Escape' || (event.ctrlKey && event.key === '\\')) {
//     // commandPaletteInputWrapper.classList.remove('show');
//     hideCommandPaletteInput(event);
//   }

//   if (event.ctrlKey && event.key === '\\') {
//     showCommandPaletteInput(event);
//   }
// });

// // Show Navbar Command Palette Input
// function showCommandPaletteInput(event) {
//   hideAllDropdowns(event);
//   commandPaletteBackdrop?.classList.add('show');
//   commandPaletteInputWrapper?.classList.add('show');
//   commandPaletteInput?.focus();
//   commandPaletteInput.value = '';
// }

// // Hide Navbar Command Palette Input
// function hideCommandPaletteInput(event) {
//   hideAllDropdowns(event);
//   commandPaletteBackdrop?.classList.remove('show');
//   commandPaletteInputWrapper?.classList.remove('show');
//   commandPaletteInput?.focus();
//   commandPaletteInput.value = '';
// }

// // Click on empty area to close Navbar command-palette-input
// if (commandPaletteInputWrapper) {
//   document.documentElement.addEventListener('click', (event) => {
//     if (commandPaletteInputWrapper.classList.contains('show')) {
//       if (event.target !== commandPaletteInput) {
//         // commandPaletteInputWrapper.classList.remove('show');
//         hideCommandPaletteInput(event);
//       }
//     }
//   });
// }

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


