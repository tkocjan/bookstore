import {createContext, useContext, useState, useEffect} from 'react'
import type {ReactNode} from 'react';

interface IAuthContext {
    jwtUserData: IJwtUserData|null;
    getJwtUserData: () => IJwtUserData|null;
    userIsAuthenticated: () => boolean;
    userLoggerIn: (user: any) => void;
    userLoggedOut: () => void;
}

export interface IJwtUserData {
    data: {
        iat: number;
        exp: number;
        jti: string;
        iss: string;
        aud: string[];
        sub: string;
        rol: string[];
        name: string;
        preferred_username: string;
        email: string;
    },
    accessToken: string
}

export function getJwtUserData(): IJwtUserData|null {
    const jwtUserDataJson = localStorage.getItem('com.abidimi.bookstore.user');
    return jwtUserDataJson
        ? JSON.parse(jwtUserDataJson) as IJwtUserData
        : null;
}

const AuthContext = createContext<IAuthContext>({
    jwtUserData: null,
    getJwtUserData: () => null,
    userIsAuthenticated: () => false,
    userLoggerIn: () => {},
    userLoggedOut: () => {}
});

interface AppProviderProps {
    children: ReactNode;
}

function AuthProvider({children}: AppProviderProps) {
    const [jwtUserData, setJwtUserData] = useState<IJwtUserData | null>(null)

    const getJwtUserData = (): IJwtUserData|null => {
        const jwtUserDataJson = localStorage.getItem('com.abidimi.bookstore.user');
        return jwtUserDataJson
            ? JSON.parse(jwtUserDataJson) as IJwtUserData
            : null;
    }

    useEffect(() => {
        // const storedUserStr = localStorage.getItem('com.abidimi.bookstore.user');
        // const storedUser = storedUserStr
        //     ? JSON.parse(storedUserStr) as UserData
        //     : null;
        setJwtUserData(getJwtUserData());
    }, [])

    const userIsAuthenticated = (): boolean => {
        const jwtUserData = getJwtUserData();
        // let jwtUserDataJson = localStorage.getItem('com.abidimi.bookstore.user')
        if (!jwtUserData) {
            return false
        }
        // jwtUserData = JSON.parse(jwtUserDataJson)

        // if user has token expired, logout user
        // @ts-ignore
        if (Date.now() > jwtUserData.data.exp * 1000) {
            userLoggedOut()
            return false
        }

        return true
    }

    const userLoggedIn = (jwtUserData: IJwtUserData): void => {
        localStorage.setItem('com.abidimi.bookstore.user', JSON.stringify(jwtUserData))
        setJwtUserData(jwtUserData)
    }

    const userLoggedOut = (): void => {
        localStorage.removeItem('com.abidimi.bookstore.user')
        setJwtUserData(null)
    }

    const contextValue: IAuthContext = {
        jwtUserData: jwtUserData,
        getJwtUserData: getJwtUserData,
        userIsAuthenticated,
        userLoggerIn: userLoggedIn,
        userLoggedOut: userLoggedOut
    };

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    )
}

// export default AuthContext

export function useAuth(): IAuthContext {
    return useContext(AuthContext)
}

export {AuthProvider}
