import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Recommendations from './pages/Recommendation';
import Restaurant from './pages/Restaurant';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import MyRestaurant from './pages/MyRestaurant';
import Login from './pages/Login';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import SignUp from './pages/Signup';
import { Toaster } from "react-hot-toast";
import Category from './pages/Category';

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();  

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (<div>loading...</div>)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/login' element={!authUser? <Login /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser? <SignUp /> : <Navigate to='/' />} />
        <Route path='/search' element={<Search />} />
        <Route path='/category' element={<Category />} />
        <Route path='/recommendation' element={<Recommendations />} />
        <Route path='/restaurant' element={<Restaurant />} />
        <Route path='/profile'>
          <Route index element={authUser? <Profile /> : <Navigate to='/login' />} />
          <Route path='inbox' element={authUser? <Inbox /> : <Navigate to='/login' />} />
          <Route path='restaurant' element={authUser? <MyRestaurant /> : <Navigate to='/login' />} />
        </Route>
      </Routes>

      <Toaster position="top-right"/>
    </BrowserRouter>
  )
}

export default App
