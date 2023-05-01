import { useForm } from "react-hook-form"
import { addDoc, collection } from "firebase/firestore"
import { auth, db } from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useImagePreview } from "../../components/useImage"

interface CreateFormData {
    title: string,
    description: string
    like: number
    userlike: []
}

export const CreateForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateFormData>()

    const [file, setFile] = useState(null)
    const image: any = useImagePreview(file)

    //comecei o database aki
    const postsRef = collection(db, 'posts')
    const [user] = useAuthState(auth)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)                          //t


    const onCreatePost = async (data: CreateFormData) => {     //t
        try {
            setLoading(true)                     //t
            await addDoc(postsRef, {
                ...data,
                username: user?.displayName,
                userId: user?.uid,
                img: image,
                userImageProfile: user?.photoURL
            })
            setLoading(false)
            navigate('/')
        } catch {
            setLoading(false)
            alert('file must be less than 1mb')
        }
    }                                                         //t
    //terminei

    const handdleImage = (e: any) => {
        setFile(e.target.files[0])
    }

    return <form className="flex flex-col pt-20 items-center bg-white" onSubmit={handleSubmit(onCreatePost)}>
        <div className="bg-cyan-700/80 p-10 rounded-md space-y-2 text-center">
            <h1 className="text-white font-serif text-xl">Create a Post</h1>
            <input className="w-full bg-cyan-200/90 rounded-sm" placeholder="title..." {...register('title', { required: true, pattern: /^.{1,30}$/ })} />

            {errors.title && <p className="text-red-600 font-bold mt-0">you must add a title (1,20 caracters)</p>}

            <textarea className="w-full bg-cyan-200/90 rounded-sm" placeholder="Description..." {...register('description', { pattern: /^.{0,40}$/ })} />

            {errors.description && <p className="text-red-600/100 font-bold"> max lenght(40)</p>}

            <p className=" text-white">Add a photo (maximum size: 1mb)</p>
            <svg className="animate-bounce m-auto w-6 h-6 text-gray-800" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            <input className="bg-blue-500 w-full hover:bg-blue-600 scale-100 hover:scale-110  transition-transform text-white font-bold py-0.5 px-4 rounded" type="file" onChange={handdleImage} />
            {image && <img className="" src={image} alt="Preview" />}

            {loading && <div
                className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
            </div>}

            <input className="bg-blue-500 w-full hover:bg-blue-600 scale-100 hover:scale-110  transition-transform text-white font-bold py-0.5 px-4 rounded" type='submit' />
        </div>
    </form>
}

