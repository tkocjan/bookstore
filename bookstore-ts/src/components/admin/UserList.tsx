import { ActionIcon, Table } from '@mantine/core'
import {useTranslation} from "react-i18next";
import { IconTrash } from '@tabler/icons-react'

import type {UserDto} from "../misc/BookstoreApi.tsx";

type UserListProps = {
    users: UserDto[];
    handleDeleteUser: (orderId: string) => void;
}

export default function UserList({
   users,
   handleDeleteUser,
}: UserListProps) {
    const {t} = useTranslation("common");

    let userList
    if (users.length === 0) {
        userList = (
            <Table.Tr key='no-user'>
                <Table.Td colSpan={6} ta='center'>
                    {t("No users")}
                </Table.Td>
            </Table.Tr>
        )
    } else {
        userList = users.map((user: UserDto) => (
            <Table.Tr key={user.id}>
                <Table.Td>
                    <ActionIcon
                        color='red'
                        variant='light'
                        size='sm'
                        disabled={user.username === 'admin'}
                        onClick={() => handleDeleteUser(user.username)}
                    >
                        <IconTrash size={14}/>
                    </ActionIcon>
                </Table.Td>
                <Table.Td>{user.id}</Table.Td>
                <Table.Td>{user.username}</Table.Td>
                <Table.Td>{user.name}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.role}</Table.Td>
            </Table.Tr>
        ))
    }

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th w={40}/>
                    <Table.Th> {t("ID")}</Table.Th>
                    <Table.Th> {t("Username")}</Table.Th>
                    <Table.Th> {t("Name")}</Table.Th>
                    <Table.Th> {t("Email")}</Table.Th>
                    <Table.Th> {t("Role")}</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{userList}</Table.Tbody>
        </Table>
    )
}
