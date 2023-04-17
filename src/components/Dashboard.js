import React,{useState} from 'react'
import { useEffect } from 'react';
const Dashboard = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)'); // Change the breakpoint to match your desired screen size
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);
  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const userToken = JSON.parse(sessionStorage.getItem('token'));
  const [publishedData, setPublishedData] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const [showRecentBlogs,setShowRecentBlogs] = useState(true)
  const toggleRecentBlogs = () => {
    if(isMobile)
    {
      setShowRecentBlogs(!showRecentBlogs)
    }
  }
  const displayStyle = showRecentBlogs && isMobile ? 'none' : 'block';
  const [showThisPost,setShowThisPost] = useState({
    id:null,
    name:'',
    content:'',
    image_url:'',
    updated_at:''
  })

  const handleDate = (date) => {
    function getMonthName(monthNumber) {
      const date = new Date();
      date.setMonth(monthNumber - 1);
      return date.toLocaleString('en-US', { month: 'short' });
    }
      const splittedDate = date.split('-')
      let day = splittedDate[2].split('T')[0]
      let month = getMonthName(splittedDate[1]).toLowerCase();
      let year = splittedDate[0]
      const dateNew = new Date(`${day}-${month}-${year}`);
      const finalDate = dateNew.toLocaleDateString('en-IN',{
        year:'2-digit',
        month:'short',
        day:'2-digit'
      }).toLowerCase();
      return finalDate
  }
  const fetchData = async () => {
    try {
      const response = await fetch ("https://react-assignment-api.mallow-tech.com/api/posts",{
        method:'GET',
        headers: {
          "Authorization":userToken
        }
      });
      const jsonData = await response.json();
      const allPosts = jsonData.data;
      const publishedPosts = allPosts.filter(post => post.is_published===true)
      setPublishedData(publishedPosts)
      setShowThisPost(publishedPosts[0])
      setIsLoading(false)
      console.log(showThisPost)
    } catch (error) {
      console.error(error);
    }
  }
useEffect(() => {
  fetchData();
}, []);

if (publishedData.length>0)
{
  return (
    <div className='dashboard-section'>
      <aside style={{display: showRecentBlogs ? 'block' : 'none'}} className='side-menu-dashboard'>
        <div className='toggle-recent-blogs' onClick={toggleRecentBlogs}>&lt;</div>
        <div className='recent-blogs-dashboard'>
          <h3 className='dashboard-heading'>Recent blogs</h3>
          {
            publishedData.map((posts) => {
              let finalDate = handleDate(posts.updated_at)
              return (
                <div className={'post-list-section'} style={{backgroundColor:showThisPost.id===posts.id ? '#f0faff' : ''}} onClick={() => setShowThisPost({name:posts.name,id:posts.id,content:posts.content,image_url:posts.image_url,updated_at:posts.updated_at})}>
                  <div className='user-profile'>
                    <img className='dashboard-dp' src={userInfo.profile_url} alt="profile-display"/>
                  </div>
                  <div className='post-title-author-container' onClick={toggleRecentBlogs}>
                    <p className='post-list-title-dashboard'>{posts.name}</p>
                    <p className='post-list-author-dashboard'>- {userInfo.first_name + " " + userInfo.last_name},{finalDate}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </aside>
      <div className='post-details-section' style={{ display: displayStyle }}>
      <div className='toggle-recent-blogs-inside' style={{display:showRecentBlogs ? 'none' : 'block'}} onClick={toggleRecentBlogs}>&gt;</div>
        <h1 className='show-post-title'>{showThisPost.name}</h1>
        <div className='user-details'>
          <div className='user-profile-showpost'>
            <img className='dashboard-dp circle-img' src={userInfo.profile_url} alt="profile-display"/>
          </div>
          <div className='post-title-author-container'>
            <p className='post-list-author-dashboard'>- {userInfo.first_name + " " + userInfo.last_name},</p>
            <p className='post-list-author-dashboard'>{handleDate(showThisPost.updated_at)}</p>
          </div>
        </div>
        <div className='show-post-content-container'>
          <p className='show-post-content'>{showThisPost.content}</p>
        </div>
      </div>
    </div>
)
}

else
  {
    return isLoading ? <h1 className='text-center-not-found'>Loading...</h1> :  <h1 className='text-center-not-found'>No posts published by user!</h1> 
  }

}

export default Dashboard