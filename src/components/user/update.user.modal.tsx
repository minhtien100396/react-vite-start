import { Modal, Input, notification } from 'antd';
import { useState, useEffect } from 'react';
import { IUsers } from './users.table';

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

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (dataUpdate) {
            setName(dataUpdate?.name);
            setEmail(dataUpdate?.email);
            setPassword(dataUpdate.password);
            setAge(dataUpdate.age);
            setGender(dataUpdate.gender);
            setAddress(dataUpdate.address);
            setRole(dataUpdate.role);
        }
    }, [dataUpdate])

    const handleUpdate = async () => {
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
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setAge(0);
        setGender("");
        setAddress("");
        setRole("");
        setDataUpdate(null);
    }

    return (
        <Modal
            title="Update a user"
            open={isUpdateModalOpen}
            onOk={handleUpdate}
            onCancel={handleCloseUpdateModal}
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
                <Input disabled value={password} onChange={(event) => setPassword(event.target.value)} />

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

export default UpdateUserModal;