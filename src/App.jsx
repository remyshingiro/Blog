import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import { useState } from "react";
import {v4 as uuidv4} from "uuid";


function App() {
  //fn to add new post to the posts array and updates it
  function addPost(post){
    // we used previous post to keep up with the latest state
   setPosts((prevPosts)=> [...prevPosts, post]);
  }
  
  const [posts, setPosts] = useState(
   ()=>{
    let savedPosts = localStorage.getItem('all_posts')
     
    return savedPosts ? JSON.parse(savedPosts) : []
   }
  )
   




  return (
    <BrowserRouter>
      {/* Navbar stays on all pages */}
      <Navbar />

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create" element={<CreatePost addPost={addPost}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;