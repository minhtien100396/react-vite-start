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
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })


    const access_token = localStorage.getItem("access_token") as string

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        const res = await fetch(`http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`,
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
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        })
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

            const resPage = await fetch(`http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`,
                {
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            const dataPage = await resPage.json();

            if (dataPage.data.result.length === 0 && meta.current > 1) {
                setMeta({ ...meta, current: meta.current - 1 });
                await handleOnChange(meta.current - 1, meta.pageSize);
            } else {
                setListUsers(dataPage.data.result);
                setMeta(dataPage.data.meta);
            }

        } else {
            messageApi.error(d.message);
        }
    };

    const handleOnChange = async (page: number, pageSize: number) => {
        const res = await fetch(`http://localhost:8000/api/v1/users?current=${page}&pageSize=${pageSize}`,
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
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        })
    }



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
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: (page: number, pageSize: number) => handleOnChange(page, pageSize),
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50']
                }}
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