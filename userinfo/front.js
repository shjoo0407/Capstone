import React, { useState } from "react";
import axios from "axios";

function UserList() {
    const [users, setUsers] = useState([]);

    const handleClick = async() => {
        const response = await axios.get('http://localhost:8080/api/mydatabase'); // get 요청
        setUsers(response.data);
    };

    return (
        <div>
            <button onClick={handleClick}>Show Users</button>
            {users.map(user => (
                <div key={user.id}>
                    <p>{user.user_id}</p>
                    <p>{user.user_pw}</p>
                    <p>{user.user_name}</p>
                    <p>{user.user_birth}</p>
                    <p>{user.user_gender}</p>
                    <p>{user.user_height}</p>
                    <p>{user.user_weight}</p>
                </div>
            ))}
        </div>
    );
}

