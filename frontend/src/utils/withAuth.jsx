import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

// it acts like a high order function where it receives a component(WrappedComponent)
// and returns a new component that adds auth logic around it
const withAuth = (WrappedComponent) => {
    // it defines the actual wrapper component that will
    // render in place of WrappedComponent
    const AuthComponent = (props) => {
        const router = useNavigate();

        const isAuthenticated = () => {
            if(localStorage.getItem("token")){
                return true;
            }
            return false;
        }

        useEffect(()=>{
            if(!isAuthenticated()){
                router("/auth");
            }
        },[router]);

        // it renders the original component(user profile) and forward all props
        return <WrappedComponent {...props}/>
    }
    return AuthComponent;
}
export default withAuth;