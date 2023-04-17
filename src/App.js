import './index.css'
import Profile from './components/Profile';
import PostsTable from './components/Table';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Error from './components/Error';
import Login from './components/Login';
import SeePost from './components/SeePost';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import ProtectedRoutes from './components/ProtectedRoutes';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path="*" element={<Error/>}/>
        <Route element={<ProtectedRoutes/>}>
          <Route path='/' element={<Header/>}>
            <Route index element={<PostsTable/>}/>
            <Route index path='profile' element={<Profile/>}/>
            <Route path='posts' element={<PostsTable/>}/>
            <Route path='dashboard' element={<Dashboard/>}/>
          </Route>
          <Route path="/posts/:id" element={<SeePost />} />
        </Route>
    </Routes>
    </BrowserRouter>
      
  );
}

export default App;
