import {Navigate} from 'react-router'
import {Container, Tabs} from '@mantine/core'
import {useTranslation} from "react-i18next";
import {IconDeviceLaptop, IconUsers} from "@tabler/icons-react";

import {getUserRole} from '../context/AuthContext.tsx'
import UsersTab from "./UsersTab.tsx";
import AdminOrderTab from "./AdminOrderTab.tsx";

function AdminPage()
{
    const {t} = useTranslation("common");

    if (getUserRole() !== 'ADMIN') {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <Tabs defaultValue='users' mt='md'>

                <Tabs.List>
                    <Tabs.Tab value='users' leftSection={<IconUsers size={16}/>}>
                        {t("Users")}
                    </Tabs.Tab>
                    <Tabs.Tab value='orders' leftSection={<IconDeviceLaptop size={16}/>}>
                        {t("Orders")}
                    </Tabs.Tab>
                </Tabs.List>

                <UsersTab/>

                <AdminOrderTab/>

            </Tabs>
        </Container>
    )
}

export default AdminPage
