import {Navigate} from 'react-router'
import {Container, Tabs} from '@mantine/core'
import {useTranslation} from "react-i18next";
import {IconDeviceLaptop, IconUsers} from "@tabler/icons-react";

import {getUserRole} from '../context/AuthContext.tsx'
import UsersPanel from "./UsersPanel.tsx";
import AdminOrderPanel from "./AdminOrderPanel.tsx";

function AdminPage()
{
    const {t} = useTranslation("common");

    if (getUserRole() !== 'ADMIN') {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <Tabs defaultValue='users' mt='md' keepMounted={false}>

                <Tabs.List>
                    <Tabs.Tab value='users' leftSection={<IconUsers size={16}/>}>
                        {t("Users")}
                    </Tabs.Tab>
                    <Tabs.Tab value='orders' leftSection={<IconDeviceLaptop size={16}/>}>
                        {t("Orders")}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value='users' pt='md'><UsersPanel/></Tabs.Panel>

                <Tabs.Panel value='orders' pt='md'><AdminOrderPanel/></Tabs.Panel>

            </Tabs>
        </Container>
    )
}

export default AdminPage
