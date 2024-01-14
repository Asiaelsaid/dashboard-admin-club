import { Route, Routes } from 'react-router';
import './App.css';
import Layout from './layout/layout';
import Navbar from './pages/navbar';
import Activity from './pages/activity/activity';
import Game from './pages/game/game';
import Image from './pages/image/image';
import ImageContents from './pages/imageContents/imageContents';
import NewsType from './pages/newsType/newsType';
import Video from './pages/video/video';
import VideoContents from './pages/videoContent/videoContents';
import Login from './pages/login';


function App() {
  
  return (
    <>
    <Routes>
      <Route  path='/' element={<Login/>}/>
      <Route  path='navbar' element={<Layout children={<Navbar/>}/>}/>
      <Route  path='activity' element={<Layout children={<Activity/>}/>}/>
      <Route  path='game' element={<Layout children={<Game/>}/>}/>
      <Route  path='image' element={<Layout children={<Image/>}/>}/>
      <Route  path='imageContents' element={<Layout children={<ImageContents/>}/>}/>
      <Route  path='newsType' element={<Layout children={<NewsType/>}/>}/>
      <Route  path='video' element={<Layout children={<Video/>}/>}/>
      <Route  path='videoContents' element={<Layout children={<VideoContents/>}/>}/>
    </Routes>
   
    </>
  );
}

export default App;
