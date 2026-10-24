import StudentForm from './StudentForm.jsx'
import StudentList from './StudentList.jsx'

function Main({ refreshKey, onStudentAdded }) {
  return (
    <main className="page-main">
      <div className="page-heading">
        <p className="page-heading__eyebrow">STUDENT RECORDS</p>
        <h2>Manage students</h2>
      </div>
      <div className="content-grid">
        <section className="panel" aria-labelledby="add-student-heading">
          <div className="panel__heading">
            <h3 id="add-student-heading">Add a student</h3>
            <p>Enter the student details below.</p>
          </div>
          <StudentForm onStudentAdded={onStudentAdded} />
        </section>
        <section className="panel" aria-labelledby="student-list-heading">
          <div className="panel__heading">
            <h3 id="student-list-heading">Student list</h3>
            <p>Records saved in the student database.</p>
          </div>
          <StudentList refreshKey={refreshKey} />
        </section>
      </div>
    </main>
  )
}

export default Main