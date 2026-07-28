import {Navigate} from 'react-router-dom'
import {Container, Tabs} from '@mantine/core'
import {getUserRole} from '../context/AuthContext.tsx'
import {IconDeviceLaptop, IconUsers} from "@tabler/icons-react";
import UsersTab from "./UsersTab.tsx";
import AdminOrderTab from "./AdminOrderTab.tsx";

function AdminPage() {
    if (getUserRole() !== 'ADMIN') {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <Tabs defaultValue='users' mt='md'>

                <Tabs.List>
                    <Tabs.Tab value='users' leftSection={<IconUsers size={16}/>}>
                        Users
                    </Tabs.Tab>
                    <Tabs.Tab value='orders' leftSection={<IconDeviceLaptop size={16}/>}>
                        Orders
                    </Tabs.Tab>
                </Tabs.List>

                <UsersTab/>

                <AdminOrderTab/>

            </Tabs>
        </Container>
    )
}

export default AdminPage
