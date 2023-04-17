import { Button, Modal,Input,Divider,Form,Space,message,Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const { TextArea } = Input;
const AddModal = (isEditing,post,fetchData) => {
  const navigate = useNavigate()
  const editing = isEditing.isEditing
  const postDetails = isEditing.post
  const [formData, setFormData] = useState({
    name: '',
    content:  '',
    image: null
  });
  useEffect(() => {
      form.setFieldsValue({
        Title:editing ? postDetails.name : '',
        Content:editing ? postDetails.content : '',
    }); 
    if(isEditing){setFormData({
      name:postDetails.name,
      content:postDetails.content
    })}      
}, [postDetails]);
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    setFormData({
      ...formData,
      image: e.file
    });
  };

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    form.resetFields();
    if (formData.name && formData.image && formData.content)
    {
        setIsModalOpen(false);
        const { name, content, image } = formData;
        const formDataToSend = new FormData();
        formDataToSend.append('name', name);
        formDataToSend.append('content', content);
        formDataToSend.append('image', image);
        try {
          const token = JSON.parse(sessionStorage.getItem("token"))
          const response = await fetch('https://react-assignment-api.mallow-tech.com/api/posts', {
            method: 'POST',
            body: formDataToSend,
            headers: {
              "Authorization":token,
            }
          });
          if (response.ok) {
            message.success("Post Uploaded")
            isEditing.fetchData();
          } else {
            message.error('Upload failed');
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
  const handleUpdate = async () => {
    form.resetFields();
    if (formData.name && formData.image && formData.content)
    {
        setIsModalOpen(false);
        const { name, content, image } = formData;
        const formDataToSend = new FormData();
        formDataToSend.append('name', name);
        formDataToSend.append('content', content);
        formDataToSend.append('image', image);
        formDataToSend.append("_method", "patch");
        try {
          const token = JSON.parse(sessionStorage.getItem("token"))
          const response = await fetch(`https://react-assignment-api.mallow-tech.com/api/posts/${postDetails.id}`, {
            method: 'POST',
            body: formDataToSend,
            headers: {
              "Authorization":token,
            }
          });
          if (response.ok) {
            message.success("Post Updated")
            navigate("../posts")
            isEditing.fetchData();
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
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinishFailed = () => {
    message.error('Submit failed!');
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        {editing ? 'Edit' : 'Create'}
      </Button>
      <Modal style={{
          position:'absolute',
          right:0,
          bottom:0,
          top:0,
        }} okText="Add Post" title={editing ? "Update Post" : "Create Post"} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Divider className='create-post-divider'/>
          <Form
      form={form}
      layout="vertical"
      onFinish={editing ? handleUpdate : handleOk}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="Title"
        label="Blog Title"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder='Enter post name'  onChange={(e) => setFormData({
      ...formData,
      name: e.target.value
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
    <Form.Item
        name="Content"
        label="Content"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextArea
      showCount
      maxLength={100}
      style={{
        height: 120,
        resize: 'none',
      }}
      placeholder="Blog content"
      onChange={(e) => setFormData({
        ...formData,
        content: e.target.value
      })}
    />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            {editing ? "Update Post" : "Add Post"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
      </Modal>
    </>
  );
};
export default AddModal;