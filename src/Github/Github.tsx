import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Input, Space} from 'antd';
import axios from 'axios';

const {Search} = Input;

const it_kamasutra = 'it-kamasutra'

export const Github: React.FC = (props) => {

    const [searchTerm, setSearchTerm] = useState(it_kamasutra);
    const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null);

    useEffect(() => {
        console.log('sing tab title')
        if (selectedUser) {
            document.title = selectedUser.login
        }
    }, [selectedUser])

    return <>
        <div style={{padding: '20px'}}>
            <div style={{display: 'flex', gap: '50px'}}>
                <div>
                    <SearchComp values={searchTerm} onSubmit={(value: string) => {
                        setSearchTerm(value)
                    }}/>
                    <br/>
                    <Button onClick={() => setSearchTerm(it_kamasutra)}>Reset</Button>
                    <br/>
                    <UsersList term={searchTerm} selectedUser={selectedUser} onUserSelectCB={setSelectedUser}/>
                </div>
                <div>
                    <h2>UserName</h2>
                    <Details user={selectedUser}/>
                </div>
            </div>

            <br/>

        </div>


    </>
};


export const SearchComp: React.FC<SearchCompType> = ({values, onSubmit}) => {

    const [tempSearch, setTempSearch] = useState('');

    useEffect(() => {
        setTempSearch(values)
    }, [values])

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
                <Button onClick={() => {
                    onSubmit(tempSearch)
                }}>FIND</Button>
                <div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    );
};
type SearchCompType = {
    values: string
    onSubmit: (el: any) => void
}
type SearchResultType = {
    items: SearchUserType[]
}

export const UsersList: React.FC<UsersListType> = ({onUserSelectCB, selectedUser, term}) => {
    const [users, setUsers] = useState<SearchUserType[]>([]);

    useEffect(() => {
        console.log('sing users')
        axios
            .get<SearchResultType>(`https://api.github.com/search/users?q=${term}`)
            .then(res => {
                setUsers(res.data.items)
            })
    }, [term])

    const user = users.map(u => <ul key={u.id}>
        <li style={selectedUser === u
            ? {color: 'red'}
            : {color: 'black'}} onClick={() => {
            onUserSelectCB(u);
        }}>{u.login}
        </li>
    </ul>)

    return (
        <div>
            {user}
        </div>
    );
};
type UsersListType = {
    term: string
    selectedUser: SearchUserType | null
    onUserSelectCB: (user: SearchUserType) => void
}


export const Details: React.FC<DetailsProps> = ({user}) => {
    const [userDetails, setUserDetails] = useState<UserType | null>(null);

    useEffect(() => {
        console.log('add user details')

        if (!!user) {
            axios
                .get<UserType>(`https://api.github.com/users/${user.login}`)
                .then(res => {
                    setUserDetails(res.data)
                })
        }
    }, [user])


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
    user: SearchUserType | null
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
