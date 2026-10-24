import { useState } from 'react'
import './App.css'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Main from './components/Main.jsx'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="app-shell">
      <Header />
      <Main
        refreshKey={refreshKey}
        onStudentAdded={() => setRefreshKey((currentKey) => currentKey + 1)}
      />
      <Footer />
    </div>
  )
}

export default App
