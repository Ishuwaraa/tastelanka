import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Recommendations from './pages/Recommendation';
import Restaurant from './pages/Restaurant';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import MyRestaurant from './pages/MyRestaurant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path='/recommendation' element={<Recommendations />} />
        <Route path='/restaurant' element={<Restaurant />} />
        <Route path='/profile'>
          <Route index element={<Profile />} />
          <Route path='inbox' element={<Inbox />} />
          <Route path='restaurant' element={<MyRestaurant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
