import { getDocs, collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../../config/firebase"
import { Post } from "./post"

export interface Post {
    id: string
    userId: string
    title: string
    username: string
    description: string
    img: string
    userImageProfile: string
}

export const Main = () => {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()

    if (!user) {
        navigate('/login')
    }
    const [postsList, setpostsList] = useState<Post[] | null>(null)
    const postsRef = collection(db, 'posts')

    const getPosts = async () => {
        const data = await getDocs(postsRef)
        setpostsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[])
    }
    useEffect(() => {
        getPosts()

    }, [])

    return <div className="text-center">{postsList?.map((post) => <Post post={post} />)}</div>
}