function renderExams() {
    const examList = document.getElementById('examList');
    examList.innerHTML = '';
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    exams.forEach((exam, index) => {
        const examDiv = document.createElement('div');
        examDiv.classList.add('card');
        const examDate = new Date(exam.date);
        const now = new Date();
        let diffTime = examDate - now;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) diffDays = 0;
        examDiv.innerHTML = `
            <h3>${exam.name}</h3>
            <p>${exam.date} - ${diffDays} days left</p>
            <button onclick="deleteExam(${index})">Delete</button>
        `;
        examList.appendChild(examDiv);
    });
}

function deleteExam(index) {
    let exams = JSON.parse(localStorage.getItem('exams')) || [];
    exams.splice(index, 1);
    localStorage.setItem('exams', JSON.stringify(exams));
    renderExams();
}

document.getElementById('addExamBtn').addEventListener('click', function() {
    const nameInput = document.getElementById('examName');
    const dateInput = document.getElementById('examDate');
    const name = nameInput.value.trim();
    const date = dateInput.value;
    if (!name || !date) {
        alert('Please enter both name and date.');
        return;
    }
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    exams.push({ name: name, date: date });
    localStorage.setItem('exams', JSON.stringify(exams));
    nameInput.value = '';
    dateInput.value = '';
    renderExams();
});

document.addEventListener('DOMContentLoaded', renderExams);
