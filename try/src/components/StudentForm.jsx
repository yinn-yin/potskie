import { useState } from 'react'

const emptyForm = { name: '', course: '', age: '' }

function StudentForm({ onStudentAdded }) {
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const age = Number(form.age)

    if (!form.name.trim() || !form.course.trim() || !Number.isInteger(age) || age < 1) {
      setMessage({ type: 'error', text: 'Enter a name, course, and valid age.' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          course: form.course.trim(),
          age,
        }),
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'Could not add the student.')
      }

      setForm(emptyForm)
      setMessage({ type: 'success', text: 'Student added successfully.' })
      onStudentAdded()
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Could not add the student.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <label className="form-field">
        Student Name
        <input
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </label>
      <label className="form-field">
        Course
        <input
          name="course"
          type="text"
          value={form.course}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </label>
      <label className="form-field">
        Age
        <input
          name="age"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          value={form.age}
          onChange={handleChange}
          required
        />
      </label>
      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding student...' : 'Add Student'}
      </button>
      {message && (
        <p className={`form-message form-message--${message.type}`} role="status">
          {message.text}
        </p>
      )}
    </form>
  )
}

export default StudentForm