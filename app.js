// app.js

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const studentForm = document.getElementById('student-form');
    const studentsTableBody = document.getElementById('students-table-body');
    const studentNameInput = document.getElementById('student-name');
    const studentGradeLevelSelect = document.getElementById('student-grade-level');
    const subjectSelect = document.getElementById('subject-select');
    const termSelect = document.getElementById('term-select');
    const assessmentSelect = document.getElementById('assessment-select');
    const studentMarkInput = document.getElementById('student-mark');
    const totalMarkInput = document.getElementById('total-mark'); // New element
    
    // Define the structure and settings
    const subjects = ["Mathematics", "Science", "History", "Urdu", "Arabic", "Islamic Studies", "Physics", "Chemistry", "Biology", "Computer Science"];
    const assessments = ["Weekly Quiz", "Monthly Assessment", "Midterm", "End of Term"];
    const terms = ["First Term", "Second Term", "Final Term"];

    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Function to calculate percentage and grade
    function calculateFinals(student) {
        let totalStudentMarks = 0;
        let totalPossibleMarks = 0;

        subjects.forEach(subjectName => {
            const subject = student.subjects[subjectName];
            if (subject) {
                terms.forEach(termName => {
                    const term = subject.marks[termName];
                    if (term) {
                        assessments.forEach(assessmentName => {
                            if (term[assessmentName] !== undefined) {
                                totalStudentMarks += term[assessmentName].mark;
                                totalPossibleMarks += term[assessmentName].total;
                            }
                        });
                    }
                });
            }
        });

        if (totalPossibleMarks === 0) {
            return { percentage: 0, grade: 'N/A' };
        }

        const percentage = (totalStudentMarks / totalPossibleMarks) * 100;
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
            let studentDataHtml = `<td>${student.name}</td><td>${student.gradeLevel}</td>`;
            
            subjects.forEach(subjectName => {
                terms.forEach(termName => {
                    assessments.forEach(assessmentName => {
                        const markData = student.subjects[subjectName]?.marks[termName]?.[assessmentName];
                        if (markData) {
                            studentDataHtml += `<td>${markData.mark}/${markData.total}</td>`;
                        } else {
                            studentDataHtml += `<td>-</td>`;
                        }
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
        const gradeLevel = studentGradeLevelSelect.value;
        const subject = subjectSelect.value;
        const term = termSelect.value;
        const assessment = assessmentSelect.value;
        const mark = parseInt(studentMarkInput.value);
        const total = parseInt(totalMarkInput.value); // New value

        // Find existing student or create a new one
        let existingStudent = students.find(s => s.name === name);
        if (!existingStudent) {
            existingStudent = {
                name: name,
                gradeLevel: gradeLevel,
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

        // Add/update the mark and total
        existingStudent.subjects[subject].marks[term][assessment] = {
            mark: mark,
            total: total
        };

        saveStudents();
        renderStudents();

        // Clear form fields
        studentNameInput.value = '';
        studentGradeLevelSelect.value = '';
        subjectSelect.value = '';
        termSelect.value = '';
        assessmentSelect.value = '';
        studentMarkInput.value = '';
        totalMarkInput.value = '';
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
            studentGradeLevelSelect.value = studentToEdit.gradeLevel;
            // Note: For a real app, you would also populate the other select menus
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
