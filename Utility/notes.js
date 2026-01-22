function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('card');
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="editNote(${index})">Edit</button>
            <button onclick="deleteNote(${index})">Delete</button>
        `;
        notesContainer.appendChild(noteDiv);
    });
}

function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function editNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const newTitle = prompt('Edit title:', notes[index].title);
    if (newTitle === null) return;
    const newContent = prompt('Edit content:', notes[index].content);
    if (newContent === null) return;
    notes[index].title = newTitle;
    notes[index].content = newContent;
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

document.getElementById('addNoteBtn').addEventListener('click', function() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) {
        alert('Please enter title and content.');
        return;
    }
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({ title: title, content: content });
    localStorage.setItem('notes', JSON.stringify(notes));
    titleInput.value = '';
    contentInput.value = '';
    renderNotes();
});

document.addEventListener('DOMContentLoaded', renderNotes);
