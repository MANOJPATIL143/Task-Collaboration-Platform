import React, { useEffect, useState } from "react";
import { Form, DatePicker, Input, Select, Button, Space, Row, Col, message } from "antd";
import moment from "moment";
import usePostApi from "../../hooks/usePostApi";
import useAxios from "../../hooks/useAxios";

const { Option } = Select;

const TaskForm = ({setActiveTabKey, onSubmit}) => {
  const { data, loading, error, postData } = usePostApi("tasks/createTask");
  const userList =  useAxios();
  const [form] = Form.useForm();
  const [userLists, setUserList] = useState([]);

  const UserList = async () => {
    try {
      const users = await userList.execute({
        url: 'users',
        method: 'GET'
      });
      console.log('Users:', users);
      setUserList(users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }

  useEffect(() => {
    UserList();
  }, []);

  const handleSubmit = (values) => {
    const res = postData(values);
    if (res) {
      console.log(res);
      message.success("Task created successfully!");
      setActiveTabKey("1");
      setTimeout(() => {
        onSubmit();
      }, 500);
    }
    console.log(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ borderRadius: "8px", background: "#f9f9f9" }}
    >
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: "Please enter a task title!" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter a task description!" },
            ]}
          >
            <Input.TextArea rows={1} placeholder="Enter task description" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please select a priority!" }]}
          >
            <Select placeholder="Select priority" style={{ width: "100%" }}>
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            name="assignedTo"
            label="Assigned To"
            rules={[{ required: true, message: "Please select an assignee!" }]}
            
          >
            <Select placeholder="Select assignee" style={{ width: "100%" }}>
              {userLists.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              { required: true, message: "Please select the task status!" },
            ]}
          >
            <Select placeholder="Select status" style={{ width: "100%" }}>
              <Option value="To Do">To Do</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Done">Done</Option>
              {/* enum: ['To Do', 'In Progress', 'Done'], */}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Please select a due date!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) => {
                // Disable all dates before today
                return current && current < moment().startOf("day");
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Space style={{ width: "100%", justifyContent: "end" }}>
        {/* <Button onClick={onCancel}>Cancel</Button> */}
        <Button type="primary" htmlType="submit">
          Add Task
        </Button>
      </Space>
    </Form>
  );
};

export default TaskForm;
