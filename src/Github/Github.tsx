import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Input, Space} from 'antd';
import axios from 'axios';

const {Search} = Input;

export const Github: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null);
    const [users, setUsers] = useState<SearchUserType[]>([]);

    return <>
        <div style={{padding: '20px'}}>
            <div style={{display: 'flex', gap: '50px'}}>
                <SearchComp setUsers={setUsers}/>
                <div>
                    <h2>UserName</h2>
                    <Details selectedUser={selectedUser}/>
                </div>
            </div>
            <div>
               <Users users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
            </div>
        </div>


    </>
};




export const SearchComp: React.FC<SearchCompType> = (props) => {

    const [tempSearch, setTempSearch] = useState('it-kamasutra');
    const [searchTerm, setSearchTerm] = useState('it-kamasutra');

    useEffect(() => {
        console.log('sing users')
        axios
            .get<SearchResultType>(`https://api.github.com/search/users?q=${searchTerm}`)
            .then(res => {
                props.setUsers(res.data.items)
            })
    }, [searchTerm])


    return (
        <div>
            <div style={{display: 'flex', gap: '30px'}}>
                <Space direction="vertical">
                    <Search value={tempSearch}
                            onChange={(e) => setTempSearch(e.currentTarget.value)}
                            placeholder="input search text"
                        // onSearch={onSearch}
                        //enterButton
                    />
                </Space>
                <Button
                    onClick={() => {
                        setSearchTerm(tempSearch)
                    }}>
                    FIND</Button>
                <div>

                </div>
            </div>
        </div>
    );
};
type SearchCompType ={
    setUsers: any
}
type SearchResultType = {
    items: SearchUserType[]
}



export const Users: React.FC<AllUsersType> = ({selectedUser, setSelectedUser, users}) => {

    useEffect(() => {
        console.log('sing tab title')
        if (selectedUser) {
            document.title = selectedUser.login
        }
    }, [selectedUser])

    const user = users.map(u => <ul key={u.id}>
        <li style={selectedUser === u
            ? {color: 'red'}
            : {color: 'black'}} onClick={() => {
            setSelectedUser(u);
        }}>{u.login}</li>
    </ul>)

    return (
        <div>
            {user}
        </div>
    );
};
type AllUsersType = {
    users: SearchUserType[]
    selectedUser: any
    setSelectedUser: any
}


export const Details: React.FC<DetailsProps> = (props) => {

    const [userDetails, setUserDetails] = useState<UserType | null>(null);

    useEffect(() => {
        console.log('add user details')

        if (!!props.selectedUser) {
            axios
                .get<UserType>(`https://api.github.com/users/${props.selectedUser.login}`)
                .then(res => {
                    setUserDetails(res.data)
                })
        }
    }, [props.selectedUser])


    return (
        <div>
            <h2>Details</h2>
            {userDetails
                &&
                <div>
                    <div>Login: {userDetails.login}</div>
                    <div>Avatar: {userDetails.avatar}</div>
                    <div>Score: {userDetails.score}</div>
                    <div>Site-Admin: {userDetails.site_admin}</div>
                    <div>Type: {userDetails.type}</div>
                    <div>Site-Admin: {userDetails.site_admin}</div>
                    <div>{userDetails.id}</div>
                    <img src={userDetails.avatar_url} alt="Avatar"/>
                </div>
            }
        </div>
    );
};
type DetailsProps = {
    selectedUser: any
}


type SearchUserType = {
    login: string
    id: number
}
type UserType = {
    id: number
    login: string
    avatar: string
    avatar_url: string
    url: string
    type: string
    site_admin: boolean
    score: number
}
