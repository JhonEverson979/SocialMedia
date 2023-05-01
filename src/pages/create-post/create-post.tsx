import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"
import { auth } from "../../config/firebase"
import { CreateForm } from "./create-form"

export const CreatePost = () => {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()

    if (!user) {
        navigate('/login')
    }
    return <div>
        <CreateForm />
    </div>
}