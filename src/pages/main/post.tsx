import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../config/firebase"
import { Post as IPost } from "./main"

interface Props {
    post: IPost
}

interface Like {
    userId: string
    likeId: string
}

export const Post = (props: Props) => {
    //like
    const { post } = props
    const [likes, setLikes] = useState<Like[] | null>(null)
    const [user] = useAuthState(auth)
    const likesRef = collection(db, 'likes')
    const likesDoc = query(likesRef, where('postId', '==', post.id))
    const getLikes = async () => {
        const data = await getDocs(likesDoc)
        setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })))
    }


    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, { userId: user?.uid, postId: post.id })
            if (user) {
                setLikes((prev) => prev ? [...prev, { userId: user?.uid, likeId: newDoc.id }] : [{ userId: user?.uid, likeId: newDoc.id }])
            }
        } catch (err) {
            console.log(err)
        }
    }

    const removeLike = async () => {
        try {
            const likeToDeleteQuery = query(likesRef, where('postId', '==', post.id), where('userId', '==', user?.uid))
            const likeToDeleteData = await getDocs(likeToDeleteQuery)
            const likeToDelete = doc(db, 'likes', likeToDeleteData.docs[0].id)
            await deleteDoc(likeToDelete)

            if (user) {
                setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeToDeleteData.docs[0].id))
            }
        } catch (err) {
            console.log(err)
        }
    }


    const hasUserLiked = likes?.find((like) => like.userId === user?.uid)

    useEffect(() => {
        getLikes()
    }, [])
    //stop like

    //started comments
    interface CommentsInt {
        comment: string
        commentUserImage: string | null | undefined
        commentUserName: string | null | undefined
        postId: string
    }


    const [currentComments, setcurrentComments] = useState<string>('')
    const [comments, setComments] = useState<CommentsInt[] | null>(null)
    const [hidden, setHidden] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const inputRef2 = useRef<HTMLInputElement>(null)

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => setcurrentComments(e.target.value)

    const commentsRef = collection(db, 'comments')
    const commentsDoc = query(commentsRef, where('postId', '==', post.id))

    const getComments = async () => {
        const data = await getDocs(commentsDoc)
        setComments(data.docs.map(doc => doc.data()) as CommentsInt[])
    }

    const addComments = async () => {
        if (currentComments === '') {
            return
        }

        await addDoc(commentsRef, { postId: post.id, comment: currentComments, commentUserImage: user?.photoURL, commentUserName: user?.displayName })
        setComments((prev) => prev ? [...prev, { postId: post.id, comment: currentComments, commentUserImage: user?.photoURL, commentUserName: user?.displayName }] : [{ postId: post.id, comment: currentComments, commentUserImage: user?.photoURL, commentUserName: user?.displayName }])
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        if (inputRef2.current) {
            inputRef2.current.value = "";
        }

        setcurrentComments('')

        setHidden(true)
    }

    useEffect(() => {
        getComments()
    }, [])
    //stop comments
    //start commentButton

    const handleButtonHidden = () => {
        hidden ? setHidden(false) : setHidden(true)
    }

    //stop commentButton

    return <div className="  flex flex-col items-center w-[100%] sm:w-[50%] lg:w-[45%] xl:w-[40%] m-auto bg-white pt-4 border-b-2 border-slate-300 pb-1">
        <div className="flex flex-col space-y-1 w-full  bg-white text-black/90" >
            <div className="flex flex-col items-start pl-2 justify-start w-full h-full">
                <div className="flex space-x-1 w-full">
                    <img className=" w-8 h-8 rounded-full " src={post?.userImageProfile} alt="" />
                    <p>{post.username}</p>
                </div>
                <div className="w-full flex flex-col items-start ">
                    <h1 className="break-words text-xl font-semibold">{post.title}</h1>
                    <p className="break-words ">{post.description}</p>
                </div>
            </div>
            <div className="">
                <img className="max-h-[600px] lg:max-h-[500px] h-auto w-full  " src={post.img} alt="" />
            </div>
            <div className=" flex space-x-3 justify-between items-center">
                <div className="flex pl-2 h-7 items-center">
                    <button className="" onClick={hasUserLiked ? removeLike : addLike}>{hasUserLiked ? <>&#128078;</> : <>&#128077; </>}</button>
                    {likes && <p>{likes.length}</p>}
                    <button className="ml-2" onClick={handleButtonHidden}> &#x1F4AC; Comments: {comments && comments.length}</button>
                </div>
                <div className="hidden lg:flex pr-2 space-x-2">
                    <input placeholder="let a Comment..." className="border-2 border-blue-400" ref={inputRef2} onChange={handleInput} type='text' />
                    <button className="bg-blue-500 hover:bg-blue-600 scale-100 hover:scale-110  transition-transform text-white font-bold py-0.5 px-4 rounded" onClick={addComments}>Send</button>
                </div>
            </div>
            <div className={`transition-height duration-500 ease-in-out overflow-auto ${hidden ? "max-h-64" : "max-h-0"
                }`}>
                <div className="pl-1 space-x-2 flex items-center justify-start lg:hidden">   {/* celula */}
                    <input placeholder="let a Comment..." className="border-2 border-blue-400" ref={inputRef} onChange={handleInput} type='text' />
                    <button className="bg-blue-500 hover:bg-blue-600 scale-100 hover:scale-110  transition-transform text-white font-bold py-0.5 px-4 rounded" onClick={addComments}>Send</button>
                </div>
                {comments && comments.map((com: CommentsInt) => {
                    return <div className="flex space-x-1 border-b-2 py-1 items-center">

                        <div className="">
                            <img className=" w-7 h-7 rounded-full" src={com.commentUserImage || ''} alt="" />
                        </div>
                        <div className="flex flex-col items-start">
                            <p className=" text-xs font-bold">{com.commentUserName}:</p>
                            <p className="text-sm font-semibold">{com.comment}</p>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
}
