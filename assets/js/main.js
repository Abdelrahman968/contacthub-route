// Txt Inputs
var fullNameInput = document.getElementById('contactName');
var phoneNumberInput = document.getElementById('contactPhone');
var emailAddressInput = document.getElementById('contactEmail');
var addressInput = document.getElementById('contactAddress');
var groupInput = document.getElementById('contactGroup');
var notesInput = document.getElementById('contactNotes');
var searchInput = document.getElementById('searchInput');

// Boolean Inputs
var isFavoriteInput = document.getElementById('contactFavorite');
var isEmergencyInput = document.getElementById('contactEmergency');

//  Image Inputs
var avatarImageInput = document.getElementById('avatarImageInput');
var avatarImagePreview = document.getElementById('avatarImagePreview');
var imagePlaceHolderIcon = document.getElementById('imagePlaceHolder');

// Form
var contactForm = document.getElementById('contactForm');
var modalCloseBtn = document.getElementById('cancelModalBtn');

// HTML Container
var statsContainer = document.getElementById('quick-stats');
var contactsContainer = document.getElementById('contacts-main');
var favoritesSection = document.getElementById('favorites-content');
var emergencySection = document.getElementById('emergency-content');
var mainListHeaderCount = document.getElementById('contacts-header-text');
var mainListContent = document.getElementById('contacts-main-content');

// Storage
var localStorageKey = 'contacts';
var mainList = [];
var currentList = [];

// Edit Mode Variables
var isEditMode = false;
var globalIndex = 0;
var oldImage = null;

if (localStorage.getItem(localStorageKey) !== null) {
  mainList = JSON.parse(localStorage.getItem(localStorageKey));
  currentList = mainList;

  if (mainList.length > 0) {
    renderStats();
    renderMainList(mainList);
  } else {
    contactsContainer.innerHTML = `
       <div class="col-12 text-center py-5">
          <div
            class="bg-secondary rounded-circle p-4 d-inline-flex align-items-center justify-content-center mb-3"
          >
            <i class="fas fa-address-book fs-2 text-muted"></i>
          </div>
          <p class="fw-semibold text-muted">No contacts found</p>
          <small class="text-muted"
            >Click
            <span
              class="btn btn-light border border-1"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              >"Add Contact"</span
            >
            to get started</small
          >
        </div>
    `;
    favoritesSection.innerHTML = `
      <div class="card-body text-center text-muted small p-5">
        No favorites yet
      </div>
    `;
    emergencySection.innerHTML = `
      <div class="card-body text-center text-muted small p-5">
        No emergency contacts
      </div>
    `;
  }
} else {
  contactsContainer.innerHTML = `
       <div class="col-12 text-center py-5">
          <div
            class="bg-secondary rounded-circle p-4 d-inline-flex align-items-center justify-content-center mb-3"
          >
            <i class="fas fa-address-book fs-2 text-muted"></i>
          </div>
          <p class="fw-semibold text-muted">No contacts found</p>
          <small class="text-muted"
            >Click
            <span
              class="btn btn-light border border-1"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              >"Add Contact"</span
            >
            to get started</small
          >
        </div>
    `;
  favoritesSection.innerHTML = `
      <div class="card-body text-center text-muted small p-5">
        No favorites yet
      </div>
    `;
  emergencySection.innerHTML = `
      <div class="card-body text-center text-muted small p-5">
        No emergency contacts
      </div>
    `;
}

searchInput.addEventListener('input', searchInputHandler);

avatarImagePreview.addEventListener('click', function () {
  avatarImageInput.click();
});
imagePlaceHolderIcon.addEventListener('click', function () {
  avatarImageInput.click();
});

avatarImageInput.addEventListener('change', function () {
  var file = avatarImageInput.files[0];
  var reader = new FileReader();

  reader.onload = function () {
    avatarImagePreview.src = reader.result;
    avatarImagePreview.classList.remove('d-none');
    avatarImagePreview.nextElementSibling.classList.add('d-none');
  };

  reader.readAsDataURL(file);

});



const patterns = [
  {
    contactName: /^[a-zA-Z0-9 ]{3,100}$/,
    contactPhone: /^(?:\+20|0020|0)(10|11|12|15)\d{8}$/,
    contactEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    contactAddress: /^[a-zA-Z0-9 .,!?()\-]{10,500}$/,
    contactGroup: /^[a-zA-Z ]{3,50}$/,
    contactNotes: /^[a-zA-Z0-9 .,!?()\-+=]{10,500}$/,
  },
];

function validated(elm) {
  var value = elm.value.trim();

  if (value === '') {
    elm.classList.remove('is-valid');
    elm.classList.add('is-invalid');
    return false;
  }

  var pattern = patterns[0][elm.id];

  if (!pattern) {
    return true;
  }

  if (!pattern.test(value)) {
    elm.classList.remove('is-valid');
    elm.classList.add('is-invalid');
    return false;
  }

  if (elm.id === 'contactEmail' || elm.id === 'contactPhone') {
    var isDuplicate = false;

    for (var i = 0; i < currentList.length; i++) {
      if (isEditMode && i === globalIndex) {
        continue;
      }

      if (elm.id === 'contactEmail') {
        if (currentList[i].emailAddress.toLowerCase() === value.toLowerCase()) {
          isDuplicate = true;
          break;
        }
      }

      if (elm.id === 'contactPhone') {
        if (currentList[i].phoneNumber === value) {
          isDuplicate = true;
          break;
        }
      }
    }

    if (isDuplicate) {
      elm.classList.remove('is-valid');
      elm.classList.add('is-invalid');
      return false;
    }
  }

  elm.classList.remove('is-invalid');
  elm.classList.add('is-valid');
  return true;
}

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  var isNameValid = validated(fullNameInput);
  var isPhoneValid = validated(phoneNumberInput);
  var isEmailValid = validated(emailAddressInput);
  var isAddressValid = validated(addressInput);
  var isGroupValid = validated(groupInput);
  var isNotesValid = validated(notesInput);

  var isValid =
    isNameValid &&
    isPhoneValid &&
    isEmailValid &&
    isAddressValid &&
    isGroupValid &&
    isNotesValid;

  if (!isValid) {
    Swal.fire({
      title: 'Error!',
      text: 'Please fix the errors before submitting.',
      icon: 'error',
      showConfirmButton: true,
    });
    return;
  }

  if (isEditMode) {
    editFinal();
  } else {
    addNewContact();
  }
});

function addNewContact() {
  var file = avatarImageInput.files[0];
  var names = fullNameInput.value.trim().split(' ');

  if (names.length >= 2) {
    var initials = names[0][0].toUpperCase() + names[1][0].toUpperCase();
  } else {
    var initials =
      names[0][0].toUpperCase() + names[0][names.length - 1].toUpperCase();
  }

  if (file) {
    var reader = new FileReader();
    reader.onload = function () {
      var contact = {
        id: Date.now(),
        avatarImage: reader.result,
        fullName: fullNameInput.value,
        phoneNumber: phoneNumberInput.value,
        emailAddress: emailAddressInput.value,
        address: addressInput.value,
        group: groupInput.value,
        notes: notesInput.value,
        isFavorite: isFavoriteInput.checked,
        isEmergency: isEmergencyInput.checked,
      };

      mainList.push(contact);
      localStorage.setItem(localStorageKey, JSON.stringify(mainList));
      currentList = mainList;
      resetForm();
      modalClose();
      renderStats();
      renderMainList(mainList);

      Swal.fire({
        title: 'Added!',
        text: 'Contact has been added successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    };

    reader.readAsDataURL(file);
  } else {
    var contact = {
      id: Date.now(),
      avatarImage: initials,
      fullName: fullNameInput.value,
      phoneNumber: phoneNumberInput.value,
      emailAddress: emailAddressInput.value,
      address: addressInput.value,
      group: groupInput.value,
      notes: notesInput.value,
      isFavorite: isFavoriteInput.checked,
      isEmergency: isEmergencyInput.checked,
    };

    mainList.push(contact);
    localStorage.setItem(localStorageKey, JSON.stringify(mainList));
    currentList = mainList;
    renderStats();
    resetForm();
    modalClose();
    renderMainList(mainList);

    Swal.fire({
      title: 'Added!',
      text: 'Contact has been added successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

function setupEdit(index) {
  isEditMode = true;
  globalIndex = index;

  var clickedItem = mainList[index];

  fullNameInput.value = clickedItem.fullName;
  phoneNumberInput.value = clickedItem.phoneNumber;
  emailAddressInput.value = clickedItem.emailAddress;
  addressInput.value = clickedItem.address;
  groupInput.value = clickedItem.group;
  notesInput.value = clickedItem.notes;

  oldImage = clickedItem.avatarImage;

  if (oldImage.includes('/')) {
    avatarImagePreview.src = oldImage;
    avatarImagePreview.classList.remove('d-none');
    avatarImagePreview.nextElementSibling.classList.add('d-none');
  } else {
    avatarImagePreview.innerHTML = `
    <div class="d-flex align-items-center justify-content-center rounded-3 text-white
     fw-bolder">
        ${oldImage}
      </div>
    `;
    avatarImagePreview.classList.add('d-none');
    avatarImagePreview.nextElementSibling.classList.add('d-none');
  }

  renderMainList(currentList);
}

function editFinal() {
  mainList[globalIndex].fullName = fullNameInput.value;
  mainList[globalIndex].phoneNumber = phoneNumberInput.value;
  mainList[globalIndex].emailAddress = emailAddressInput.value;
  mainList[globalIndex].address = addressInput.value;
  mainList[globalIndex].group = groupInput.value;
  mainList[globalIndex].notes = notesInput.value;

  if (avatarImageInput.files.length > 0) {
    var reader = new FileReader();

    reader.onload = function () {
      mainList[globalIndex].avatarImage = reader.result;
      saveAfterEdit();
    };

    reader.readAsDataURL(avatarImageInput.files[0]);
  } else {
    mainList[globalIndex].avatarImage = oldImage;
    saveAfterEdit();
  }
  // document.querySelectorAll('.is-valid').classList.remove('is-valid');
  // document.querySelectorAll('.is-invalid').classList.remove('is-invalid');
}

function saveAfterEdit() {
  localStorage.setItem(localStorageKey, JSON.stringify(mainList));
  renderMainList(currentList);
  resetForm();
  modalClose();
  renderStats();
  handelFav(mainList);
  handelEmer(mainList);

  Swal.fire({
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500,
  });
}

function deleteItem(index) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      cancelButton: 'btn btn-success m-1',
      confirmButton: 'btn btn-danger m-1 fw-bolder',
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then(result => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
        mainList.splice(index, 1);
        currentList = mainList;
        localStorage.setItem(localStorageKey, JSON.stringify(mainList));

        if (mainList.length === 0) {
          mainListContent.innerHTML = `
            <div class="col-12 text-center py-5">
              <div
                class="bg-secondary rounded-circle p-4 d-inline-flex align-items-center justify-content-center mb-3"
              >
                <i class="fas fa-address-book fs-2 text-muted"></i>
              </div>
              <p class="fw-semibold text-muted">No contacts found</p>
              <small class="text-muted"
                >Click
                <span
                  class="btn btn-light border border-1"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  >"Add Contact"</span
                >
                to get started</small
              >
            </div>
          `;
          favoritesSection.innerHTML = `
            <div class="card-body text-center text-muted small p-5">
              No favorites yet
            </div>
          `;
          emergencySection.innerHTML = `
            <div class="card-body text-center text-muted small p-5">
              No emergency contacts
            </div>
          `;
        } else {
          renderMainList(currentList);
          handelFav(mainList);
          handelEmer(mainList);
        }

        renderStats();
        handelFav(mainList);
        handelEmer(mainList);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelled',
          text: 'Your Contact is safe :)',
          icon: 'error',
        });
      }
    });
}

function modalClose() {
  modalCloseBtn.click();
}

function resetForm() {
  contactForm.reset();
  avatarImagePreview.src = '';
  avatarImagePreview.classList.add('d-none');
  avatarImagePreview.nextElementSibling.classList.remove('d-none');
  isEditMode = false;
  globalIndex = 0;
  oldImage = null;
}

function renderStats() {
  var favoriteCount = 0;
  var emergencyCount = 0;

  for (var i = 0; i < mainList.length; i++) {
    if (mainList[i].isFavorite) {
      favoriteCount++;
    }
    if (mainList[i].isEmergency) {
      emergencyCount++;
    }
  }

  statsContainer.innerHTML = `
    <div class="row g-3">
          <div class="col-sm-12 col-md-6 col-lg-4">
            <div class="card shadow-sm rounded-4 border border-1 h-100">
              <div class="card-body d-flex align-items-center gap-3">
                <div class="bg-primary text-white rounded-4 p-3">
                  <i class="fas fa-users"></i>
                </div>
                <div>
                  <small class="text-muted text-uppercase fw-semibold"
                    >Total</small
                  >
                  <div class="fs-4 fw-bold">${mainList.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-12 col-md-6 col-lg-4">
            <div class="card shadow-sm rounded-4 border border-1 h-100">
              <div class="card-body d-flex align-items-center gap-3">
                <div class="bg-warning text-white rounded-4 p-3">
                  <i class="fas fa-star"></i>
                </div>
                <div>
                  <small class="text-muted text-uppercase fw-semibold"
                    >Favorites</small
                  >
                  <div class="fs-4 fw-bold">${favoriteCount}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-12 col-md-6 col-lg-4">
            <div class="card shadow-sm rounded-4 border border-1 h-100">
              <div class="card-body d-flex align-items-center gap-3">
                <div class="bg-danger text-white rounded-4 p-3">
                  <i class="fas fa-heart-pulse"></i>
                </div>
                <div>
                  <small class="text-muted text-uppercase fw-semibold"
                    >Emergency</small
                  >
                  <div class="fs-4 fw-bold">${emergencyCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
  `;

  mainListHeaderCount.innerHTML = `
    <p id="contacts-header-text" class="text-muted small">Manage and organize your ${mainList.length} contacts</p>
  `;
}

function toggleFavorite(index) {
  currentList[index].isFavorite = !currentList[index].isFavorite;
  localStorage.setItem(localStorageKey, JSON.stringify(mainList));
  renderStats();
  renderMainList(currentList);
  handelFav(mainList);
  handelEmer(mainList);
}

function toggleEmergency(index) {
  currentList[index].isEmergency = !currentList[index].isEmergency;
  localStorage.setItem(localStorageKey, JSON.stringify(mainList));
  renderStats();
  renderMainList(currentList);
  handelFav(mainList);
  handelEmer(mainList);
}

function renderMainList(list) {
  if (!list) {
    list = mainList;
  }

  currentList = list;

  function stringToColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '000000'.substring(0, 6 - color.length) + color;
  }

  function displayAvatarImage(i) {
    var contact = list[i];
    if (contact.avatarImage.includes('/')) {
      return `
      <div class="avatar-gradient d-flex align-items-center justify-content-center text-white rounded-3 overflow-hidden">
        <img src="${contact.avatarImage}" class="w-100 h-100 object-fit-cover overflow-hidden" alt="avatar">
      </div>
    `;
    } else {
      var bgColor = stringToColor(contact.avatarImage);
      return `
      <div class="avatar-container d-flex align-items-center justify-content-center rounded-3 text-white
      shadow-lg fw-bolder" style="background-color: ${bgColor};">
        ${contact.avatarImage}
      </div>
    `;
    }
  }

  function checkStats(i) {
    if (list[i].isEmergency && list[i].isFavorite) {
      return `
          <div
            class="overlay-badge overlay-heart position-absolute"
          >
            <i class="fas fa-heart-pulse"></i>
          </div>
          <div
            class="overlay-badge overlay-star position-absolute"
          >
            <i class="fas fa-star"></i>
          </div>
        `;
    } else if (list[i].isEmergency) {
      return `
          <div
            class="overlay-badge overlay-heart position-absolute"
          >
            <i class="fas fa-heart-pulse"></i>
          </div>
        `;
    } else if (list[i].isFavorite) {
      return `
          <div
            class="overlay-badge overlay-star position-absolute"
          >
            <i class="fas fa-star"></i>
          </div>
        `;
    } else {
      return '';
    }
  }

  function checkFavorites(i) {
    if (list[i].isFavorite) {
      return `
        <button
          class="btn nav-header-btn border border-0 rounded-3 favorites-btn"
          title="Favorite"
          onclick="toggleFavorite(${i})"
          >
          <i class="fa-solid fa-star"></i>
        </button>
      `;
    } else {
      return `
        <button
          class="btn nav-header-btn border border-0 rounded-3"
            title="Favorite"
            onclick="toggleFavorite(${i})"
             >
          <i class="fa-solid fa-star"></i>
        </button>
      `;
    }
  }

  function checkEmergency(i) {
    if (list[i].isEmergency) {
      return `
        <button
          class="btn nav-header-btn border border-0 rounded-3 emergency-btn"
          title="Emergency"
          onclick="toggleEmergency(${i})"
          >
          <i class="fa-solid fa-heart-pulse"></i>
        </button>
      `;
    } else {
      return `
        <button
          class="btn nav-header-btn border border-0 rounded-3"
          title="Emergency"
          onclick="toggleEmergency(${i})"
          >
          <i class="fa-solid fa-heart"></i>
        </button>
      `;
    }
  }

  var displayList = '';
  for (var i = list.length - 1; i >= 0; i--) {
    var contact = list[i];

    displayList += `
  <div class="col-lg-6 col-md-6 col-12">
    <div class="card border shadow-sm rounded-4 custom-card">
        <div class="card-body flex-grow-1">
          <div class="d-flex align-items-start gap-3">
            <div class="position-relative flex-shrink-0">
              ${displayAvatarImage(i)}
              ${checkStats(i)}
            </div>

            <div class="flex-grow-1 min-w-0 pt-1">
              <h5 class="card-title text-truncate-ellipsis mb-1">
                ${contact.fullName}
              </h5>
              <div class="d-flex align-items-center gap-2 mt-1">
                <div
                  class="d-flex align-items-center justify-content-center rounded bg-primary-subtle text-primary"
                  style="width: 24px; height: 24px; font-size: 9px"
                >
                  <i class="fas fa-phone"></i>
                </div>
                <span class="text-muted text-truncate-ellipsis"
                            >${contact.phoneNumber}</span
                          >
                        </div>
                      </div>
                    </div>

                    <div class="mt-3">
                      <div class="d-flex align-items-center gap-2 mb-2">
                        <div
                          class="d-flex align-items-center justify-content-center rounded bg-purple-subtle text-purple"
                          style="width: 28px; height: 28px; font-size: 10px"
                        >
                          <i class="fas fa-envelope"></i>
                        </div>
                        <span class="text-muted text-truncate-ellipsis"
                          >${contact.emailAddress}</span
                        >
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <div
                          class="d-flex align-items-center justify-content-center rounded bg-success-subtle text-success"
                          style="width: 28px; height: 28px; font-size: 10px"
                        >
                          <i class="fas fa-location-dot"></i>
                        </div>
                        <span class="text-muted text-truncate-ellipsis"
                          >${contact.address}</span
                        >
                      </div>
                    </div>

                    <div class="mt-3 d-flex flex-wrap gap-1">
                      <span class="badge ${contact.group.toLowerCase()} badge-custom">
                        ${contact.group}
                      </span>
                      <span 
                        class="badge emergency badge-custom d-flex align-items-center gap-1"
                      >
                        <i
                          class="fas fa-heart-pulse"
                          style="font-size: 10px"
                        ></i
                        >Emergency
                      </span>
                    </div>
                  </div>

                  <!-- Footer Actions -->
                  <div
                    class="card-footer d-flex justify-content-between bg-card-footer py-2 px-3 mt-auto border-top"
                  >
                    <div class="d-flex gap-1">
                      <a
                        href="tel:${contact.phoneNumber}"
                        class="footer-btn phone"
                        title="Call"
                      >
                        <i class="fa-solid fa-phone"></i>
                      </a>
                      <a
                        href="mailto:${contact.emailAddress}"
                        class="footer-btn email"
                        title="Email"
                      >
                        <i class="fa-solid fa-envelope"></i>
                      </a>
                      <button class="footer-btn notes border-0 cursor-help" title="${
                        contact.notes
                      }">
                        <i class="fa-solid fa-circle-info"></i>
                      </button>
                    </div>
                    <div class="d-flex gap-1">
                      ${checkFavorites(i)}
                      ${checkEmergency(i)}
                      <button
                        class="btn nav-header-btn border border-0 rounded-3 edit-btn"
                        title="Edit"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                        onclick="setupEdit(${i})"
                      >
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button
                        class="btn nav-header-btn border border-0 rounded-3 delete-btn"
                        title="Delete"
                        onclick="deleteItem(${i})"
                        id="delete-btn"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
  `;
  }

  mainListContent.innerHTML = displayList;
}

function handelFav() {
  var displayFav = '';

  function stringToColor(str) {
    var hash = 0;
    for (var j = 0; j < str.length; j++) {
      hash = str.charCodeAt(j) + ((hash << 5) - hash);
    }
    var color = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '000000'.substring(0, 6 - color.length) + color;
  }

  function displayAvatarImage(index) {
    var contact = mainList[index];
    if (contact.avatarImage.includes('/')) {
      return `
      <div class="avatar-gradient d-flex align-items-center justify-content-center text-white rounded-3 overflow-hidden">
        <img src="${contact.avatarImage}" class="w-100 h-100 object-fit-cover overflow-hidden" alt="avatar">
      </div>
    `;
    } else {
      var bgColor = stringToColor(contact.avatarImage);
      return `
      <div class="avatar-container d-flex align-items-center justify-content-center rounded-3 text-white
      shadow-lg fw-bolder" style="background-color: ${bgColor};">
        ${contact.avatarImage}
      </div>
    `;
    }
  }

  for (var i = 0; i < mainList.length; i++) {
    if (mainList[i].isFavorite) {
      displayFav += `
      <div class="col-12">
                <div
                  class="contact-item d-flex align-items-center gap-3 p-3 rounded-4 bg-light cursor-pointer"
                >
                  <div class="flex-shrink-0">
                    <div
                      class="avatar-box d-flex align-items-center justify-content-center text-white fw-semibold shadow-sm"
                    >
                      ${displayAvatarImage(i)}
                    </div>
                  </div>
                  <div class="flex-grow-1 overflow-hidden">
                    <h4 class="mb-0 fw-medium text-dark small text-truncate">
                      ${mainList[i].fullName}
                    </h4>
                    <p class="mb-0 text-muted small text-truncate">
                      ${mainList[i].phoneNumber}
                    </p>
                  </div>

                  <a
                    href="tel:${mainList[i].phoneNumber}"
                    class="call-btn d-flex align-items-center justify-content-center flex-shrink-0"
                  >
                    <i class="fas fa-phone small"></i>
                  </a>
                </div>
              </div>
      `;
    }
  }

  if (displayFav === '') {
    favoritesSection.innerHTML = `
      <div class="card-body text-center text-muted small px-5 py-3">
        No favorites contacts yet
      </div>
    `;
  } else {
    favoritesSection.innerHTML = displayFav;
  }
}

function handelEmer() {
  var displayEmer = '';

  function displayAvatarImage(index) {
    var contact = mainList[index];
    if (contact.avatarImage.includes('/')) {
      return `
      <div class="avatar-gradient d-flex align-items-center justify-content-center text-white rounded-3 overflow-hidden">
        <img src="${contact.avatarImage}" class="w-100 h-100 object-fit-cover overflow-hidden" alt="avatar">
      </div>
    `;
    } else {
      return `
      <div class="avatar-container d-flex align-items-center justify-content-center rounded-3 text-white
      shadow-lg fw-bolder">
        ${contact.avatarImage}
      </div>
    `;
    }
  }

  for (var i = 0; i < mainList.length; i++) {
    if (mainList[i].isEmergency) {
      displayEmer += `
      <div class="col-12">
                <div
                  class="contact-item d-flex align-items-center gap-3 p-3 rounded-4 bg-light cursor-pointer"
                >
                  <div class="flex-shrink-0">
                    <div
                      class="avatar-box d-flex align-items-center justify-content-center text-white fw-semibold shadow-sm"
                    >
                      ${displayAvatarImage(i)}
                    </div>
                  </div>
                  <div class="flex-grow-1 overflow-hidden">
                    <h4 class="mb-0 fw-medium text-dark small text-truncate">
                      ${mainList[i].fullName}
                    </h4>
                    <p class="mb-0 text-muted small text-truncate">
                      ${mainList[i].phoneNumber}
                    </p>
                  </div>

                  <a
                    href="tel:${mainList[i].phoneNumber}"
                    class="call-btn-em d-flex align-items-center justify-content-center flex-shrink-0"
                  >
                    <i class="fas fa-phone small"></i>
                  </a>
                </div>
              </div>
      `;
    }
  }

  if (displayEmer === '') {
    emergencySection.innerHTML = `
      <div class="card-body text-center text-muted small px-5 py-3">
        No emergency contacts yet
      </div>
    `;
  } else {
    emergencySection.innerHTML = displayEmer;
  }
}

function searchInputHandler() {
  var term = searchInput.value.toLowerCase().trim();
  var newList = [];

  for (var i = mainList.length - 1; i >= 0; i--) {
    var contact = mainList[i];
    var isMatch =
      contact.fullName.toLowerCase().includes(term) ||
      contact.phoneNumber.toLowerCase().includes(term) ||
      contact.address.toLowerCase().includes(term);

    if (isMatch) {
      newList.push(contact);
    }
  }
  renderMainList(newList);
}

renderStats();
renderMainList(mainList);
handelFav(mainList);
handelEmer(mainList);
