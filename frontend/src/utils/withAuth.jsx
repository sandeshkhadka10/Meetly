import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

// it acts like a high order function where it receives a component(WrappedComponent)
// and returns a new component that adds auth logic around it
const withAuth = (WrappedComponent) => {
    // it defines the actual wrapper component that will
    // render in place of WrappedComponent
    const AuthComponent = (props) => {
        const router = useNavigate();
        const [loading,setLoading] = useState(true);

        useEffect(()=>{
            const checkAuth = async()=>{
                try{
                    const response = await axios.get("http://localhost:8000/api/v1/users/auth/verify",{
                        withCredentials:true
                    });
                    setLoading(false);
                }catch(error){
                    router("/auth");
                }
            };
            checkAuth();
        },[router]);
        
        // it renders the original component(user profile) and forward all props
        return <WrappedComponent {...props}/>
    }
    return AuthComponent;
}
export default withAuth;