import { Navigate } from 'react-router'
import { useAuthContext } from '../context/AuthContext.tsx'
import type {ReactNode} from "react";

type PrivateRouteProps = {
    children: ReactNode;
}

export default function PrivateRoute(props: PrivateRouteProps) {
  const { userIsAuthenticated } = useAuthContext()

  return userIsAuthenticated() ? props.children : <Navigate to='/login' />
}
