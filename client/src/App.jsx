
import AdminLayout from '../layouts/Admin-layout'
import AdminContact from '../pages/Admin-contact'
import AdminContactTwo from '../pages/Admin-contact2'
// import Admin from '../pages/Admin'
import AdminUser from '../pages/Admin-user'
import Home from '../pages/Home'
import './App.css'
import ProtectedRoute from '../pages/Protected'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminPartner from '../pages/Admin-partner'

function App() {
  return (
    <>

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/admin' element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
          <Route path='users' element={<AdminUser />}></Route>
          <Route path='contact' element={<AdminContact />}></Route>
          <Route path='contact2' element={<AdminContactTwo />}></Route>
          <Route path='partner' element={<AdminPartner />}></Route>

        </Route>
      </Routes>

    </>
  )
}

export default App
