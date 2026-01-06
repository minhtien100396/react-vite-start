import { useEffect, useState } from "react";
// import "../../styles/users.css"
import { Table, Button, Modal, Input, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';




interface IUsers {
    id: string;
    email: string;
    name: string;
    role: string;
}

const UsersTable = () => {

    const [listUsers, setListUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [address, setAddress] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);


    const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjk1YjYzNDgxMDk1ZjNlNTMyMTBmMzIzIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3Njc1OTY5NDQsImV4cCI6MTg1Mzk5Njk0NH0.5nBMnhfbVGCu_Y-6ZpRZT4LPO40qv0z_WTcl2m9Jqb8"

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        const res = await fetch("http://localhost:8000/api/v1/users/all",
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const d = await res.json();
        setListUsers(d.data.result)
    }

    const columns: ColumnsType<IUsers> = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: (value, record) => {
                return (
                    <><div>{record.email}</div></>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        }
    ]




    const handleOk = async () => {
        const data = {
            name, email, password, age, gender, role, address
        }

        const res = await fetch("http://localhost:8000/api/v1/users",
            {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...data
                })
            }
        );

        const d = await res.json();
        if (d.data) {
            await getData();
            notification.success({
                message: JSON.stringify(d.message)
            })
            setIsModalOpen(false);
        } else {
            notification.error({
                description: JSON.stringify(d.message),
                message: "Có lỗi xảy ra"
            })
        }
    };

    const handleCloseCreateModal = () => {
        setIsModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setGender("");
        setAddress("");
        setRole("");
    }

    return (
        <div>
            <div className="hoidanit" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Table Users</h2>
                <div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        setIsModalOpen(true);
                    }}>Add new</Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={listUsers}
                rowKey={"_id"}
            />
            <Modal
                title="Add new user"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCloseCreateModal}
                maskClosable={false}
            >
                <div>
                    <label htmlFor="">Name:</label>
                    <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)} />
                </div>
                <div>
                    <label htmlFor="">Email:</label>
                    <Input value={email} onChange={(event) => setEmail(event.target.value)} />


                </div>
                <div>
                    <label htmlFor="">Password:</label>
                    <Input value={password} onChange={(event) => setPassword(event.target.value)} />

                </div>
                <div>
                    <label htmlFor="">Age:</label>
                    <Input value={age} onChange={(event) => setAge(event.target.value)} />
                </div>
                <div>
                    <label htmlFor="">Gender:</label>
                    <Input value={gender} onChange={(event) => setGender(event.target.value)} />
                </div>
                <div>
                    <label htmlFor="">Address:</label>
                    <Input value={address} onChange={(event) => setAddress(event.target.value)} />
                </div>
                <div>
                    <label htmlFor="">Role:</label>
                    <Input value={role} onChange={(event) => setRole(event.target.value)} />
                </div>
            </Modal>
        </div>
    )
}

export default UsersTable;