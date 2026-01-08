import { Modal, Input, notification, Form, Select } from 'antd';
import { useEffect } from 'react';
import { IUsers } from './users.table';
import { Option } from 'antd/es/mentions';

interface IProps {
    access_token: string;
    getData: any;
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: null | IUsers;
    setDataUpdate: (v: null | IUsers) => void;
}

const UpdateUserModal = (props: IProps) => {

    const { access_token, getData, isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                age: dataUpdate.age,
                gender: dataUpdate.gender,
                role: dataUpdate.role,
                address: dataUpdate.address,
            })
        }
    }, [dataUpdate])


    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        form.resetFields();
        setDataUpdate(null);
    }

    const onFinish = async (values: any) => {

        const { name, email, age, gender, role, address } = values;

        if (dataUpdate) {
            const data = {
                _id: dataUpdate._id,
                name, email, age, gender, role, address
            }

            const res = await fetch("http://localhost:8000/api/v1/users",
                {
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );
            const d = await res.json();
            if (d.data) {
                await getData();
                notification.success({
                    message: JSON.stringify(d.message)
                })
                setIsUpdateModalOpen(false);
            } else {
                notification.error({
                    description: JSON.stringify(d.message),
                    message: "Có lỗi xảy ra"
                })
            }
        }
    }

    return (
        <Modal
            title="Update a user"
            open={isUpdateModalOpen}
            onOk={() => {
                form.submit()
            }}
            onCancel={handleCloseUpdateModal}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout='vertical'
                form={form}
            >
                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Password"
                    name="password"
                    rules={[{ required: dataUpdate ? false : true, message: 'Please input your password!' }]}

                >
                    <Input.Password disabled={dataUpdate ? true : false} />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Age"
                    name="age"
                    rules={[{ required: true, message: 'Please input your age!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please input your gender!' }]}
                >
                    <Select
                        placeholder="select your gender"
                        allowClear
                    >
                        <Option value="MALE">Male</Option>
                        <Option value="FEMALE">Female</Option>
                        <Option value="OTHER">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please input your role!' }]}
                >
                    <Select
                        placeholder="select your role"
                        allowClear
                    >
                        <Option value="USER">User</Option>
                        <Option value="ADMIN">Admin</Option>
                    </Select>
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default UpdateUserModal;