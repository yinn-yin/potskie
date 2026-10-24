import { useEffect, useState } from 'react'

function StudentList({ refreshKey }) {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', course: '', age: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let isCurrent = true

    fetch('/api/students')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load students.')
        }

        return response.json()
      })
      .then((records) => {
        if (isCurrent) {
          setStudents(records)
          setError('')
        }
      })
      .catch(() => {
        if (isCurrent) {
          setError('Could not load students. Check that the backend is running.')
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [refreshKey])

  function startEditing(student) {
    setEditingId(student.id)
    setEditForm({ name: student.name, course: student.course, age: String(student.age) })
    setActionError('')
  }

  async function saveStudent(event, id) {
    event.preventDefault()
    const age = Number(editForm.age)

    if (!editForm.name.trim() || !editForm.course.trim() || !Number.isInteger(age) || age < 1) {
      setActionError('Enter a name, course, and valid age.')
      return
    }

    setIsSaving(true)
    setActionError('')

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          course: editForm.course.trim(),
          age,
        }),
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'Could not update the student.')
      }

      setStudents((currentStudents) => currentStudents.map((student) => (
        student.id === id ? result : student
      )))
      setEditingId(null)
    } catch (saveError) {
      setActionError(saveError.message || 'Could not update the student.')
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteStudent(id) {
    if (!window.confirm('Delete this student?')) {
      return
    }

    setDeletingId(id)
    setActionError('')

    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' })
      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'Could not delete the student.')
      }

      setStudents((currentStudents) => currentStudents.filter((student) => student.id !== id))
    } catch (deleteError) {
      setActionError(deleteError.message || 'Could not delete the student.')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <p className="table-state" role="status">Loading students...</p>
  }

  if (error) {
    return <p className="table-state table-state--error" role="alert">{error}</p>
  }

  return (
    <div className="table-wrap">
      {actionError && <p className="table-state table-state--error" role="alert">{actionError}</p>}
      <table className="student-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Student</th>
            <th scope="col">Course</th>
            <th scope="col">Age</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              {editingId === student.id ? (
                <>
                  <td><input aria-label="Student name" value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} /></td>
                  <td><input aria-label="Course" value={editForm.course} onChange={(event) => setEditForm({ ...editForm, course: event.target.value })} /></td>
                  <td><input aria-label="Age" type="number" min="1" step="1" value={editForm.age} onChange={(event) => setEditForm({ ...editForm, age: event.target.value })} /></td>
                  <td className="student-actions">
                    <button type="button" className="table-action" onClick={(event) => saveStudent(event, student.id)} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" className="table-action table-action--muted" onClick={() => setEditingId(null)} disabled={isSaving}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{student.age}</td>
                  <td className="student-actions">
                    <button type="button" className="table-action" onClick={() => startEditing(student)}>Edit</button>
                    <button type="button" className="table-action table-action--danger" onClick={() => deleteStudent(student.id)} disabled={deletingId === student.id}>
                      {deletingId === student.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </>
              )}
            </tr>
          )) : (
            <tr>
              <td className="table-state" colSpan="5">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default StudentList