import { Table,Space,Button, Popconfirm,message } from 'antd';
import {DeleteOutlined} from '@ant-design/icons'
import {SearchOutlined} from '@ant-design/icons'
import { Input } from 'antd';
import { useState,useEffect } from 'react';
import AddModal from './Modal';
import moment from 'moment'
import { Link } from 'react-router-dom';
const PostsTable = () => {
  const [query,setQuery] = useState(null)
  const [data, setData] = useState(null);
  const [isLoading,setIsLoading] = useState(true)
  const handlePublish = async (record) => {
    const userToken = JSON.parse(sessionStorage.getItem('token'));
    var myHeaders = new Headers();
    myHeaders.append("Authorization", userToken);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
    };
     const response = await fetch(`https://react-assignment-api.mallow-tech.com/api/posts/${record.id}/publish/${!record.is_published}`, requestOptions)
     if (response.ok)
    {
        message.success(record.is_published ? "Post Unublished!" : "Post Published")
        fetchData()
    }

}
    const confirmDelete = (record) => {
      handleDelete(record);
      message.success('Post Deleted');
    };
    const cancelDelete = (e) => {
      message.error('Deleting Cancelled');
    };
    const [defaultData, setDefaultData] = useState(null)
    const userToken = JSON.parse(sessionStorage.getItem('token'));
      const fetchData = async () => {
        try {
          const response = await fetch ("https://react-assignment-api.mallow-tech.com/api/posts",{
            method:'GET',
            headers: {
              "Authorization":userToken
            }
          });
          const jsonData = await response.json();
          setDefaultData(jsonData.data);
          handleSearch(query)
          setIsLoading(false)
        } catch (error) {
          console.error(error);
        }
      }
    useEffect(() => {
      fetchData();
      handleSearch();
  }, []);

  const handleDelete = async (record) => {
    try {
      let idToDelete = record.id
      const response = await fetch ("https://react-assignment-api.mallow-tech.com/api/posts/" + idToDelete,{
        method:'DELETE',
        headers: {
          "Authorization":userToken
        }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }


    const columns = [
        {
          title: 'Post name',
          dataIndex: 'name',
          key:'name',
          
          render: (_, record) => (
             <Link to={"/posts/" + record.id}><p>{record.name}</p></Link>
          ),
        },
        {
          title: 'Created at',
          dataIndex: 'created_at',
          sorter: {
            compare:  (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
            multiple: 3,
          },
          key:'created_at',
          render: (_, record) => (
            <Space size="small">
              <div className='created-cell'>
                <div style={{backgroundColor:record.is_published ? 'green' : 'red'}} className='circle'></div>
                {handleDate(record.created_at)}
              </div>
            </Space>
          ),
        },
        {
          title: 'Updated at',
          dataIndex: 'updated_at',
          key:'updated_at',
          sorter: {
            compare: (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
            multiple: 2,
          },
          render: (_,record) => (
            <>
              <p>{handleDate(record.updated_at)}</p>
            </>
          )
        },
        {
          title: '',
                key: 'action',
                render: (_, record) => (      
                  <Space size="small" className='actions'>
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      onConfirm={() => confirmDelete(record)}
                      onCancel={cancelDelete}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined className="delete-button" style={{fontSize:21,color:'red',marginRight:20}}/>
                    </Popconfirm>
                    <Button onClick={() => handlePublish(record)} id="publish-button" type='primary'>{record.is_published ? "Unpublish" : "Publish"}</Button>
                  </Space>
                ),
              },
      ];
      
const handleDate = (value) => {
    let localDate = value.slice(0, 10);
    let time = value.slice(11,18);
    let formattedDate = localDate + " " + time;
    return formattedDate
}

const handleSearch = (value) => {
  setQuery(value);
  if (value) {
    const filteredData = defaultData.filter((record) =>
      record.name.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  }
};
  if (isLoading)
  {
    return <h1 className='text-center-not-found'>Loading...</h1>
  }
  else
  {
    return (
      <div className='postsTable'>
        <div className="header">
              <p className="title">Posts</p>
              <div className="add-container">
                  <Input classname="search-input-posts" onChange={(e) => handleSearch(e.target.value)} placeholder="Search" suffix={<SearchOutlined/>} />
                  <AddModal isEditing={false} post={''} fetchData={fetchData}/>
              </div>
        </div>
      <Table columns={columns} dataSource={query ? data : defaultData} />;
      </div>
  )}
  }

export default PostsTable;