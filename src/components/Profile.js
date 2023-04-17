import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/images/emotarBread.webp'
import { Button,message,Form, Input,Upload } from 'antd';
import {InboxOutlined} from '@ant-design/icons'
const Profile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const [flipped, setFlipped] = useState(false);
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    image: null
  });
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    setFormData({
      ...formData,
      image: e.file
    });
  };
  const handleOk = async () => {
    form.resetFields();
    if (formData.first_name && formData.last_name && formData.image)
    {
        const { first_name, last_name, image } = formData;
        const formDataToSend = new FormData();
        formDataToSend.append('first_name', first_name);
        formDataToSend.append('last_name', last_name);
        formDataToSend.append('image', image,"file");
        formDataToSend.append("_method", "patch");
        try {
          const token = JSON.parse(sessionStorage.getItem("token"))
          const response = await fetch('https://react-assignment-api.mallow-tech.com/api/update/profile', {
            method: 'POST',
            body:formDataToSend,
            headers: {
              "Authorization":token,
            }
          })
          if (response.ok) {
            setFlipped(!flipped)
            const response = await fetch ("https://react-assignment-api.mallow-tech.com/api/validate-user",{
          method:'GET',
          headers: {
            "Content-Type":'application/json',
            "Accept":'application/json',
            "Authorization":token
          }
        });
        
        if (response.ok) {
            const data = await response.json()
            localStorage.setItem('user-info',JSON.stringify(data))
            message.success("Profile Updated, Please Login Again")
            navigate("/login")
        }
          } else {
            message.error('Update failed');
          }
        } catch (error) {
          console.error(error);
        }
    }
    else
    {
       message.warning("Please enter all the fields")
    }
  };
  const handleLogout = async () => {

    const token = sessionStorage.getItem("token")
    const userToken = JSON.parse(token)
    let result = await fetch ("https://react-assignment-api.mallow-tech.com/api/logout",{
      method:'DELETE',
      headers: {
        "Content-Type":'application/json',
        "Accept":'application/json',
        "Authorization":userToken
      }
    })
    if (result.ok)
    {
      message.success("Logout Successfull!!")
      result = await result.json()
      sessionStorage.clear();
      localStorage.clear();
      navigate("/login")
    }
    else {
      result = await result.json()
      if (result.error)
      {
        message.error(result.error)
      }
  }
  }
  return (
  <div className='profile-container'>
    <div className={`profile-details-section ${flipped ? 'flipped' : ''}`}>
      <div className='profile-details'>
        <h1 className='profile-container-title'>User Details</h1>
        <img className='profile-avatar' src={userInfo.profile_url ? userInfo.profile_url : avatar} alt='profile-avatar' />
        <p className='firstName'>
          <span className='boldTitle'>First Name:</span> {userInfo.first_name}
        </p>
        <p className='lastName'>
          <span className='boldTitle'>Last Name:</span> {userInfo.last_name}
        </p>
        <p className='email'>
          <span className='boldTitle'>User email:</span> {userInfo.email}
        </p>
        <Button onClick={handleFlip} className='flip_button' type='primary'>
          Edit
        </Button>
        <Button onClick={handleLogout} className='flip_button' type='primary'>
          Logout
        </Button>
      </div>
      <div className='profile-backside'>
      <Form
      layout="vertical"
      autoComplete="off"
      form={form}
    >
      <Form.Item
        name="First Name"
        label="First Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder='Enter first name' onChange={(e) => setFormData({
      ...formData,
      first_name: e.target.value
    })}/>
      </Form.Item>
      <Form.Item
        name="Last Name"
        label="Last Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder='Enter last name' onChange={(e) => setFormData({
      ...formData,
      last_name: e.target.value
    })}/>
      </Form.Item>
      <Form.Item label="Cover Image" rules={[
        {
          required: true,
        }
      ]}>
      <Form.Item name="Cover Image" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
        <Upload.Dragger  beforeUpload={() => false} type='image/jpeg' name="files">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Cover Image</p>
          <p className="ant-upload-hint">Image Format: .jpg .png</p>
        </Upload.Dragger>
      </Form.Item>
    </Form.Item>
      </Form>
        <Button onClick={handleOk} className='flip_button' type='primary'>
          Save
        </Button>
        <Button onClick={handleFlip} className='flip_button' htmlType='primary'>
          Cancel
        </Button>
      </div>
    </div>
  </div>
  )
}

export default Profile