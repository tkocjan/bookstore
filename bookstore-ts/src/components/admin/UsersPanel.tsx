import {type ChangeEvent as ReactChangeEvent, type SubmitEvent as ReactSubmitEvent, useEffect, useState} from "react";
import {Group, TextInput, ActionIcon, LoadingOverlay, Box} from '@mantine/core'
import type {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import { IconSearch } from '@tabler/icons-react'

import {bookstoreApi} from '../misc/BookstoreApi'
import UserList from "./UserList.tsx";
import {handleLogError} from "../misc/Helpers.ts";

function UsersPanel()
{
    const {t} = useTranslation("common");

    const [users, setUsers] = useState([]);
    const [userUsernameSearch, setUserUsernameSearch] = useState('');
    const [isUsersLoading, setIsUsersLoading] = useState(true);

    useEffect(() => {
        handleGetUsers()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (e: ReactChangeEvent<HTMLInputElement>) => {
        const {value} = e.target as HTMLInputElement;
        setUserUsernameSearch(value)
    }

    const handleGetUsers = async () => {
        setIsUsersLoading(true)

        bookstoreApi.getUsers()
            .then((response) => setUsers(response.data))
            .catch((error: AxiosError) => handleLogError(error))
            .finally(() => setIsUsersLoading(false));
    }

    const handleDeleteUser = async (username: string) => {
        setIsUsersLoading(true)

        bookstoreApi.deleteUser(username)
            .then(() => handleGetUsers())
            .catch((error: AxiosError) => {
                handleLogError(error);
                setIsUsersLoading(false);
            });
    }

    const handleSearchUser = async (e: ReactSubmitEvent) => {
        e.preventDefault()
        const username = userUsernameSearch
        setIsUsersLoading(true)

        bookstoreApi.getUsers(username)
            .then((response) => {
                const data = response.data;
                const users = data instanceof Array ? data : [data];
                setUsers(users as []);
            })
            .catch((error: AxiosError) => {
                handleLogError(error);
                setUsers([]);
            })
            .finally(() => setIsUsersLoading(false));
    }

    return (
        <Box pos='relative'>
            <LoadingOverlay visible={isUsersLoading}/>
            <form onSubmit={handleSearchUser}>
                <Group mb='md'>
                    <TextInput
                        name='userUsernameSearch'
                        placeholder={t("Search by Username")}
                        value={userUsernameSearch}
                        onChange={handleInputChange}
                    />
                    <ActionIcon type='submit' variant='light' color='violet'>
                        <IconSearch size={16}/>
                    </ActionIcon>
                </Group>
            </form>
            <UserList users={users} handleDeleteUser={handleDeleteUser}/>
        </Box>
    )
}

export default UsersPanel
