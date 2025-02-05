import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Card,
  Typography,
  Space,
  Button,
  Modal,
  Input,
  Select,
  message,
  Tooltip,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserAddOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { MdAssignmentAdd } from "react-icons/md";
import usePostApi from "../../hooks/usePostApi";
import useAxios from "../../hooks/useAxios";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const TeamList = () => {
  const { data, error, postData } = usePostApi("team/create");
  const {
    data: data2,
    loading: loading2,
    error: error2,
    postData: postData2,
  } = usePostApi("/team/add-member");
  const TeamLists = useAxios();

  const [teams, setTeams] = useState([]);
  const userRequest = useAxios();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [task, setTask] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Sselectedteams, setSelectedteams] = useState([]);

  const TeamList = async () => {
    setLoading(true);
    try {
      const req = { status: "", priority: "", dueDate: "" };
      const res = await TeamLists.execute({
        url: "team",
        method: "GET",
      });
      console.log("team:", res);
      setTeams(res);
      setLoading(false);
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
      // console.log("Users:", users);
      setUserLists(users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    TeamList();
    fetchUsers();
  }, []);

  const showAddTeamModal = () => {
    setIsModalVisible(true);
  };

  const showInviteUserModal = (record) => {
    setIsInviteModalVisible(true);
    setSelectedteams(record._id);
    console.log(record);
  };

  // Handle Adding a New Team
  const handleAddTeam = () => {
    if (!newTeamName || selectedMembers.length === 0) {
      message.error("Please enter a team name and select members.");
      return;
    }
    const res = postData({
      name: newTeamName,
      memberIds: selectedMembers,
    });
    if (res) {
      setSelectedMembers([]);
      setNewTeamName("");
      setIsModalVisible(false);
      message.success("Team added successfully!");
      TeamList();
    }
  };

  // Delete a Team
  const handleDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this team?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setTeams(teams.filter((team) => team.id !== id));
        message.success("Team deleted successfully!");
      },
    });
  };

  // Show Assign Task Modal
  const showAssignTaskModal = () => {
    setIsTaskModalVisible(true);
  };
console.log(selectedMembers);

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      message.error("Please enter a valid email.");
      return;
    }
    const res = await postData2({
      teamId: Sselectedteams,
      userId: selectedMembers,
      email: inviteEmail,
    });
    if (res) {
      message.success(
        `Invitation sent to ${inviteEmail} to join ${selectedTeam}!`
      );
      setIsInviteModalVisible(false);
      setInviteEmail(""); // Reset email input
    }
  };

  // Handle Assigning Task
  const handleAssignTask = () => {
    if (!selectedTeam || !selectedUser || !task) {
      message.error("Please select a team, user, and enter a task.");
      return;
    }

    message.success(
      `Task "${task}" assigned to ${selectedUser} in ${selectedTeam}.`
    );
    setIsTaskModalVisible(false);
    setTask("");
  };

  const columns = [
    {
      title: "Team Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (members) => (
        <>
          {members.map((member) => (
            <Tag key={member._id} color="blue">
              {member.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space size="middle">
          {/* <Tooltip title="Assign Task">
            <Button size="small" type="primary" onClick={() => showAssignTaskModal(record)}>
              <MdAssignmentAdd size={15} />
            </Button>
          </Tooltip> */}

          <Tooltip title="Invite User">
            <Button
              size="small"
              type="default"
              onClick={() => showInviteUserModal(record)}
            >
              <UserAddOutlined size={15} />
            </Button>
          </Tooltip>

          <Tooltip title="Delete Team">
            <Button
            disabled
              type="primary"
              danger
              size="small"
              onClick={() => handleDelete(record._id)}
            >
              <DeleteOutlined size={15} />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        margin: "20px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Title level={5} style={{ textAlign: "start", marginBottom: "20px" }}>
        Team Management
      </Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showAddTeamModal}
        style={{ marginBottom: "10px" }}
      >
        Add Team
      </Button>
      <Table
        dataSource={teams}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        size="small"
      />

      {/* Add Team Modal */}
      <Modal
        title="Create a New Team"
        open={isModalVisible}
        onOk={handleAddTeam}
        onCancel={() => setIsModalVisible(false)}
        maskClosable={false} 
      >
        <Input
          placeholder="Enter Team Name"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <Select
          mode="multiple"
          placeholder="Select team members"
          style={{ width: "100%" }}
          value={selectedMembers}
          onChange={(value) => setSelectedMembers(value)}
        >
          {userLists.map((user) => (
            <Option key={user._id} value={user._id}>
              {user.name || user._id}
            </Option>
          ))}
        </Select>
      </Modal>

      {/* Assign Task Modal */}
      <Modal
        title="Assign a Task"
        open={isTaskModalVisible}
        onOk={handleAssignTask}
        onCancel={() => setIsTaskModalVisible(false)}
        maskClosable={false} 
      >
        <Select
          placeholder="Select Team"
          style={{ width: "100%", marginBottom: 10 }}
          onChange={(value) => setSelectedTeam(value)}
        >
          {teams.map((team) => (
            <Option key={team.id} value={team.teamName}>
              {team.teamName}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Member"
          style={{ width: "100%", marginBottom: 10 }}
          onChange={(value) => setSelectedUser(value)}
        >
          {teams
            .flatMap((team) => team.members)
            .map((member, index) => (
              <Option key={index} value={member}>
                {member}
              </Option>
            ))}
        </Select>
        <Input
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </Modal>

      {/* Invite User Modal */}
      <Modal
        title="Invite a User to Join Team"
        open={isInviteModalVisible}
        onOk={handleInviteUser}
        onCancel={() => setIsInviteModalVisible(false)}
        maskClosable={false} 
      >
        <Col>
          <Select
            mode="multiple"
            placeholder="Select team members"
            style={{ width: "100%" }}
            value={selectedMembers}
            onChange={(value) => setSelectedMembers(value)}
          >
            {userLists.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.name || user._id}
              </Option>
            ))}
          </Select>
        </Col>
        <br />
        <Col>
          <Input
            placeholder="Enter Email Address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ marginBottom: 10 }}
          />
        </Col>
      </Modal>
    </Card>
  );
};

export default TeamList;
