import { useEffect, useState } from "react";
// import "../../styles/users.css"
import { Table, Button, notification, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";




export interface IUsers {
    _id: string;
    email: string;
    name: string;
    password: string;
    age: number;
    gender: string
    role: string;
    address: string;
}

const UsersTable = () => {

    const [listUsers, setListUsers] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<null | IUsers>(null);



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
        if (!d.data) {
            notification.error({
                message: JSON.stringify(d.message)
            })
        }
        setListUsers(d.data.result)
    }

    const columns: ColumnsType<IUsers> = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: (value, record) => {
                return (
                    <div>{record.email}</div>
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
        },
        {
            title: 'Actions',
            render: (value, record) => {
                return (
                    <div>
                        <Button onClick={() => {
                            setIsUpdateModalOpen(true)
                            setDataUpdate(record);
                        }}>Edit</Button>
                        {holder}
                        <Popconfirm
                            title="Delete the user"
                            description={`Are you sure to delete this user. name = ${record.name} ?`}
                            onConfirm={() => {
                                confirm(record)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button style={{ marginLeft: "20px" }} danger>Delete</Button>
                        </Popconfirm>
                    </div>
                )
            }
        }
    ]

    const [messageApi, holder] = message.useMessage();

    const confirm = async (user: IUsers) => {

        const res = await fetch(
            `http://localhost:8000/api/v1/users/${user._id}`,
            {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                }
            })
        const d = await res.json();
        if (d.data) {
            notification.success({
                message: JSON.stringify(d.message)
            })
            await getData();
        } else {
            messageApi.error(d.message);
        }
    };




    return (
        <div>
            <div className="hoidanit" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Table Users</h2>
                <div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        setIsCreateModalOpen(true);
                    }}>Add new</Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={listUsers}
                rowKey={"_id"}
            />
            <CreateUserModal
                access_token={access_token}
                getData={getData}
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />
            <UpdateUserModal
                access_token={access_token}
                getData={getData}
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />


        </div>
    )
}

export default UsersTable;