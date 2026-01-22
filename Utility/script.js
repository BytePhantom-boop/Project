document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (toggle) toggle.checked = true;
    }
    if (toggle) {
        toggle.addEventListener('change', function() {
            if (toggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});
