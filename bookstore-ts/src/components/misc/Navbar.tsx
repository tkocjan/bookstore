import {Link, useNavigate, useLocation} from 'react-router'
import {Group, Button, Anchor, AppShell, Text} from '@mantine/core'
import {useTranslation} from "react-i18next";

import {getJwtUserData, getUserRole, useAuthContext} from '../context/AuthContext.tsx'
import {LanguageSwitcher} from "./LanguageSwitcher.tsx";

export default function Navbar()
{
    const {t} = useTranslation("common");

    const {userIsAuthenticated, userLoggedOut} = useAuthContext()
    const navigate = useNavigate()
    const {pathname} = useLocation();
    const underlineActive = (path: string): string =>
        path === pathname || path !== '/' && path === pathname.slice(0, path.length)
            ? 'underline': '';

    const isAuthenticated = userIsAuthenticated()
    const user = getJwtUserData()
    const isAdmin = getUserRole() === 'ADMIN'
    const isUser = getUserRole() === 'USER'
    const userName = user ? user.data.name : ''

    const handleLogout = () => {
        userLoggedOut()
        navigate('/')
    }

    return (
        <AppShell.Header p='sm' bg='violet'>
            <Group justify='space-between' h='100%'>
                <Group>
                    <Text fw={700} size='lg' c='white'>
                        {t("Bookstore")}
                    </Text>
                    <Anchor component={Link} to='/' c='white' td={underlineActive('/')}>
                        {t("Home")}
                    </Anchor>
                    <Anchor component={Link} to='/bookspage' c='white' td={underlineActive('/bookspage')}>
                        {t("Books")}
                    </Anchor>
                    {isAdmin && (
                        <Anchor component={Link} to='/adminpage' c='white' td={underlineActive('/adminpage')}>
                            {t("Admin")}
                        </Anchor>
                    )}
                    {isUser && (
                        <Anchor component={Link} to='/orderspage' c='white' td={underlineActive('/orderspage')}>
                            {t("Orders")}
                        </Anchor>
                    )}
                </Group>
                <Group>
                    {!isAuthenticated && (
                        <Anchor component={Link} to='/login' c='white' td={underlineActive('/login')}>
                            {t("Login")}
                        </Anchor>
                    )}
                    {!isAuthenticated && (
                        <Anchor component={Link} to='/signup' c='white' td={underlineActive('/signup')}>
                            {t("Sign Up")}
                        </Anchor>
                    )}
                    {isAuthenticated && (
                        <Text size='sm' c='white'>
                            {t("Hi")}, {userName}!
                        </Text>
                    )}
                    {isUser && (
                        <Anchor component={Link} to='/cartpage' c='white' td={underlineActive('/cartpage')}>
                            {t("Cart")}
                        </Anchor>
                    )}
                    {isAuthenticated && (
                        <Button
                            variant='white'
                            color='violet'
                            size='sm'
                            onClick={handleLogout}
                        >
                            {t("Logout")}
                        </Button>
                    )}
                    <LanguageSwitcher />
                </Group>
            </Group>
        </AppShell.Header>
    )
}
