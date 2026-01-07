import { Modal, Input, notification } from 'antd';
import { useState } from 'react';

interface IProps {
    access_token: string;
    getData: any;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const CreateUserModal = (props: IProps) => {

    const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } = props;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [address, setAddress] = useState("");


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
            setIsCreateModalOpen(false);
            setName("");
            setEmail("");
            setPassword("");
            setAge("");
            setGender("");
            setAddress("");
            setRole("");
        } else {
            notification.error({
                description: JSON.stringify(d.message),
                message: "Có lỗi xảy ra"
            })
        }
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setGender("");
        setAddress("");
        setRole("");
    }

    return (
        <Modal
            title="Add new user"
            open={isCreateModalOpen}
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
    )
}

export default CreateUserModal;