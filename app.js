// app.js

document.addEventListener('DOMContentLoaded', () => {
    // We'll update the form and table in Phase 2
    const studentForm = document.getElementById('student-form');
    const studentsTableBody = document.getElementById('students-table-body');
    
    // Define the subjects and assessments we want to track
    // This makes it easy to add more later
    const subjects = ["Mathematics", "Science", "History"];
    const assessments = ["Weekly Quiz", "Monthly Assessment", "Midterm", "End of Term"];
    const terms = ["First Term", "Second Term", "Final Term"];

    let students = JSON.parse(localStorage.getItem('students')) || [];

    // This function will now be much more complex
    function renderStudents() {
        studentsTableBody.innerHTML = '';
        students.forEach((student, index) => {
            let totalMarks = 0;
            let totalPossibleMarks = 0;

            const row = document.createElement('tr');
            let studentData = `<td>${student.name}</td>`;

            subjects.forEach(subject => {
                let subjectTotal = 0;
                let subjectCount = 0;
                
                terms.forEach(term => {
                    if (student.subjects[subject] && student.subjects[subject].marks[term]) {
                        assessments.forEach(assessment => {
                            if (student.subjects[subject].marks[term][assessment] !== undefined) {
                                const mark = student.subjects[subject].marks[term][assessment];
                                studentData += `<td>${mark}</td>`;
                                subjectTotal += mark;
                                subjectCount++;
                            } else {
                                studentData += `<td>-</td>`; // Display a dash if no mark exists
                            }
                        });
                    } else {
                        // Display dashes for all assessments if subject/term doesn't exist
                        studentData += `<td>-</td>`.repeat(assessments.length);
                    }
                });
            });

            // This is where we will calculate grade and percentage later
            const percentage = 'N/A';
            const grade = 'N/A';

            studentData += `<td>${percentage}</td><td>${grade}</td>`;
            studentData += `<td><button class="delete-btn" data-index="${index}">Delete</button></td>`;
            
            row.innerHTML = studentData;
            studentsTableBody.appendChild(row);
        });
    }

    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    studentForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        // This is a placeholder for now, we'll update it later
        const studentName = document.getElementById('student-name').value;
        const mark = document.getElementById('student-mark').value;

        // Create a new student with the new data structure
        const newStudent = {
            name: studentName,
            subjects: {
                "Mathematics": {
                    marks: {
                        "First Term": {
                            "Midterm": parseInt(mark) // For now, just a single mark
                        }
                    }
                }
            }
        };

        students.push(newStudent);
        saveStudents();
        renderStudents();

        document.getElementById('student-name').value = '';
        document.getElementById('student-mark').value = '';
    });

    studentsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            students.splice(index, 1);
            saveStudents();
            renderStudents();
        }
    });

    renderStudents();
});
