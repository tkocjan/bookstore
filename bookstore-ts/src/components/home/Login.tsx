import {useState, type SubmitEvent as ReactSubmitEvent} from 'react'
import {NavLink, Navigate} from 'react-router-dom'
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Stack,
    Alert,
    Anchor,
    Center,
    Box
} from '@mantine/core'
import {IconInfoCircle} from '@tabler/icons-react'
import {useAuth} from '../context/AuthContext.tsx'
import {bookstoreApi} from '../misc/BookstoreApi.ts'
import {parseJwt, handleLogError} from '../misc/Helpers.ts'
import type {AxiosError} from "axios";

function Login() {
    const authContext = useAuth()
    const isLoggedIn = authContext.userIsAuthenticated()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isError, setIsError] = useState(false)

    const handleSubmit = async (e: ReactSubmitEvent) => {
        e.preventDefault()

        if (!(username && password)) {
            setIsError(true)
            return
        }

        try {
            const response = await bookstoreApi.authenticate(username, password)
            const {accessToken} = response.data
            const data = parseJwt(accessToken)
            const authenticatedUser = {data, accessToken}

            authContext.userLoggerIn(authenticatedUser)

            setUsername('')
            setPassword('')
            setIsError(false)
        } catch (error: any) {
            handleLogError(error as AxiosError)
            setIsError(true)
        }
    }

    if (isLoggedIn) {
        return <Navigate to='/'/>
    }

    return (
        <Center mt='xl'>
            <Box w={450}>
                <form onSubmit={handleSubmit}>
                    <Paper withBorder p='xl' shadow='sm' radius='md'>
                        <Stack gap='sm'>
                            <TextInput
                                autoFocus
                                name='username'
                                label='Username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <PasswordInput
                                name='password'
                                label='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button type='submit' color='violet' fullWidth>
                                Login
                            </Button>
                        </Stack>
                    </Paper>
                </form>
                <Paper withBorder p='sm' radius='md' mt='sm' ta='center' shadow='sm'>
                    Don&apos;t have an account?{' '}
                    <Anchor component={NavLink} to='/signup' c='violet'>
                        Sign Up
                    </Anchor>
                </Paper>
                {isError && (
                    <Alert color='red' variant='light' mt='sm' icon={<IconInfoCircle/>}>
                        The username or password provided are incorrect!
                    </Alert>
                )}
            </Box>
        </Center>
    )
}

export default Login
