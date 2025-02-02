
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
} from "antd";
import useAxios from "../../hooks/useAxios";

import ava6 from "../../assets/images/logo-invision.svg";
import face from "../../assets/images/face-1.jpg";
import face2 from "../../assets/images/face-2.jpg";
import face3 from "../../assets/images/face-3.jpg";
import face4 from "../../assets/images/face-4.jpg";
import face5 from "../../assets/images/face-5.jpeg";
import face6 from "../../assets/images/face-6.jpeg";
import pencil from "../../assets/images/pencil.svg";
import { useEffect, useState } from "react";

const { Title } = Typography;


function Membeers() {
  const userRequest = useAxios();
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] =useState(false);
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const users = await userRequest.execute({
        url: "users",
        method: "GET",
      });
      // console.log("Users:", users);
      setUserLists(users);
      setLoading(false)
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

   useEffect(() => {
      fetchUsers();
    }, []);

    const columns = [
      {
        title: "AUTHOR",
        dataIndex: "name",
        key: "name",
        render: (text) => text && text.trim() !== "" ? text : "NA",
        width: "32%",
      },
      {
        title: "Email",
        key: "email",
        dataIndex: "email",
        render: (text) => text && text.trim() !== "" ? text : "NA",
      },
      {
        title: "STATUS",
        key: "status",
        dataIndex: "status",
        render: (text) => text && text.trim() !== "" ? text : "NA",
      },
      {
        title: "EMPLOYED",
        key: "_id",
        dataIndex: "_id",
        render: (text) => text && text.trim() !== "" ? text : "NA",
      },
    ];
  
  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="All Members"
             
              
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  loading={loading}
                  dataSource={userLists}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Membeers;
