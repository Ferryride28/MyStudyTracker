// app.js

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const studentForm = document.getElementById('student-form');
    const studentsTableBody = document.getElementById('students-table-body');
    const studentNameInput = document.getElementById('student-name');
    const subjectSelect = document.getElementById('subject-select');
    const termSelect = document.getElementById('term-select');
    const assessmentSelect = document.getElementById('assessment-select');
    const studentMarkInput = document.getElementById('student-mark');
    
    // Define the structure and settings
    const subjects = ["Mathematics", "Science", "History"];
    const assessments = ["Weekly Quiz", "Monthly Assessment", "Midterm", "End of Term"];
    const terms = ["First Term", "Second Term", "Final Term"];

    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Function to calculate percentage and grade
    function calculateFinals(student) {
        let totalMarks = 0;
        let totalAssessments = 0;

        subjects.forEach(subjectName => {
            const subject = student.subjects[subjectName];
            if (subject) {
                terms.forEach(termName => {
                    const term = subject.marks[termName];
                    if (term) {
                        assessments.forEach(assessmentName => {
                            if (term[assessmentName] !== undefined) {
                                totalMarks += term[assessmentName];
                                totalAssessments++;
                            }
                        });
                    }
                });
            }
        });

        if (totalAssessments === 0) {
            return { percentage: 0, grade: 'N/A' };
        }

        const percentage = (totalMarks / (totalAssessments * 100)) * 100;
        let grade = 'N/A';

        if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'B';
        else if (percentage >= 70) grade = 'C';
        else if (percentage >= 60) grade = 'D';
        else grade = 'F';

        return { percentage: percentage.toFixed(2), grade };
    }

    // Function to render all students to the table
    function renderStudents() {
        studentsTableBody.innerHTML = '';
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            let studentDataHtml = `<td>${student.name}</td>`;
            
            subjects.forEach(subjectName => {
                terms.forEach(termName => {
                    assessments.forEach(assessmentName => {
                        const mark = student.subjects[subjectName]?.marks[termName]?.[assessmentName];
                        studentDataHtml += `<td>${mark !== undefined ? mark : '-'}</td>`;
                    });
                });
            });

            const { percentage, grade } = calculateFinals(student);
            
            studentDataHtml += `
                <td>${percentage}</td>
                <td>${grade}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            
            row.innerHTML = studentDataHtml;
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
        
        const name = studentNameInput.value.trim();
        const subject = subjectSelect.value;
        const term = termSelect.value;
        const assessment = assessmentSelect.value;
        const mark = parseInt(studentMarkInput.value);

        // Find existing student or create a new one
        let existingStudent = students.find(s => s.name === name);
        if (!existingStudent) {
            existingStudent = {
                name: name,
                subjects: {}
            };
            students.push(existingStudent);
        }

        // Initialize subject, term, and assessment objects if they don't exist
        if (!existingStudent.subjects[subject]) {
            existingStudent.subjects[subject] = { marks: {} };
        }
        if (!existingStudent.subjects[subject].marks[term]) {
            existingStudent.subjects[subject].marks[term] = {};
        }

        // Add/update the mark
        existingStudent.subjects[subject].marks[term][assessment] = mark;

        saveStudents();
        renderStudents();

        // Clear form fields
        studentNameInput.value = '';
        subjectSelect.value = '';
        termSelect.value = '';
        assessmentSelect.value = '';
        studentMarkInput.value = '';
    });

    // Handle button clicks (edit and delete)
    studentsTableBody.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');

        if (e.target.classList.contains('delete-btn')) {
            students.splice(index, 1);
            saveStudents();
            renderStudents();
        }

        if (e.target.classList.contains('edit-btn')) {
            const studentToEdit = students[index];
            studentNameInput.value = studentToEdit.name;
            // Note: For a real app, you would also populate the select menus
        }
    });

    // Add print and share buttons to the page
    const printButton = document.createElement('button');
    printButton.textContent = 'Print Report';
    printButton.onclick = () => window.print();
    printButton.style.cssText = 'padding: 10px; margin-right: 10px;';

    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share Report';
    shareButton.onclick = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Study Tracker Report',
                text: 'Check out this student report from my Study Tracker app.',
                url: window.location.href
            }).then(() => console.log('Share successful'))
            .catch(error => console.log('Error sharing:', error));
        } else {
            alert("Web Share API is not supported in this browser. Please copy the link manually.");
        }
    };
    shareButton.style.cssText = 'padding: 10px;';

    const reportButtonsContainer = document.createElement('div');
    reportButtonsContainer.style.cssText = 'text-align: center; margin: 20px;';
    reportButtonsContainer.appendChild(printButton);
    reportButtonsContainer.appendChild(shareButton);

    document.querySelector('main').appendChild(reportButtonsContainer);

    // Initial render
    renderStudents();
});
