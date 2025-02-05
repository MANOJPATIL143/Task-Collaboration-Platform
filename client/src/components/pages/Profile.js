
import { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  Button,
  List,
  Descriptions,
  Avatar,
  Radio,
  Switch,
  Upload,
  message,
  Modal,
} from "antd";

import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import useAxios from "../../hooks/useAxios";
import BgProfile from "../../assets/images/bg-profile.jpg";
import convesionImg from "../../assets/images/face-3.jpg";
import convesionImg2 from "../../assets/images/face-4.jpg";
import convesionImg3 from "../../assets/images/face-5.jpeg";
import convesionImg4 from "../../assets/images/face-6.jpeg";
import convesionImg5 from "../../assets/images/face-2.jpg";
import UpdateUserModal from "../model/UpdateUserModal";

function Profile() {
  const profile = useAxios();
  const [imageURL, setImageURL] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState([]);
  // console.log(info);

  const TasskLists = async () => {
    setLoading(true);
    try {
      const req = { status: "", priority: "", dueDate: "" };
      const res = await profile.execute({
        url: "users/me",
        method: "GET",
      });
      // console.log('Users:', users);
      setInfo(res);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    TasskLists();
  }, [])

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };


  const pencil = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
        className="fill-gray-7"
      ></path>
      <path
        d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
        className="fill-gray-7"
      ></path>
    </svg>,
  ];


  const data = [
    {
      title: "Sophie B.",
      avatar: convesionImg,
      description: "Hi! I need more information…",
    },
    {
      title: "Anne Marie",
      avatar: convesionImg2,
      description: "Awesome work, can you…",
    },
    {
      title: "Ivan",
      avatar: convesionImg3,
      description: "About files I can…",
    },
    {
      title: "Peterson",
      avatar: convesionImg4,
      description: "Have a great afternoon…",
    },
    {
      title: "Nick Daniel",
      avatar: convesionImg5,
      description: "Hi! I need more information…",
    },
  ];

  const onClose = () => {
    setIsModalVisible(false);
    TasskLists();
  };

  return (
    <>
      <div
        className="profile-nav-bg"
        style={{ backgroundImage: "url(" + BgProfile + ")" }}
      ></div>
      <Card
        loading={loading}
        className="card-profile-head"
      >
        <Row justify="space-between" align="middle" gutter={[24, 0]}>
          <Col span={24} md={12} className="col-info">
            <Avatar.Group>
              <Avatar
                size={74}
                shape="square"
                src={info?.profileImage}
                onClick={() => setVisible(true)}
                style={{ cursor: "pointer" }}
              />
              <div className="avatar-info">
                <h4 className="font-semibold m-0">{info?.name}</h4>
              </div>
            </Avatar.Group>

            {/* Modal for Showing Profile Image */}
            <Modal
              open={visible}
              footer={null}
              onCancel={() => setVisible(false)}
              centered

            >
              <img
                src={info?.profileImage}
                alt="Profile"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Modal>
          </Col>
          <Col
            span={24}
            md={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Radio.Group defaultValue="a">
              <Radio.Button value="a">OVERVIEW</Radio.Button>
              <Radio.Button value="b">TEAMS</Radio.Button>
              <Radio.Button value="c">PROJECTS</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 0]}>

        <Card
          // loading={loading}
          bordered={false}
          title={<h6 className="font-semibold m-0">Profile Information</h6>}
          className="header-solid h-full card-profile-information"
          extra={<Button onClick={() => setIsModalVisible(true)} type="link">{pencil}</Button>}
          bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
        >
          <hr className="my-25" />
          <Descriptions title="">
            <Descriptions.Item label="Full Name" span={3}>
              {info?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile" span={3}>
              {info?.mobileno}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={3}>
              {info?.email}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Location" span={3}>
                USA
              </Descriptions.Item> */}
            <Descriptions.Item label="Social" span={3}>
              <a href="#pablo" className="mx-5 px-5">
                {<TwitterOutlined />}
              </a>
              <a href="#pablo" className="mx-5 px-5">
                {<FacebookOutlined style={{ color: "#344e86" }} />}
              </a>
              <a href="#pablo" className="mx-5 px-5">
                {<InstagramOutlined style={{ color: "#e1306c" }} />}
              </a>
            </Descriptions.Item>
          </Descriptions>

          <UpdateUserModal
            visible={isModalVisible}
            onClose={onClose}
            data={info}
          />
        </Card>

      </Row>
    </>
  );
}

export default Profile;
