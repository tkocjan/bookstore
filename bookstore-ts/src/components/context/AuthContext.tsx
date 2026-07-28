import {createContext, useContext, useState, useEffect} from 'react'
import type {ReactNode} from 'react';

type AuthContextValue = {
    jwtUserData: JwtUserData|null;
    getJwtUserData: () => JwtUserData|null;
    userIsAuthenticated: () => boolean;
    userLoggedIn: (user: any) => void;
    userLoggedOut: () => void;
}

export type JwtUserData = {
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

export function getJwtUserData(): JwtUserData|null {
    const jwtUserDataJson = localStorage.getItem('com.abidimi.bookstore.user');
    return jwtUserDataJson
        ? JSON.parse(jwtUserDataJson) as JwtUserData
        : null;
}

export function getUserRole(): string|null {
    const jwtUserData = getJwtUserData();
    return jwtUserData
        ? jwtUserData.data.rol[0]
        : null;
}

const AuthContext = createContext<AuthContextValue>({
    jwtUserData: null,
    getJwtUserData: () => null,
    userIsAuthenticated: () => false,
    userLoggedIn: () => {},
    userLoggedOut: () => {}
});

type AppProviderProps = {
    children: ReactNode;
}

function AuthProvider({children}: AppProviderProps) {
    const [jwtUserData, setJwtUserData] = useState<JwtUserData | null>(null)

    const getJwtUserData = (): JwtUserData|null => {
        const jwtUserDataJson = localStorage.getItem('com.abidimi.bookstore.user');
        return jwtUserDataJson
            ? JSON.parse(jwtUserDataJson) as JwtUserData
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

    const userLoggedIn = (jwtUserData: JwtUserData): void => {
        localStorage.setItem('com.abidimi.bookstore.user', JSON.stringify(jwtUserData))
        setJwtUserData(jwtUserData)
    }

    const userLoggedOut = (): void => {
        localStorage.removeItem('com.abidimi.bookstore.user')
        setJwtUserData(null)
    }

    const contextValue: AuthContextValue = {
        jwtUserData: jwtUserData,
        getJwtUserData: getJwtUserData,
        userIsAuthenticated: userIsAuthenticated,
        userLoggedIn: userLoggedIn,
        userLoggedOut: userLoggedOut
    };

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    )
}

// export default AuthContext

export function useAuthContext(): AuthContextValue {
    return useContext(AuthContext)
}

export {AuthProvider}
