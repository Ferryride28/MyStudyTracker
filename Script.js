document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('student-form');
    const studentsTableBody = document.getElementById('students-table-body');
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Function to render students from local storage to the table
    function renderStudents() {
        studentsTableBody.innerHTML = '';
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.mark}</td>
                <td><button class="delete-btn" data-index="${index}">Delete</button></td>
            `;
            studentsTableBody.appendChild(row);
        });
    }

    // Function to save students to local storage
    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Handle form submission
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentNameInput = document.getElementById('student-name');
        const studentMarkInput = document.getElementById('student-mark');

        const newStudent = {
            name: studentNameInput.value,
            mark: studentMarkInput.value
        };

        students.push(newStudent);
        saveStudents();
        renderStudents();

        // Clear the form
        studentNameInput.value = '';
        studentMarkInput.value = '';
    });

    // Handle delete button clicks
    studentsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            students.splice(index, 1);
            saveStudents();
            renderStudents();
        }
    });

    // Initial render
    renderStudents();
});
