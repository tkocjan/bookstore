import {useState, type SubmitEvent as ReactSubmitEvent} from 'react'
import {NavLink, Navigate} from 'react-router'
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
import type {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {IconInfoCircle} from '@tabler/icons-react'

import {useAuthContext} from '../context/AuthContext.tsx'
import {bookstoreApi, type SignupInputData} from '../misc/BookstoreApi.ts'
import {parseJwt, handleLogError} from '../misc/Helpers.ts'

export default function Signup()
{
    const {t} = useTranslation("common");

    const authContext = useAuthContext()
    const isLoggedIn = authContext.userIsAuthenticated()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e: ReactSubmitEvent) => {
        e.preventDefault()

        if (!(username && password && name && email)) {
            setIsError(true)
            setErrorMessage('Please, enter all fields!')
            return
        }

        const user: SignupInputData = {username, password, name, email}

        try {
            const response = await bookstoreApi.signup(user)
            const {accessToken} = response.data
            const data = parseJwt(accessToken)
            const authenticatedUser = {data, accessToken}

            authContext.userLoggedIn(authenticatedUser)

            setUsername('')
            setPassword('')
            setName('')
            setEmail('')
            setIsError(false)
            setErrorMessage('')
        } catch (error: any) {
            const axiosError = error as AxiosError;
            handleLogError(axiosError)
            let errorMessage = 'An unexpected error occurred. Please try again.'
            if (axiosError.response && axiosError.response.data) {
                const errorData: any = axiosError.response.data
                errorMessage = 'Invalid fields'
                if (errorData.status === 409) {
                    errorMessage = errorData.message
                } else if (errorData.status === 400) {
                    errorMessage = errorData.errors[0].defaultMessage
                }
            }
            setIsError(true)
            setErrorMessage(errorMessage)
        }
    }

    if (isLoggedIn) {
        return <Navigate to='/'/>
    }

    return (
        <Center mt='xl'>
            <Box w={450}>
                <form onSubmit={handleSubmit}>
                    <Paper withBorder p='xl' radius='md' shadow='sm'>
                        <Stack gap='sm'>
                            <TextInput
                                autoFocus
                                name='username'
                                label={t("Username")}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <PasswordInput
                                name='password'
                                label={t("Password")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextInput
                                name='name'
                                label={t("Name")}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextInput
                                name='email'
                                label={t("Email")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button type='submit' color='violet' fullWidth>
                                {t("Sign Up")}
                            </Button>
                        </Stack>
                    </Paper>
                </form>
                <Paper withBorder p='sm' radius='md' mt='sm' ta='center' shadow='sm'>
                    {t("Already have an account?") + ' '}
                    <Anchor component={NavLink} to='/login' c='violet'>
                        {t("Login")}
                    </Anchor>
                </Paper>
                {isError && (
                    <Alert color='red' variant='light' mt='sm' icon={<IconInfoCircle/>}>
                        {errorMessage}
                    </Alert>
                )}
            </Box>
        </Center>
    )
}
