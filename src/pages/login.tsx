import { auth, provider } from "../config/firebase"
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export const Login = () => {
    const navigate = useNavigate()

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider)
        navigate('/')
    }

    return <div className="flex flex-col bg-white pt-20 items-center">
        <main className=" flex flex-col items-center space-y-3">
            <img src="data:image/jpeg;base64,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" alt="" />

            <svg className="animate-bounce w-6 h-6 text-gray-800" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>

            <button className="bg-blue-600 scale-100 hover:scale-110 w-full transition-transform hover:bg-blue-700 text-white font-bold py-0.5 px-4 rounded"
                onClick={signInWithGoogle}>Sign With Google</button>
            <img src="C:\Users\maluc\OneDrive\PROGRAMAÇÃO\CURSO REACT\social-media\my-project-2\logojhon.png" alt="" />
        </main>
    </div>

}