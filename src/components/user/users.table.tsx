import { useEffect, useState } from "react";
// import "../../styles/users.css"
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';



interface IUsers {
    id: string;
    email: string;
    name: string;
    role: string;
}

const UsersTable = () => {

    const [listUsers, setListUsers] = useState([]);
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
                console.log("value>>>>>>", value)
                console.log("record>>>>>>", record);
                return (
                    <></>
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


    return (
        <div>
            <h2>Table Users</h2>
            <Table
                columns={columns}
                dataSource={listUsers}
                rowKey={"_id"}
            />
        </div>
    )
}

export default UsersTable;