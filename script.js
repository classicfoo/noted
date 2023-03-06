// Get elements from the DOM
const addNoteBtn = document.getElementById('addNoteBtn');
const noteList = document.getElementById('noteList');
const modal = document.getElementById('modal');
const noteInput = document.getElementById('noteInput');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const closeBtn = document.getElementsByClassName('close')[0];
const editModal = document.getElementById('editModal');
const editNoteInput = document.getElementById('editNoteInput');
const updateNoteBtn = document.getElementById('updateNoteBtn');
const searchInput = document.getElementById('searchInput');
let editedNoteId = '';

// Add event listeners
addNoteBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);
saveNoteBtn.addEventListener('click', saveNote);
updateNoteBtn.addEventListener('click', updateNote);
searchInput.addEventListener('input', filterNotes);


// Get notes from local storage or create empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Display notes in the note list
displayNotes();

// Open the modal when the Add Note button is clicked
function openModal() {
  modal.style.display = 'block';
  noteInput.value = '';
  editedNoteId = '';
}

// Close the modal when the X button is clicked
function closeModal() {
  modal.style.display = 'none';
  editModal.style.display = 'none';
}

// Close the modal when user clicks outside of it
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  } else if (e.target == editModal) {
    editModal.style.display = 'none';
  }
}

// Save a note to local storage
function saveNote() {
  const noteText = noteInput.value.trim();
  if (noteText !== '') {
    const note = {
      id: Date.now(),
      text: noteText,
      timestamp: new Date().toLocaleString()
    };
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
    closeModal();
    noteInput.value = '';
  }
}

function filterNotes() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filteredNotes = notes.filter(note => note.text.toLowerCase().includes(searchTerm));
  displayNotes(filteredNotes);
}

// Display notes in the note list
function displayNotes(notesToShow = notes) {
  noteList.innerHTML = '';
  if (notesToShow.length > 0) {
    notesToShow.forEach(note => {
      const noteDiv = document.createElement('div');
      noteDiv.classList.add('note');
      noteDiv.innerHTML = `
        <p>${note.text}</p>
        <div class="timestamp hidden">${note.timestamp}</div>
        <div class="actions">
          <button class="edit-btn" data-id="${note.id}">Edit</button>
          <button class="delete-btn" data-id="${note.id}">Delete</button>
        </div>
      `;
      noteList.appendChild(noteDiv);
    });
    addNoteListeners();
  } else {
    const noNotesDiv = document.createElement('div');
    noNotesDiv.innerHTML = 'No notes found';
    noteList.appendChild(noNotesDiv);
  }
}

// Add event listeners to edit and delete buttons on notes
function addNoteListeners() {
  const editBtns = document.querySelectorAll('.edit-btn');
  const deleteBtns = document.querySelectorAll('.delete-btn');
  editBtns.forEach(btn => {
    btn.addEventListener('click', openEditModal);
  });
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', deleteNote);
  });
}

// Open the edit modal when the Edit button is clicked
function openEditModal(e) {
  editedNoteId = e.target.dataset.id;
  const note = notes.find(note => note.id == editedNoteId);
  editNoteInput.value = note.text;
  editModal.style.display = 'block';
}

// Update a note in local storage
function updateNote() {
  const updatedNoteText = editNoteInput.value.trim();
  if (updatedNoteText !== '') {
    const noteIndex = notes.findIndex(note => note.id == editedNoteId);
    notes[noteIndex].text = updatedNoteText;
    notes[noteIndex].timestamp = new Date().toLocaleString();
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
    closeModal();
    editNoteInput.value = '';
    editedNoteId = '';
  }
}

// Input field value
const updatedNoteText = editNoteInput.value.trim();
if (updatedNoteText !== '') {
// Find note by id and update text
const noteIndex = notes.findIndex(note => note.id == editedNoteId);
notes[noteIndex].text = updatedNoteText;
notes[noteIndex].timestamp = new Date().toLocaleString();
localStorage.setItem('notes', JSON.stringify(notes));
displayNotes();
closeModal();
editNoteInput.value = '';
editedNoteId = '';
}


// Delete a note from local storage
function deleteNote(e) {
const noteId = e.target.dataset.id;
notes = notes.filter(note => note.id != noteId);
localStorage.setItem('notes', JSON.stringify(notes));
displayNotes();
}

