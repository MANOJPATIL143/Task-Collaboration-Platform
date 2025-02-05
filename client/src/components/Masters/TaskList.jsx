import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Select,
  Button,
  DatePicker,
  Card,
  Space,
  Typography,
  Flex,
  Input,
  Form,
  Tabs,
  Tooltip,
  Modal,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import TaskForm from "../forms/TaskListForm";
import TaskForm1 from "../forms/TaskForm1";
import usePostApi from "../../hooks/usePostApi";
import useAxios from "../../hooks/useAxios";
import io from "socket.io-client";

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;
const socket = io("http://localhost:5000");

const TaskList = () => {
  const { data, error, postData } = usePostApi("tasks/deleteTask");
  const TaskLists = useAxios();
  const userRequest = useAxios();

  const [tasks, setTasks] = useState([]);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterDueDate, setFilterDueDate] = useState(null);
  const [currentTask, setCurrentTask] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [action, setAction] = useState("entry");
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);

  const TasskLists = async () => {
    setLoading(true);
    try {
      const req = { status: "", priority: "", dueDate: "" };
      const res = await TaskLists.execute({
        url: "tasks/getTasks",
        method: "GET",
      });
      if (res) {
        setAction("entry");
        setTasks(res);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

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

  const DeleteTask = async (taskId) => {
    const res = await postData({
      id: taskId,
    });
    if (res) {
      console.log(res);
      message.success("Task deleted successfully!");
      setTimeout(() => {
        TasskLists();
      }, 500);
      socket.on("taskDeleted", (taskId) => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      });
    }
  };

  const confirmDelete = (taskId) => {
    // console.log(taskId);
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this task?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        await DeleteTask(taskId);
      },
    });
  };

  useEffect(() => {
    TasskLists();
  }, [data]);

  useEffect(() => {
    socket.on("taskDeleted", (deletedTaskId) => {
      console.log("Task deleted:", deletedTaskId);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== deletedTaskId)
      );
    });
    return () => {
      socket.off("taskDeleted");
    };
  }, [setTasks]);

  const showModal = (record) => {
    setCurrentTask(record);
    setActiveTabKey("2");
    setAction("update");
  };

  const handleCancel = () => {
    setCurrentTask([]);
    setActiveTabKey("1");
    setAction("entry");
  };

  const tabCHange = () => {
    setActiveTabKey("1");
    setAction("entry");
    setTimeout(() => {
      TasskLists();
    }, 500);
  };

  const statusColors = {
    "To Do": "blue",
    "In Progress": "orange",
    Done: "green",
  };

  const updateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: "10%",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag
          disabled
          color={
            priority === "High"
              ? "red"
              : priority === "Medium"
              ? "orange"
              : "green"
          }
        >
          {priority}
        </Tag>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (assignedTo, record) => {
        return assignedTo
          ? userLists.find((user) => user._id === assignedTo)?.name || "Unknown"
          : record.createdBy?.name || "Unassigned";
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Task">
            <Button onClick={() => showModal(record)}>
              <FaRegEdit size={15} />
            </Button>
          </Tooltip>

          <Tooltip title="Delete Team">
            <Button
              type="danger"
              size="small"
              onClick={() => confirmDelete(record._id)}
            >
              <DeleteOutlined size={15} />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const TabChange = (key) => {
    setAction("entry");
    console.log(key);
    if (key == "1") {
      setCurrentTask([]);
    }
    TasskLists();
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (filterStatus === "All" || task.status === filterStatus) &&
      (filterPriority === "All" || task.priority === filterPriority) &&
      (!filterDueDate || task.dueDate === filterDueDate.format("YYYY-MM-DD"))
    );
  });

  return (
    <Card style={{ margin: "20px auto", borderRadius: "10px" }}>
      <Title level={5} style={{ textAlign: "start", marginBottom: 0 }}>
        Task Management
      </Title>

      <Tabs
        activeKey={activeTabKey}
        onChange={(key) => {
          setActiveTabKey(key);
          TabChange(key);
        }}
        centered
      >
        <TabPane tab="Task Details" key="1">
          {/* Filters */}
          <Card
            style={{
              marginBottom: 0,
              borderRadius: "8px",
              background: "#f9f9f9",
              padding: "0px",
            }}
          >
            <Space gap="small" wrap="wrap" justify="center">
              <Select
                defaultValue="All"
                style={{ width: 150 }}
                onChange={setFilterStatus}
                placeholder="Filter by Status"
              >
                <Option value="All">All Status</Option>
                <Option value="To Do">To Do</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Done">Done</Option>
              </Select>

              <Select
                defaultValue="All"
                style={{ width: 150 }}
                onChange={setFilterPriority}
                placeholder="Filter by Priority"
              >
                <Option value="All">All Priority</Option>
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>

              <DatePicker
                style={{ width: 150 }}
                onChange={setFilterDueDate}
                placeholder="Filter by Due Date"
              />
            </Space>
          </Card>

          {/* Task Table */}
          <Table
            dataSource={filteredTasks}
            columns={columns}
            loading={loading}
            rowKey="id"
            bordered
            pagination={{ pageSize: 5 }}
            style={{ borderRadius: "8px", overflow: "hidden" }}
          />
        </TabPane>

        <TabPane tab="Add Task" key="2">
          {action == "update" ? (
            <TaskForm
              action={action}
              initialValues={currentTask}
              // onSubmit={handleSubmit}
              onCancel={handleCancel}
              tabCHange={tabCHange}
            />
          ) : (
            <TaskForm1
              handleCancel={handleCancel}
              setActiveTabKey={setActiveTabKey}
              onSubmit={TasskLists}
            />
          )}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TaskList;
