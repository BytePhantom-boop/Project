    const cgpaKey = 'cgpaSubjects';
    function saveSubjectsToStorage(subjects) {
      localStorage.setItem(cgpaKey, JSON.stringify(subjects));
    }
    function loadSubjectsFromStorage() {
      const data = localStorage.getItem(cgpaKey);
      return data ? JSON.parse(data) : [];
    }
    function populateForm(subjects) {
      const form = document.getElementById('cgpaForm');
      form.innerHTML = '';
      subjects.forEach((subj, i) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <h3>Subject ${i + 1}</h3>
          <label>Subject Name:
            <input type="text" class="subject-name" value="${subj.name || ''}" />
          </label>
          <label>Credits:
            <input type="number" class="credit" min="0" value="${subj.credit}" />
          </label>
          <label>Grade:
            <select class="grade">
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B">B</option>
              <option value="B-">B-</option>
              <option value="C">C</option>
              <option value="C-">C-</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
            </select>
          </label>
        `;
        div.querySelector('.grade').value = subj.grade;
        form.appendChild(div);
      });
    }
    document.getElementById('generateBtn').addEventListener('click', function () {
      const num = parseInt(document.getElementById('numSubjects').value);
      if (isNaN(num) || num < 1) {
        alert('Please enter a valid number of subjects.');
        return;
      }
      const subjects = Array.from({ length: num }, () => ({ name: '', credit: 0, grade: 'A' }));
      saveSubjectsToStorage(subjects);
      populateForm(subjects);
    });
    document.getElementById('calculateBtn').addEventListener('click', function () {
      const names = document.getElementsByClassName('subject-name');
      const credits = document.getElementsByClassName('credit');
      const grades = document.getElementsByClassName('grade');

      const subjects = [];
      let totalCredits = 0;
      let totalPoints = 0;

      const gradePoints = {
        'A': 10, 'A-': 9, 'B': 8, 'B-': 7, 'C': 6, 'C-': 5, 'D': 4, 'E': 2, 'F': 0,
      };
      for (let i = 0; i < credits.length; i++) {
        const name = names[i].value.trim();
        const creditVal = parseFloat(credits[i].value);
        const gradeVal = grades[i].value;
        if (!isNaN(creditVal) && creditVal > 0) {
          totalCredits += creditVal;
          totalPoints += creditVal * gradePoints[gradeVal];
        }
        subjects.push({ name, credit: creditVal || 0, grade: gradeVal });
      }
      saveSubjectsToStorage(subjects);
      const result = document.getElementById('result');
      if (totalCredits === 0) {
        result.textContent = 'Please enter valid credits.';
      } else {
        const cgpa = (totalPoints / totalCredits).toFixed(2);
        result.textContent = 'CGPA: ' + cgpa;
      }
    });
    window.addEventListener('DOMContentLoaded', () => {
      const savedSubjects = loadSubjectsFromStorage();
      if (savedSubjects.length > 0) {
        document.getElementById('numSubjects').value = savedSubjects.length;
        populateForm(savedSubjects);
      }
    });
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
if (localStorage.getItem('theme') === 'dark') {
body.classList.add('dark-mode');
themeToggle.checked = true;
}
themeToggle.addEventListener('change', () => {
if (themeToggle.checked) {
body.classList.add('dark-mode');
localStorage.setItem('theme', 'dark');
} else {
body.classList.remove('dark-mode');
localStorage.setItem('theme', 'light');
}
});