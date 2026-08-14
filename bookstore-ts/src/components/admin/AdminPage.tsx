import {Navigate, useNavigate, useParams, Link,
    // useLocation
} from 'react-router'
import {Container, Tabs} from '@mantine/core'
import {useTranslation} from "react-i18next";
import {IconDeviceLaptop, IconUsers} from "@tabler/icons-react";

import {getUserRole} from '../context/AuthContext.tsx'
import UsersPanel from "./UsersPanel.tsx";
import AdminOrdersPanel from "./AdminOrdersPanel.tsx";

export default function AdminPage()
{
    const {t} = useTranslation("common");

    const navigate = useNavigate();
    const { tabValue } = useParams();
    // const location = useLocation();

    if (getUserRole() !== 'ADMIN') {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <Tabs mt='md' keepMounted={false}
                value={tabValue}
                onChange={(value) => navigate(`/adminpage/${value}`)}
            >

                <Tabs.List>
                    <Tabs.Tab value='users' leftSection={<IconUsers size={16}/>}
                        renderRoot={(props) => (
                            <Link to="/adminPage/users" {...props} />
                        )}
                    >
                        {t("Users")}
                    </Tabs.Tab>
                    <Tabs.Tab value='orders' leftSection={<IconDeviceLaptop size={16}/>}
                        renderRoot={(props) => (
                            <Link to="/adminPage/orders" {...props} />
                        )}
                    >
                        {t("Orders")}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value='users' pt='md'><UsersPanel/></Tabs.Panel>

                <Tabs.Panel value='orders' pt='md'><AdminOrdersPanel/></Tabs.Panel>

            </Tabs>
        </Container>
    )
}
