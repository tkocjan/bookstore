import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext.tsx'
import type {ReactNode} from "react";

type PrivateRouteProps = {
    children: ReactNode;
}

function PrivateRoute(props: PrivateRouteProps) {
  const { userIsAuthenticated } = useAuthContext()

  return userIsAuthenticated() ? props.children : <Navigate to='/login' />
}

export default PrivateRoute
