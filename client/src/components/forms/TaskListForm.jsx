import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Space, Row, Col,message } from "antd";
import useAxios from "../../hooks/useAxios";
import usePostApi from "../../hooks/usePostApi";

const { Option } = Select;

const TaskForm = ({ initialValues, onCancel, action, tabCHange }) => {
  // console.log(initialValues);

  const { data, error, postData } = usePostApi("tasks/updateTask");
  const userRequest = useAxios();
  const [form] = Form.useForm();
  const [userLists, setUserLists] = useState([]);
  const [localInitialValues, setLocalInitialValues] = useState(initialValues);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const users = await userRequest.execute({
        url: "users",
        method: "GET",
      });
      console.log("Users:", users);
      setUserLists(users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (initialValues && userLists.length > 0) {
      let updatedValues = { ...initialValues };
      if (
        updatedValues.assignedTo &&
        typeof updatedValues.assignedTo === "string"
      ) {
        const assignedUser = userLists.find(
          (user) => user._id === updatedValues.assignedTo
        );
        if (assignedUser) {
          updatedValues.assignedTo = {
            value: assignedUser._id,
            label: assignedUser.name || assignedUser._id,
          };
        }
      }
      // Update local state and form fields.
      setLocalInitialValues(updatedValues);
      form.setFieldsValue(updatedValues);
    }
  }, [initialValues, userLists, form]);

  // Handle form submission.
  const handleSubmit = (values) => {
    // const { title, description, dueDate, priority, status, assignedTo , id} = req.body;
    const res = postData({
      title: values.title,
      description: values.description,
      dueDate: values.dueDate,
      priority: values.priority,
      status: values.status,
      assignedTo: values.assignedTo.value,
      id: initialValues._id,
    });
    if (res) {
      console.log(res);
      message.success("Task updated successfully!");
      tabCHange();
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      // Use the local state to persist values
      initialValues={localInitialValues}
      style={{ borderRadius: "8px", background: "#f9f9f9", padding: 16 }}
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
            <Select
              placeholder="Select assignee"
              style={{ width: "100%" }}
              labelInValue
            >
              {userLists.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.name || user._id}
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
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Space style={{ width: "100%", justifyContent: "end" }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          {initialValues ? "Update Task" : "Add Task"}
        </Button>
      </Space>
    </Form>
  );
};

export default TaskForm;
