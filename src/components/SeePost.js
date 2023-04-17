import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {Space, Popconfirm,Button,message} from 'antd';
import {DeleteOutlined} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import AddModal from './Modal';
function SeePost() {
  const [isLoading,setIsLoading] = useState(true)
  const token = sessionStorage.getItem('token');
  const userToken = JSON.parse(token)
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    postDetails()

  }, [])
  const[post,setPost] = useState([])
  const confirmDelete = () => {
    handleDelete(id)
    navigate("../posts")
    message.success('Post Deleted');
  };
  const handlePublish = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", userToken);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
    };
     const response = await fetch(`https://react-assignment-api.mallow-tech.com/api/posts/${id}/publish/${!post.is_published}`, requestOptions)
     if (response.ok)
    {
        message.success(post.is_published ? "Post Unublished!" : "Post Published")
        navigate("../posts")
    }

}
    
  const handleDelete = async (record) => {
    try {
      let idToDelete = record
      const response = await fetch ("https://react-assignment-api.mallow-tech.com/api/posts/" + idToDelete,{
        method:'DELETE',
        headers: {
          "Authorization":userToken
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  const cancelDelete = (e) => {
    message.error('Deleting Cancelled');
  };
  const postDetails = async() => {
    try {
      const response = await fetch ("https://react-assignment-api.mallow-tech.com/api/posts/"+id,{
        method:'GET',
        headers: {
          "Content-Type":'application/json',
          "Accept":'application/json',
          "Authorization":userToken
        }
      });
      if (response.ok) {
        const data = await response.json()
        setPost(data)      
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (isLoading)
  {
    return <h1 className='text-center-not-found'>Loading...</h1>
  }
  else
  {
    return (
      <div>
        <div className='nav-posts'>
          <Link to="../posts"><p className='go-back'>Back</p></Link>
          <div className='actions-posts'>
          <Space size="small" className='actions'>
                      <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined className="delete-button" style={{fontSize:21,color:'red',marginRight:20}}/>
                      </Popconfirm>
                      <AddModal isEditing={true} post={post}/>
                      <Button onClick={() => handlePublish(id)} id="publish-button" type='primary'>{post.is_published ? "Unpublish" : "Publish"}</Button>
                    </Space>
          </div>
        </div>
        <div className='image-section-posts'>
          <img src={post.image_url} className='image-posts' alt='blog-cover'/>
        </div>
        <div className='blog-title-posts-section'>
          <h1 className='blog-title-posts'>{post.name}</h1>
        </div>
        <div className='blog-content-posts-section'>
          <p className='blog-content-posts'>{post.content}</p>
        </div>
      </div>
    );
  }
  }

export default SeePost;
