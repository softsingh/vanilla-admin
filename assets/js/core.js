const body = document.querySelector('body');

const textColorEnum = {
  PRIMARY: 'text-primary',
  SECONDARY: 'text-secondary',
  SUCCESS: 'text-success',
  DANGER: 'text-danger',
  WARNING: 'text-warning',
  INFO: 'text-info'
}

const bxIconEnum = {
  NONE: '',
  SUCCESS: 'bx bx-check-circle text-success',
  DANGER: 'bx bx-x-circle text-danger',
  WARNING: 'bx bx-info-circle bx-rotate-180 text-warning',
  INFO: 'bx bx-info-circle text-info',
  QUESTION: 'bx bx-help-circle text-info'
}

//////////////////// Accordions ////////////////////

const accordionHeaders = document.querySelectorAll(
  '.accordion .accordion-header'
);

accordionHeaders.forEach((accordionHeader) =>
  accordionHeader.addEventListener('click', (event) => {
    const curentAccordionItem = accordionHeader.closest('.accordion-item');
    const parentName = curentAccordionItem.getAttribute('parent');

    if (parentName !== '') {
      const parent = document.getElementById(parentName);
      if (parent) {
        const accordionItems = parent.querySelectorAll('.accordion-item');
        accordionItems.forEach((accordionItem) => {
          if (accordionItem !== curentAccordionItem) {
            if (accordionItem.getAttribute('parent') === parentName) {
              accordionItem.classList.remove('open');
            }
          }
        });
      }
    }
    curentAccordionItem.classList.toggle('open');
    event.stopPropagation();
  })
);

//////////////////// Alerts ////////////////////

const alertDismissButtons = document.querySelectorAll(
  '.alert-dismissible .btn-close'
);

alertDismissButtons.forEach((alertDismissButton) =>
  alertDismissButton.addEventListener('click', (event) => {
    const alertDismiss = alertDismissButton.closest('.alert-dismissible');
    alertDismiss.classList.add('d-none');
    event.stopPropagation();
  })
);

//////////////////// Dropdown ////////////////////

const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach((dropdownToggle) =>
  dropdownToggle.addEventListener('click', (event) => {
    const dropdown = dropdownToggle.closest('.dropdown');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    hideAllDropdowns(event);
    dropdownMenu.classList.toggle('show');
    event.stopPropagation();
  })
);

function hideAllDropdowns(event) {
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');

  dropdownMenus.forEach((dropdownMenu) => {
    if (dropdownMenu.classList.contains('show')) {
      const dropdown = dropdownMenu.closest('.dropdown');
      const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
      if (event.currentTarget !== dropdownToggle) {
        dropdownMenu.classList.remove('show');
      }
    }
  });
}

//////////////////// Modal (except ModalConfirm) ////////////////////

const modals = document.querySelectorAll('.modal:not(.modal-confirm)');
const modalDialogs = document.querySelectorAll(
  '.modal:not(.modal-confirm) .modal-dialog'
);
const modalContents = document.querySelectorAll(
  '.modal:not(.modal-confirm) .modal-content'
);
const modalToggles = document.querySelectorAll('[data-toggle="modal"]');
const modalDismissToggles = document.querySelectorAll(
  '.modal:not(.modal-confirm) [data-dismiss="modal"]'
);

// Show modal if modal toggle clicked
modalToggles.forEach((modalToggle) =>
  modalToggle.addEventListener('click', (event) => {
    hideAllDropdowns(event);
    const modalID = modalToggle.getAttribute('data-target');

    if (modalID) {
      const modal = document.getElementById(modalID);
      if (modal) {
        showModal(modal);
      }
    }
    event.stopPropagation();
  })
);

// Hide modal if modal dismiss toggle clicked
modalDismissToggles.forEach((modalDismissToggle) =>
  modalDismissToggle.addEventListener('click', (event) => {
    const modal = modalDismissToggle.closest('.modal');
    if (modal) {
      hideModal(modal);
    }
    event.stopPropagation();
  })
);

// Hide model when clicked outside model-content
modalDialogs.forEach((modalDialog) =>
  modalDialog.addEventListener('click', (event) => {
    if (event.target === modalDialog) {
      const modal = modalDialog.closest('.modal');
      hideModal(modal);
      event.stopPropagation();
    }
  })
);

// Hide model when clicked outside model-content
modals.forEach((modal) =>
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      hideModal(modal);
      event.stopPropagation();
    }
  })
);

function showModal(modal) {
  const backdrop = document.createElement('div');
  backdrop.id = 'modalBackdrop';
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('data-target', modal.id);
  document.body.appendChild(backdrop);
  modal.classList.add('show');
}

function hideModal(modal) {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) {
    backdrop.remove();
  }
  modal.classList.remove('show');
}

//////////////////// ModalConfirm ////////////////////

function modalConfirm(message, options = {}) {

  const {
    headingText = '',
    button1Text = '',
    button2Text = '',
    button3Text = '',
    iconType = bxIconEnum.NONE
  } = options;

  return new Promise((resolve) => {

    const modal = createModal();
    showModal(modal);

    const button1 = modal.querySelector("#button1")
    button1.onclick = () => {
      removeModal(modal);
      resolve(1);
    };

    const button2 = modal.querySelector("#button2")

    if (button2) {
      button2.onclick = () => {
        removeModal(modal);
        resolve(2);
      };
    }

    const button3 = modal.querySelector("#button3")
    if (button3) {
      button3.onclick = () => {
        removeModal(modal);
        resolve(3);
      };
    }

    function showModal(modal) {
      createBackdrop()
      modal.classList.add('show');
    }

    function removeModal(modal) {
      removeBackdrop()
      modal.remove();
      modal.classList.remove('show');
    }

    function createBackdrop() {
      const backdrop = document.createElement('div');
      backdrop.id = 'modalConfirmBackdrop';
      backdrop.className = 'modal-backdrop modal-confirm-backdrop';
      document.body.appendChild(backdrop);
    }

    function removeBackdrop() {
      const backdrop = document.getElementById('modalConfirmBackdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }

    function createModal() {
      const modal = document.createElement('div');
      modal.id = 'modal-confirm';
      modal.className = 'modal modal-confirm';
      document.body.appendChild(modal);

      const modalDialog = document.createElement('div');
      modalDialog.className = 'modal-dialog modal-dialog-centered';
      modal.appendChild(modalDialog);

      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modalDialog.appendChild(modalContent);

      const modalHeader = document.createElement('div');
      modalHeader.className = 'modal-header';
      modalContent.appendChild(modalHeader);

      headerChildDiv = document.createElement('div');
      headerChildDiv.className = 'd-flex align-items-center';
      modalHeader.appendChild(headerChildDiv);

      if (iconType) {
        modalIcon = document.createElement('i');
        modalIcon.className = iconType + ' fs-7 me-1';
        headerChildDiv.appendChild(modalIcon);
      }

      modalHeading = document.createElement('h6');
      modalHeading.innerText = headingText;
      headerChildDiv.appendChild(modalHeading);

      const modalBody = document.createElement('div');
      modalBody.className = 'modal-body';
      modalContent.appendChild(modalBody);

      const messagePara = document.createElement('p');
      messagePara.className = 'mb-2';
      messagePara.innerText = message;
      modalBody.appendChild(messagePara);

      const modalFooter = document.createElement('div');
      modalFooter.className = 'modal-footer';
      modalContent.appendChild(modalFooter);

      const footerDiv = document.createElement('div');
      footerDiv.className = 'd-flex align-items-center gap-2';
      modalFooter.appendChild(footerDiv);

      const button1 = document.createElement('button');
      button1.className = 'btn btn-primary';
      button1.id = 'button1';
      button1.innerText = button1Text ? button1Text : "OK";
      footerDiv.appendChild(button1);

      if (button2Text) {
        const button2 = document.createElement('button');

        if (button3Text)
          button2.className = 'btn btn-danger'
        else
          button2.className = 'btn btn-secondary';

        button2.id = 'button2';
        button2.innerText = button2Text;
        footerDiv.appendChild(button2);
      }

      if (button3Text && button2Text) {
        const button3 = document.createElement('button');
        button3.className = 'btn btn-secondary';
        button3.id = 'button3';
        button3.innerText = button3Text;
        footerDiv.appendChild(button3);
      }

      return modal;
    }
  });
}

// function modalConfirm_Obsolete(message, headingText = 'Confirm', button1Text = "OK", button2Text = "", button3Text = "") {
//   return new Promise((resolve) => {

//     const modal = createModal();
//     showModal(modal);

//     const button1 = modal.querySelector("#button1")
//     button1.onclick = () => {
//       removeModal(modal);
//       resolve(1);
//     };

//     const button2 = modal.querySelector("#button2")

//     if (button2) {
//       button2.onclick = () => {
//         removeModal(modal);
//         resolve(2);
//       };
//     }

//     const button3 = modal.querySelector("#button3")
//     if (button3) {
//       button3.onclick = () => {
//         removeModal(modal);
//         resolve(3);
//       };
//     }

//     function showModal(modal) {
//       createBackdrop()
//       modal.classList.add('show');
//     }

//     function removeModal(modal) {
//       removeBackdrop()
//       modal.remove();
//       modal.classList.remove('show');
//     }

//     function createBackdrop() {
//       const backdrop = document.createElement('div');
//       backdrop.id = 'modalConfirmBackdrop';
//       backdrop.className = 'modal-backdrop modal-confirm-backdrop';
//       document.body.appendChild(backdrop);
//     }

//     function removeBackdrop() {
//       const backdrop = document.getElementById('modalConfirmBackdrop');
//       if (backdrop) {
//         backdrop.remove();
//       }
//     }

//     function createModal() {
//       const modal = document.createElement('div');
//       modal.id = 'modal-confirm';
//       modal.className = 'modal modal-confirm';
//       document.body.appendChild(modal);

//       const modalDialog = document.createElement('div');
//       modalDialog.className = 'modal-dialog modal-dialog-centered';
//       modal.appendChild(modalDialog);

//       const modalContent = document.createElement('div');
//       modalContent.className = 'modal-content';
//       modalDialog.appendChild(modalContent);

//       const modalHeader = document.createElement('div');
//       modalHeader.className = 'modal-header';
//       modalContent.appendChild(modalHeader);

//       headerChildDiv = document.createElement('div');
//       headerChildDiv.className = 'd-flex align-items-center';
//       modalHeader.appendChild(headerChildDiv);

//       modalIcon = document.createElement('i');
//       modalIcon.className = 'bx bx-x-circle fs-7 text-danger me-1';
//       headerChildDiv.appendChild(modalIcon);

//       modalHeading = document.createElement('h6');
//       modalHeading.className = 'text-danger';
//       modalHeading.innerText = headingText;
//       headerChildDiv.appendChild(modalHeading);

//       const modalBody = document.createElement('div');
//       modalBody.className = 'modal-body';
//       modalContent.appendChild(modalBody);

//       const messagePara = document.createElement('p');
//       messagePara.className = 'mb-2';
//       messagePara.innerText = message;
//       modalBody.appendChild(messagePara);

//       const modalFooter = document.createElement('div');
//       modalFooter.className = 'modal-footer';
//       modalContent.appendChild(modalFooter);

//       const footerDiv = document.createElement('div');
//       footerDiv.className = 'd-flex align-items-center gap-2';
//       modalFooter.appendChild(footerDiv);

//       const button1 = document.createElement('button');
//       button1.className = 'btn btn-primary';
//       button1.id = 'button1';
//       button1.innerText = button1Text;
//       footerDiv.appendChild(button1);

//       if (button2Text) {
//         const button2 = document.createElement('button');
//         button2.className = 'btn btn-secondary';
//         button2.id = 'button2';
//         button2.innerText = button2Text;
//         footerDiv.appendChild(button2);
//       }

//       if (button3Text) {
//         const button3 = document.createElement('button');
//         button3.className = 'btn btn-success';
//         button3.id = 'button3';
//         button3.innerText = button3Text;
//         footerDiv.appendChild(button3);
//       }

//       return modal;
//     }
//   });
// }

//////////////////// Nav ////////////////////

const navItems = document.querySelectorAll('.nav>.nav-item');

navItems.forEach((navItem) =>
  navItem.addEventListener('click', (event) => {
    clearNavItemActive(navItem);
    navItem.classList.add('active');
    event.stopPropagation();
  })
);

function clearNavItemActive(currentNavItem) {
  navItems.forEach((navItem) => {
    if (navItem !== currentNavItem) {
      navItem.classList.remove('active');
    }
  });
}

/////////////////// Sidebar ////////////////////

// Sidebar Menu
const menuItems = document.querySelectorAll('.menu>.menu-item');

menuItems.forEach((menuItem) =>
  menuItem.addEventListener('click', (event) => {
    clearMenuItemOpenActive(menuItem);
    menuItem.classList.add('active');
    menuItem.classList.toggle('open');
    event.stopPropagation();
  })
);

// Sidebar Sub-Menu
const menuSubItems = document.querySelectorAll('.menu-sub>.menu-item');

menuSubItems.forEach((menuSubItem) =>
  menuSubItem.addEventListener('click', (event) => {
    clearMenuSubItemActive(menuSubItem);

    const menuSubSub = menuSubItem.querySelectorAll('.menu-sub');

    if (menuSubSub.length > 0) {
      menuSubItem.classList.toggle('open');
    } else {
      menuSubItem.classList.add('active');
    }

    event.stopPropagation();
  })
);

function clearMenuItemOpenActive(currentMenuItem) {
  menuItems.forEach((menuItem) => {
    if (menuItem !== currentMenuItem) {
      menuItem.classList.remove('active');
      menuItem.classList.remove('open');
    }
  });
}

function clearMenuSubItemActive(currentMenuSubItem) {
  menuSubItems.forEach((menuSubItem) => {
    if (menuSubItem !== currentMenuSubItem) {
      menuSubItem.classList.remove('active');
    }
  });
}

const sidebarToggles = document.querySelectorAll('[data-toggle="sidebar"]');

sidebarToggles.forEach((sidebarToggle) =>
  sidebarToggle.addEventListener('click', (event) => {
    body.classList.toggle('sidebar-hidden');
    event.stopPropagation();
  })
);

// Hide Sidebar when Sidebar Backdrop is clicked
const sidebarBackdrop = document.querySelector('.sidebar-backdrop');

sidebarBackdrop?.addEventListener('click', () => {
  document.body.classList.add('sidebar-hidden');
});

//////////////////// Click on Empty Area ////////////////////

document.addEventListener('click', (event) => {
  hideAllDropdowns(event);
});

//////////////////// Multi Select ////////////////////
document.addEventListener('DOMContentLoaded', () => {
  const multiSelects = document.querySelectorAll('.multi-select');
  function updatedSelectedOptions(multiSelect) {
    const selectedOptions = Array.from(multiSelect.querySelectorAll('.option.active')).filter(
      option => option !== multiSelect.querySelector('.option.select-all')).map(option => {
        return {
          value: option.getAttribute('data-value'),
          text: option.textContent.trim(),
        }
      });

    selectedValues = selectedOptions.map(option => option.value);

    multiSelect.querySelector('.input-multi-select').value = selectedValues.join(', ');

    let tagsHtml = '';

    if (selectedOptions.length === 0) {
      tagsHtml = '<span class="placeholder">No options selected</span>';
    } else {
      const maxTagsToShow = 4;
      let addtionalTagsCount = 0;

      selectedOptions.forEach((option, index) => {
        if (index < maxTagsToShow) {  
          tagsHtml += `<span class="tag"> ${option.text} <span class="remove-tag" data-value="${option.value}">&times;</span> </span>`;
        } else {
          addtionalTagsCount++;
        }
      });

      if (addtionalTagsCount > 0) { 
        tagsHtml += `<span class="tag">+${addtionalTagsCount}</span>`;
      }
    }

    multiSelect.querySelector('.selected-options').innerHTML = tagsHtml;
  }

  multiSelects.forEach(multiSelect => {
    const searchInput = multiSelect.querySelector('.input-search');
    const optionsContainer = multiSelect.querySelector('.options');
    const noResultMessage = multiSelect.querySelector('.no-result-message');
    const options = multiSelect.querySelectorAll('.option');
    const selectAllOption = multiSelect.querySelector('.option.select-all');
    const clearButton = multiSelect.querySelector('.clear');
    const inputMultiSelect = multiSelect.querySelector('.input-multi-select');

    options.forEach(option => {
      option.addEventListener('click', () => {
        option.classList.toggle('active');
        updatedSelectedOptions(multiSelect);
      })
    });

    selectAllOption.addEventListener('click', () => {
      const isActive = selectAllOption.classList.contains('active');
      options.forEach(option => {
        if (option !== selectAllOption) {
          option.classList.toggle('active', isActive);
        }
      });

      updatedSelectedOptions(multiSelect);
    });

    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      options.forEach(option => {
        option.style.display = 'block';
      });
      noResultMessage.style.display = 'none';
      clearButton.style.display = 'none';
    });

    searchInput.addEventListener('input', () => {
      const searchValue = searchInput.value.toLowerCase();
      options.forEach(option => {
        const optionText = option.textContent.trim().toLowerCase();
        option.style.display = optionText.includes(searchValue) ? 'block' : 'none';
      });

      const anyOptionsMatch = Array.from(options).some(option => option.style.display === 'block');
      noResultMessage.style.display = anyOptionsMatch ? 'none' : 'block';
      clearButton.style.display = searchValue.length > 0 ? 'block' : 'none';
    });

    const inputMultiSelectValue = inputMultiSelect.value;
    if (inputMultiSelectValue && inputMultiSelectValue !== '') {
      const initialSelectedValues = inputMultiSelectValue.slice(1, -1).split(',').map(value => value.trim());
      initialSelectedValues.forEach(value => {
        const option = multiSelect.querySelector(`.option[data-value="${value}"]`);
        if (option) {
          option.classList.add('active');
        }
      });
      updatedSelectedOptions(multiSelect);
    }

  })

  document.addEventListener('click', event => {
    const removeTag = event.target.closest('.remove-tag');
    if (removeTag) {
      const multiSelect = removeTag.closest('.multi-select');
      const optionToRemove = multiSelect.querySelector(`.option[data-value="${removeTag.dataset.value}"]`);
      optionToRemove.classList.remove('active');

      const otherSelectedOptions = multiSelect.querySelectorAll(".option.active:not(.select-all");
      const selectAllOption = multiSelect.querySelector('.option.select-all');

      if (otherSelectedOptions.length === 0) {
        selectAllOption.classList.remove('active');
      }
      updatedSelectedOptions(multiSelect);
    }
  });

  const selectBoxes = document.querySelectorAll('.multi-select-box');
  selectBoxes.forEach(selectBox => {
    selectBox.addEventListener('click', (event) => {
      if (!event.target.closest('.tag')) {
        selectBox.parentNode.classList.toggle('open');
      }
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.multi-select') && !event.target.classList.contains('.remove-tag')) {
      multiSelects.forEach(multiSelect => {
        multiSelect.classList.remove('open');
      })
    }
  });
});
