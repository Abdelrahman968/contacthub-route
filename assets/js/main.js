// DOM Element References
const elements = {
  // Text Inputs
  fullName: document.getElementById('contactName'),
  phoneNumber: document.getElementById('contactPhone'),
  email: document.getElementById('contactEmail'),
  address: document.getElementById('contactAddress'),
  group: document.getElementById('contactGroup'),
  notes: document.getElementById('contactNotes'),
  search: document.getElementById('searchInput'),

  // Boolean Inputs
  favorite: document.getElementById('contactFavorite'),
  emergency: document.getElementById('contactEmergency'),

  // Image Inputs
  avatarInput: document.getElementById('avatarImageInput'),
  avatarPreview: document.getElementById('avatarImagePreview'),
  avatarPlaceholder: document.getElementById('imagePlaceHolder'),

  // Form
  form: document.getElementById('contactForm'),
  modalCloseBtn: document.getElementById('cancelModalBtn'),

  // Containers
  stats: document.getElementById('quick-stats'),
  contactsMain: document.getElementById('contacts-main'),
  favorites: document.getElementById('favorites-content'),
  emergency: document.getElementById('emergency-content'),
  headerCount: document.getElementById('contacts-header-text'),
  mainContent: document.getElementById('contacts-main-content'),
};

// Storage and State
const STORAGE_KEY = 'contacts';
let mainList = [];
let currentList = [];
let isEditMode = false;
let editIndex = -1;
let oldImage = null;

// Validation Patterns
const patterns = {
  contactName: /^[a-zA-Z0-9 ]{3,100}$/,
  contactPhone: /^(?:\+20|0020|0)(10|11|12|15)\d{8}$/,
  contactEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  contactAddress: /^[a-zA-Z0-9 .,!?()\-]{10,500}$/,
  contactGroup: /^[a-zA-Z ]{3,50}$/,
  contactNotes: /^[a-zA-Z0-9 .,!?()\-+=]{10,500}$/,
};

// Utility Functions
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '000000'.substring(0, 6 - color.length) + color;
}

function getInitials(fullName) {
  const names = fullName.trim().split(' ');
  if (names.length >= 2) {
    return names[0][0].toUpperCase() + names[1][0].toUpperCase();
  }
  return (
    names[0][0].toUpperCase() + names[0][names[0].length - 1].toUpperCase()
  );
}

function displayEmptyState() {
  const emptyHTML = `
    <div class="col-12 text-center py-5">
      <div class="bg-secondary rounded-circle p-4 d-inline-flex align-items-center justify-content-center mb-3">
        <i class="fas fa-address-book fs-2 text-muted"></i>
      </div>
      <p class="fw-semibold text-muted">No contacts found</p>
      <small class="text-muted">
        Click <span class="btn btn-light border border-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop">"Add Contact"</span> to get started
      </small>
    </div>
  `;

  elements.mainContent.innerHTML = emptyHTML;
  elements.favorites.innerHTML =
    '<div class="card-body text-center text-muted small p-5">No favorites yet</div>';
  elements.emergency.innerHTML =
    '<div class="card-body text-center text-muted small p-5">No emergency contacts</div>';
  renderStats()
}

// Validation
function validateField(input) {
  const value = input.value.trim();

  if (value === '') {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    return false;
  }

  const pattern = patterns[input.id];
  if (pattern && !pattern.test(value)) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    return false;
  }

  // Check for duplicates (email and phone)
  if (input.id === 'contactEmail' || input.id === 'contactPhone') {
    const isDuplicate = mainList.some((contact, idx) => {
      if (isEditMode && idx === editIndex) return false;

      if (input.id === 'contactEmail') {
        return contact.emailAddress.toLowerCase() === value.toLowerCase();
      }
      if (input.id === 'contactPhone') {
        return contact.phoneNumber === value;
      }
      return false;
    });

    if (isDuplicate) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return false;
    }
  }

  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  return true;
}

// Contact Operations
function addContact() {
  const file = elements.avatarInput.files[0];
  const initials = getInitials(elements.fullName.value);

  const saveContact = avatarImage => {
    const contact = {
      id: Date.now(),
      avatarImage,
      fullName: elements.fullName.value.trim(),
      phoneNumber: elements.phoneNumber.value.trim(),
      emailAddress: elements.email.value.trim(),
      address: elements.address.value.trim(),
      group: elements.group.value.trim(),
      notes: elements.notes.value.trim(),
      isFavorite: elements.favorite.checked,
      isEmergency: elements.emergency.checked,
    };

    mainList.push(contact);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mainList));
    currentList = mainList;

    resetForm();
    closeModal();
    renderAll();

    Swal.fire({
      title: 'Added!',
      text: 'Contact has been added successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => saveContact(reader.result);
    reader.readAsDataURL(file);
  } else {
    saveContact(initials);
  }
}

function editContact() {
  mainList[editIndex].fullName = elements.fullName.value.trim();
  mainList[editIndex].phoneNumber = elements.phoneNumber.value.trim();
  mainList[editIndex].emailAddress = elements.email.value.trim();
  mainList[editIndex].address = elements.address.value.trim();
  mainList[editIndex].group = elements.group.value.trim();
  mainList[editIndex].notes = elements.notes.value.trim();
  mainList[editIndex].isFavorite = elements.favorite.checked;
  mainList[editIndex].isEmergency = elements.emergency.checked;

  const file = elements.avatarInput.files[0];

  const saveEdit = avatarImage => {
    mainList[editIndex].avatarImage = avatarImage;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mainList));

    resetForm();
    closeModal();
    renderAll();

    Swal.fire({
      icon: 'success',
      title: 'Contact updated successfully',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => saveEdit(reader.result);
    reader.readAsDataURL(file);
  } else {
    saveEdit(oldImage);
  }
}

function setupEdit(index) {
  isEditMode = true;
  editIndex = index;

  const contact = mainList[index];

  elements.fullName.value = contact.fullName;
  elements.phoneNumber.value = contact.phoneNumber;
  elements.email.value = contact.emailAddress;
  elements.address.value = contact.address;
  elements.group.value = contact.group;
  elements.notes.value = contact.notes;
  elements.favorite.checked = contact.isFavorite;
  elements.emergency.checked = contact.isEmergency;

  oldImage = contact.avatarImage;

  if (oldImage.includes('/')) {
    elements.avatarPreview.src = oldImage;
    elements.avatarPreview.classList.remove('d-none');
    elements.avatarPlaceholder.classList.add('d-none');
  } else {
    elements.avatarPreview.classList.add('d-none');
    elements.avatarPlaceholder.classList.remove('d-none');
  }
}

function deleteContact(index) {
  const swalButtons = Swal.mixin({
    customClass: {
      cancelButton: 'btn btn-success m-1',
      confirmButton: 'btn btn-danger m-1 fw-bolder',
    },
    buttonsStyling: false,
  });

  swalButtons
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
        mainList.splice(index, 1);
        currentList = mainList;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mainList));

        renderAll();

        swalButtons.fire({
          title: 'Deleted!',
          text: 'Contact has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
}

function toggleFavorite(index) {
  mainList[index].isFavorite = !mainList[index].isFavorite;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mainList));
  renderAll();
}

function toggleEmergency(index) {
  mainList[index].isEmergency = !mainList[index].isEmergency;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mainList));
  renderAll();
}

// Rendering Functions
function renderStats() {
  const favoriteCount = mainList.filter(c => c.isFavorite).length;
  const emergencyCount = mainList.filter(c => c.isEmergency).length;

  elements.stats.innerHTML = `
    <div class="row g-3">
      <div class="col-sm-12 col-md-6 col-lg-4">
        <div class="card shadow-sm rounded-4 border border-1 h-100">
          <div class="card-body d-flex align-items-center gap-3">
            <div class="bg-primary text-white rounded-4 p-3">
              <i class="fas fa-users"></i>
            </div>
            <div>
              <small class="text-muted text-uppercase fw-semibold">Total</small>
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
              <small class="text-muted text-uppercase fw-semibold">Favorites</small>
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
              <small class="text-muted text-uppercase fw-semibold">Emergency</small>
              <div class="fs-4 fw-bold">${emergencyCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  elements.headerCount.innerHTML = `
    <p class="text-muted small">Manage and organize your ${mainList.length} contacts</p>
  `;
}

function renderAvatar(contact) {
  if (contact.avatarImage.includes('/')) {
    return `
      <div class="avatar-gradient d-flex align-items-center justify-content-center text-white rounded-3 overflow-hidden">
        <img src="${contact.avatarImage}" class="w-100 h-100 object-fit-cover overflow-hidden" alt="avatar">
      </div>
    `;
  }
  const bgColor = stringToColor(contact.avatarImage);
  return `
    <div class="avatar-container d-flex align-items-center justify-content-center rounded-3 text-white shadow-lg fw-bolder" style="background-color: ${bgColor};">
      ${contact.avatarImage}
    </div>
  `;
}

function renderBadges(contact) {
  let badges = '';
  if (contact.isEmergency) {
    badges +=
      '<div class="overlay-badge overlay-heart position-absolute"><i class="fas fa-heart-pulse"></i></div>';
  }
  if (contact.isFavorite) {
    badges +=
      '<div class="overlay-badge overlay-star position-absolute"><i class="fas fa-star"></i></div>';
  }
  return badges;
}

function renderMainList(list = mainList) {
  currentList = list;

  if (list.length === 0) {
    displayEmptyState();
    return;
  }

  const html = list
    .map((contact, index) => {
      const realIndex = mainList.indexOf(contact);
      const favClass = contact.isFavorite ? 'favorites-btn' : '';
      const emerClass = contact.isEmergency ? 'emergency-btn' : '';
      const emerIcon = contact.isEmergency ? 'fa-heart-pulse' : 'fa-heart';

      return `
      <div class="col-lg-6 col-md-6 col-12">
        <div class="card border shadow-sm rounded-4 custom-card">
          <div class="card-body flex-grow-1">
            <div class="d-flex align-items-start gap-3">
              <div class="position-relative flex-shrink-0">
                ${renderAvatar(contact)}
                ${renderBadges(contact)}
              </div>
              <div class="flex-grow-1 min-w-0 pt-1">
                <h5 class="card-title text-truncate-ellipsis mb-1">${
                  contact.fullName
                }</h5>
                <div class="d-flex align-items-center gap-2 mt-1">
                  <div class="d-flex align-items-center justify-content-center rounded bg-primary-subtle text-primary" style="width: 24px; height: 24px; font-size: 9px">
                    <i class="fas fa-phone"></i>
                  </div>
                  <span class="text-muted text-truncate-ellipsis">${
                    contact.phoneNumber
                  }</span>
                </div>
              </div>
            </div>
            
            <div class="mt-3">
              <div class="d-flex align-items-center gap-2 mb-2">
                <div class="d-flex align-items-center justify-content-center rounded bg-purple-subtle text-purple" style="width: 28px; height: 28px; font-size: 10px">
                  <i class="fas fa-envelope"></i>
                </div>
                <span class="text-muted text-truncate-ellipsis">${
                  contact.emailAddress
                }</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <div class="d-flex align-items-center justify-content-center rounded bg-success-subtle text-success" style="width: 28px; height: 28px; font-size: 10px">
                  <i class="fas fa-location-dot"></i>
                </div>
                <span class="text-muted text-truncate-ellipsis">${
                  contact.address
                }</span>
              </div>
            </div>
            
            <div class="mt-3 d-flex flex-wrap gap-1">
              <span class="badge ${contact.group.toLowerCase()} badge-custom">${
        contact.group
      }</span>
            </div>
          </div>
          
          <div class="card-footer d-flex justify-content-between bg-card-footer py-2 px-3 mt-auto border-top">
            <div class="d-flex gap-1">
              <a href="tel:${
                contact.phoneNumber
              }" class="footer-btn phone" title="Call">
                <i class="fa-solid fa-phone"></i>
              </a>
              <a href="mailto:${
                contact.emailAddress
              }" class="footer-btn email" title="Email">
                <i class="fa-solid fa-envelope"></i>
              </a>
              <button class="footer-btn notes border-0 cursor-help" title="${
                contact.notes
              }">
                <i class="fa-solid fa-circle-info"></i>
              </button>
            </div>
            <div class="d-flex gap-1">
              <button class="btn nav-header-btn border border-0 rounded-3 ${favClass}" title="Favorite" onclick="toggleFavorite(${realIndex})">
                <i class="fa-solid fa-star"></i>
              </button>
              <button class="btn nav-header-btn border border-0 rounded-3 ${emerClass}" title="Emergency" onclick="toggleEmergency(${realIndex})">
                <i class="fa-solid ${emerIcon}"></i>
              </button>
              <button class="btn nav-header-btn border border-0 rounded-3 edit-btn" title="Edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="setupEdit(${realIndex})">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn nav-header-btn border border-0 rounded-3 delete-btn" title="Delete" onclick="deleteContact(${realIndex})">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  elements.mainContent.innerHTML = html;
}

function renderFavorites() {
  const favorites = mainList.filter(c => c.isFavorite);

  if (favorites.length === 0) {
    elements.favorites.innerHTML =
      '<div class="card-body text-center text-muted small px-5 py-3">No favorites yet</div>';
    return;
  }

  const html = favorites
    .map(
      contact => `
    <div class="col-12">
      <div class="contact-item d-flex align-items-center gap-3 p-3 rounded-4 bg-light cursor-pointer">
        <div class="flex-shrink-0">
          <div class="avatar-box d-flex align-items-center justify-content-center text-white fw-semibold shadow-sm">
            ${renderAvatar(contact)}
          </div>
        </div>
        <div class="flex-grow-1 overflow-hidden">
          <h4 class="mb-0 fw-medium text-dark small text-truncate">${
            contact.fullName
          }</h4>
          <p class="mb-0 text-muted small text-truncate">${
            contact.phoneNumber
          }</p>
        </div>
        <a href="tel:${
          contact.phoneNumber
        }" class="call-btn d-flex align-items-center justify-content-center flex-shrink-0">
          <i class="fas fa-phone small"></i>
        </a>
      </div>
    </div>
  `
    )
    .join('');

  elements.favorites.innerHTML = html;
}

function renderEmergency() {
  const emergencyContacts = mainList.filter(c => c.isEmergency);

  if (emergencyContacts.length === 0) {
    elements.emergency.innerHTML =
      '<div class="card-body text-center text-muted small px-5 py-3">No emergency contacts yet</div>';
    return;
  }

  const html = emergencyContacts
    .map(
      contact => `
    <div class="col-12">
      <div class="contact-item d-flex align-items-center gap-3 p-3 rounded-4 bg-light cursor-pointer">
        <div class="flex-shrink-0">
          <div class="avatar-box d-flex align-items-center justify-content-center text-white fw-semibold shadow-sm">
            ${renderAvatar(contact)}
          </div>
        </div>
        <div class="flex-grow-1 overflow-hidden">
          <h4 class="mb-0 fw-medium text-dark small text-truncate">${
            contact.fullName
          }</h4>
          <p class="mb-0 text-muted small text-truncate">${
            contact.phoneNumber
          }</p>
        </div>
        <a href="tel:${
          contact.phoneNumber
        }" class="call-btn-em d-flex align-items-center justify-content-center flex-shrink-0">
          <i class="fas fa-phone small"></i>
        </a>
      </div>
    </div>
  `
    )
    .join('');

  elements.emergency.innerHTML = html;
}

function renderAll() {
  renderStats();
  renderMainList(currentList);
  renderFavorites();
  renderEmergency();
}

// Form Handlers
function resetForm() {
  elements.form.reset();
  elements.avatarPreview.src = '';
  elements.avatarPreview.classList.add('d-none');
  elements.avatarPlaceholder.classList.remove('d-none');

  // Remove validation classes
  [
    elements.fullName,
    elements.phoneNumber,
    elements.email,
    elements.address,
    elements.group,
    elements.notes,
  ].forEach(input => {
    input.classList.remove('is-valid', 'is-invalid');
  });

  isEditMode = false;
  editIndex = -1;
  oldImage = null;
}

function closeModal() {
  elements.modalCloseBtn.click();
}

function handleSearch() {
  const term = elements.search.value.toLowerCase().trim();

  if (term === '') {
    renderMainList(mainList);
    return;
  }

  const filtered = mainList.filter(
    contact =>
      contact.fullName.toLowerCase().includes(term) ||
      contact.phoneNumber.toLowerCase().includes(term) ||
      contact.address.toLowerCase().includes(term) ||
      contact.emailAddress.toLowerCase().includes(term)
  );

  renderMainList(filtered);
}

// Event Listeners
elements.form.addEventListener('submit', e => {
  e.preventDefault();

  const isValid = [
    validateField(elements.fullName),
    validateField(elements.phoneNumber),
    validateField(elements.email),
    validateField(elements.address),
    validateField(elements.group),
    validateField(elements.notes),
  ].every(Boolean);

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
    editContact();
  } else {
    addContact();
  }
});

elements.search.addEventListener('input', handleSearch);

elements.avatarPreview.addEventListener('click', () => {
  elements.avatarInput.click();
});

elements.avatarPlaceholder.addEventListener('click', () => {
  elements.avatarInput.click();
});

elements.avatarInput.addEventListener('change', () => {
  const file = elements.avatarInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    elements.avatarPreview.src = reader.result;
    elements.avatarPreview.classList.remove('d-none');
    elements.avatarPlaceholder.classList.add('d-none');
  };
  reader.readAsDataURL(file);
});

// Initialize
function init() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    mainList = JSON.parse(stored);
    currentList = mainList;
  }

  if (mainList.length === 0) {
    displayEmptyState();
  } else {
    renderAll();
  }
}

// Make functions global for onclick handlers
window.setupEdit = setupEdit;
window.deleteContact = deleteContact;
window.toggleFavorite = toggleFavorite;
window.toggleEmergency = toggleEmergency;

// Start the app
init();
