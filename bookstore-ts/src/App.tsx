import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router'
import { AppShell } from '@mantine/core'
import { AuthProvider } from './components/context/AuthContext'
import PrivateRoute from './components/misc/PrivateRoute'
import Navbar from './components/misc/Navbar'
import Home from './components/home/Home'
import Login from './components/home/Login'
import Signup from './components/home/Signup'
import BooksPage from './components/books/BooksPage'
import AdminPage from './components/admin/AdminPage'
import UserOrdersPage from './components/orders/UserOrdersPage.tsx'
import CartPage from './components/cart/CartPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell header={{ height: 60 }} padding='md'>
          <Navbar />
          <AppShell.Main>
            <Routes>

              <Route path='/' element={<Home />} />

              <Route path='/login' element={<Login />} />

              <Route path='/signup' element={<Signup />} />

                <Route path='/bookspage' element={<BooksPage />} />

                <Route path='/adminpage/:tabValue' element={<PrivateRoute><AdminPage /></PrivateRoute>} />
                <Route path='/adminpage' element={<Navigate to='/adminpage/users' />} />

                <Route path='/orderspage' element={<PrivateRoute><UserOrdersPage /></PrivateRoute>} />

                <Route path='/cartpage' element={<PrivateRoute><CartPage /></PrivateRoute>} />

                <Route path='*' element={<Navigate to='/' />} />

            </Routes>
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </AuthProvider>
  )
}
