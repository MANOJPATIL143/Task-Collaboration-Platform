import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useFormData from "../../hooks/useFormData";


const UpdateUserModal = ({ visible, onClose, data }) => {
  const { datas, loadings, error, postData } = useFormData("users/updateuser");
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
console.log(data);

useEffect(() => {
  if (data) {
    form.setFieldsValue({
      name: data.name,
      email: data.email,
      mobileno: data.mobileno,
      profileImage: data.profileImage
    });

    // Set profile image preview if available
    if (data.profileImage) {
      setPreviewImage(data.profileImage);
      form.setFieldsValue({
        profileImage: previewImage,
      });
    }
  }
}, [data, form]);


  const handleFileChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (!file) return;
    setFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("mobileno", values.mobileno);
      if (file) formData.append("profileImage", file);
      const response = await postData(formData, { "Content-Type": "multipart/form-data" });
      if (response) {
        console.log("User updated successfully:", response);
        message.success("User updated successfully!");
      }  
      console.log("User updated:", response.data);
      setLoading(false);
      onClose(); 
    } catch (error) {
      console.error("Error updating user:", error);
      setLoading(false);
    }
  };
  
  

  return (
    <Modal
      title="Update User"
      visible={visible}
      onCancel={onClose}
      footer={null}
      maskClosable={false} 
    >
      <Form form={form} onFinish={handleUpdateUser} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item label="Mobile Number" name="mobileno" rules={[{ required: true }]}>
          <Input placeholder="Enter mobile number" />
        </Form.Item>

        <Form.Item label="Profile Image">
          <Upload
            listType="picture-card"
            accept="image/*"
            name="profileImage"
            maxCount={1}
            showUploadList={false}
            beforeUpload={() => false} 
            onChange={handleFileChange}
          >
            {previewImage ? (
              <img src={previewImage} alt="Preview" style={{ width: "70%" }} />
            ) : (
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
