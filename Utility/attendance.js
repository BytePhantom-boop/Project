    const subjectsContainer = document.getElementById('subjectsContainer');
    const newSubjectInput = document.getElementById('newSubject');
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    let subjects = JSON.parse(localStorage.getItem('attendanceSubjects')) || {};

    function saveSubjects() {
      localStorage.setItem('attendanceSubjects', JSON.stringify(subjects));
    }
    function renderSubjects() {
      subjectsContainer.innerHTML = '';
      Object.keys(subjects).forEach(subject => {
        const data = subjects[subject];
        const wrapper = document.createElement('div');
        wrapper.className = 'subject';
        const header = document.createElement('div');
        header.className = 'subject-header';
        header.innerHTML = `<h3>${subject}</h3>`;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => {
          if (confirm(`Delete ${subject}?`)) {
            delete subjects[subject];
            saveSubjects();
            renderSubjects();
          }
        };
        header.appendChild(delBtn);
        wrapper.appendChild(header);
        const grid = document.createElement('div');
        grid.className = 'grid';
        data.forEach((status, i) => {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          if (status === 'attended') cell.classList.add('attended');
          if (status === 'missed') cell.classList.add('missed');
          cell.addEventListener('click', () => {
            if (!data[i]) data[i] = 'attended';
            else if (data[i] === 'attended') data[i] = 'missed';
            else data[i] = '';
            saveSubjects();
            renderSubjects();
          });
          grid.appendChild(cell);
        });
        wrapper.appendChild(grid);
        const summary = document.createElement('p');
        const total = data.length;
        const attended = data.filter(s => s === 'attended').length;
        const percent = total ? ((attended / total) * 100).toFixed(2) : 0;
        summary.textContent = `Attendance: ${attended}/${total} (${percent}%)`;
        wrapper.appendChild(summary);

        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add Class';
        addBtn.onclick = () => {
          data.push('');
          saveSubjects();
          renderSubjects();
        };
        wrapper.appendChild(addBtn);

        subjectsContainer.appendChild(wrapper);
      });
    }
    addSubjectBtn.addEventListener('click', () => {
      const name = newSubjectInput.value.trim();
      if (!name || subjects[name]) return;
      subjects[name] = [];
      saveSubjects();
      newSubjectInput.value = '';
      renderSubjects();
    });
    document.addEventListener('DOMContentLoaded', renderSubjects);
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
    //You can actually, double click on the grid to mark it absent instead of leaving it completely blank.