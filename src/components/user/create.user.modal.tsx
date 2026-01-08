import { Modal, Input, notification, Form, Select } from 'antd';
import { Option } from 'antd/es/mentions';

interface IProps {
    access_token: string;
    getData: any;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const CreateUserModal = (props: IProps) => {

    const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } = props;
    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        form.resetFields();
    }


    const onFinish = async (values: any) => {
        const { name, email, password, age, gender, role, address } = values;
        const data = { name, email, password, age, gender, role, address };

        const res = await fetch("http://localhost:8000/api/v1/users",
            {
                method: "POST",
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
            setIsCreateModalOpen(false);
            form.resetFields();
        } else {
            notification.error({
                description: JSON.stringify(d.message),
                message: "Có lỗi xảy ra"
            })
        }
    };

    return (
        <Modal
            title="Add new user"
            open={isCreateModalOpen}
            onOk={() => {
                form.submit()
            }}
            onCancel={handleCloseCreateModal}
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
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
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

export default CreateUserModal;