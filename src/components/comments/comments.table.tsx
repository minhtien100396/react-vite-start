import { Button, message, notification, Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

export interface IUser {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
}

export interface ITrack {
    _id: string;
    title: string;
    description: string;
    category: string;
    imgUrl: string;
    trackUrl: string;
    countLike: number;
    countPlay: number;
    uploader: IUser;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IComments {
    _id: string;
    content: string;
    moment: number;
    user: IUser;
    imgUrl: number;
    track: ITrack;
    isDeleted: boolean;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

const CommentTable = () => {
    const [listComments, setListComments] = useState([]);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const access_token = localStorage.getItem("access_token") as string;

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await fetch(
            `http://localhost:8000/api/v1/comments?current=${meta.current}&pageSize=${meta.pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const d = await res.json();
        if (!d.data) {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
        setListComments(d.data.result);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        });
    };

    const columns: ColumnsType<IComments> = [
        {
            title: "STT",
            dataIndex: "_id",
            render: (_value, _record, index) => {
                const offset = (meta.current - 1) * meta.pageSize;
                return <div>{offset + index + 1}</div>;
            },
        },

        {
            title: "Content",
            dataIndex: "content",
        },
        {
            title: "Track",
            dataIndex: ["track", "title"],
        },
        {
            title: "User",
            dataIndex: ["user", "name"],
        },
        {
            title: "Actions",
            render: (value, record) => {
                return (
                    <div>
                        {holder}
                        <Popconfirm
                            title="Delete the track"
                            description={`Are you sure to delete this track. name = ${record.content} ?`}
                            onConfirm={() => {
                                confirm(record);
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button style={{ marginLeft: "20px" }} danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    const [messageApi, holder] = message.useMessage();

    const confirm = async (comment: IComments) => {
        const res = await fetch(
            `http://localhost:8000/api/v1/comments/${comment._id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const d = await res.json();
        if (d.data) {
            notification.success({
                message: JSON.stringify(d.message),
            });

            const resPage = await fetch(
                `http://localhost:8000/api/v1/comments?current=${meta.current}&pageSize=${meta.pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const dataPage = await resPage.json();

            if (dataPage.data.result.length === 0 && meta.current > 1) {
                setMeta({ ...meta, current: meta.current - 1 });
                await handleOnChange(meta.current - 1, meta.pageSize);
            } else {
                setListComments(dataPage.data.result);
                setMeta(dataPage.data.meta);
            }
        } else {
            messageApi.error(d.message);
        }
    };

    const handleOnChange = async (page: number, pageSize: number) => {
        const res = await fetch(
            `http://localhost:8000/api/v1/comments?current=${page}&pageSize=${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const d = await res.json();
        if (!d.data) {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
        setListComments(d.data.result);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        });
    };

    return (
        <div>
            <div
                className="hoidanit"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h2>Table Comments</h2>
            </div>

            <Table
                columns={columns}
                dataSource={listComments}
                rowKey={"_id"}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                    onChange: (page: number, pageSize: number) =>
                        handleOnChange(page, pageSize),
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                }}
            />
        </div>
    );
};

export default CommentTable;
