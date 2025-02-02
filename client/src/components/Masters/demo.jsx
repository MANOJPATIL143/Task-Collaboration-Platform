import React, { useState } from "react";
import { Table, Tag, Card, Typography, Space, Button, Modal, Input, Select, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UserAddOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const TeamList = () => {
  const [teams, setTeams] = useState([
    {
      id: 1,
      teamName: "Development Team",
      members: ["John Doe", "Jane Smith", "Alice Brown"],
    },
    {
      id: 2,
      teamName: "Marketing Team",
      members: ["Michael Johnson", "Emily Davis"],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState(""); // New state for email
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Open Add Team Modal
  const showAddTeamModal = () => {
    setIsModalVisible(true);
  };

  // Handle Adding a New Team
  const handleAddTeam = () => {
    if (!newTeamName || selectedMembers.length === 0) {
      message.error("Please enter a team name and select members.");
      return;
    }

    const newTeam = {
      id: teams.length + 1,
      teamName: newTeamName,
      members: selectedMembers,
    };

    setTeams([...teams, newTeam]);
    setNewTeamName("");
    setSelectedMembers([]);
    setIsModalVisible(false);
    message.success("Team added successfully!");
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

  // Show Invite User Modal
  const showInviteUserModal = () => {
    setIsInviteModalVisible(true);
  };

  // Handle Inviting User
  const handleInviteUser = () => {
    if (!inviteEmail || !selectedTeam) {
      message.error("Please enter a valid email and select a team.");
      return;
    }

    message.success(`Invitation sent to ${inviteEmail} to join ${selectedTeam}!`);
    setIsInviteModalVisible(false);
    setInviteEmail(""); // Reset email input
  };

  const columns = [
    {
      title: "Team Name",
      dataIndex: "teamName",
      key: "teamName",
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (members) => (
        <>
          {members.map((member, index) => (
            <Tag key={index} color="blue">
              {member}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<UserAddOutlined />} onClick={showInviteUserModal}>
            Invite User
          </Button>
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
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
      <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
        Team Management
      </Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={showAddTeamModal} style={{ marginBottom: "10px" }}>
        Add Team
      </Button>
      <Table dataSource={teams} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} bordered />

      {/* Add Team Modal */}
      <Modal title="Create a New Team" open={isModalVisible} onOk={handleAddTeam} onCancel={() => setIsModalVisible(false)}>
        <Input placeholder="Enter Team Name" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} style={{ marginBottom: 10 }} />
        <Select
          mode="multiple"
          placeholder="Select team members"
          style={{ width: "100%" }}
          value={selectedMembers}
          onChange={(value) => setSelectedMembers(value)}
        >
          <Option value="John Doe">John Doe</Option>
          <Option value="Jane Smith">Jane Smith</Option>
          <Option value="Alice Brown">Alice Brown</Option>
          <Option value="Michael Johnson">Michael Johnson</Option>
          <Option value="Emily Davis">Emily Davis</Option>
        </Select>
      </Modal>

      {/* Invite User Modal */}
      <Modal title="Invite a User to Join Team" open={isInviteModalVisible} onOk={handleInviteUser} onCancel={() => setIsInviteModalVisible(false)}>
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
        <Input
          placeholder="Enter Email Address"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          style={{ marginBottom: 10 }}
        />
      </Modal>
    </Card>
  );
};

export default TeamList;
