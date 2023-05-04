import { Link } from "react-router-dom"
import { auth } from "../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
import { signOut } from "firebase/auth"
import { useEffect, useRef, useState } from "react"

export const Navbar = () => {
    const [user] = useAuthState(auth)

    const singUserOut = async () => {
        const allow = window.confirm('are you sure?')
        if (!allow) return
        await signOut(auth)
    }

    const [hidden, setHidden] = useState(false)
    const handleClick = () => {
        hidden ? setHidden(false) : setHidden(true)
    }

    const topbarRef = useRef<any>()
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (topbarRef.current && !topbarRef.current.contains(event.target)) {
                setHidden(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("scroll", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("scroll", handleClickOutside);
        };
    }, []);


    return <div><div className="w-full h-16 bg-white"><div className="bg-cyan-700 z-10 w-full fixed text-white h-16">
        <div className="flex justify-between w-[95%] h-full m-auto items-center">
            <div className="flex items-center gap-4">
                {!user ?
                    <Link className="bg-blue-500 hover:bg-blue-600 scale-100 hover:scale-125  transition-transform text-white font-bold py-0.5 px-4 rounded"
                        to='/login'> Login
                    </Link>
                    :
                    <>
                        <Link className="bg-blue-500 hover:bg-blue-600 scale-100 hover:scale-110  transition-transform text-white font-bold py-0.5 px-4 rounded"
                            to='/'> Home
                        </Link>
                        <div className="z-10" ref={topbarRef}>
                            <button className="md:hidden bg-blue-500 hover:bg-blue-600 scale-100 hover:scale-110  transition-transform text-white font-bold py-0.5 px-4 rounded" onClick={handleClick}>MORE</button>
                        </div>

                        <Link className="hidden md:flex bg-blue-500 hover:bg-blue-600 scale-100 hover:scale-110  transition-transform text-white font-bold py-0.5 px-4 rounded"
                            to='createpost'> Create Post
                        </Link>
                    </>
                }
            </div>

            <div className="flex gap-3 items-center">
                {user && (
                    <>
                        <p>{user?.displayName}</p>
                        <img className=" mr-2 w-8 h-8 rounded-full " referrerPolicy="no-referrer" src={user?.photoURL || ''} />
                        <button className="hidden md:flex hover:animate-pulse transition-animation bg-blue-500 hover:bg-red-500  text-white font-bold py-0.5 px-4 rounded" onClick={singUserOut}>Log Out</button>
                    </>
                )}
            </div>
        </div>
    </div>
    </div>
        {/* cell */}
        {user && <div className={`bg-cyan-700 rounded-bl-full md:hidden rounded-br-full text-white font-bold fixed mx-auto left-0 right-0 w-[75%] z-10 h-14 transition-height duration-500 ease-in-out overflow-hidden ${hidden ? "max-h-64" : "max-h-0"
            }`}>
            <div className="w-full h-full flex items-center justify-evenly ">
                <Link className="bg-blue-500 hover:bg-blue-600 scale-100 hover:scale-110  transition-transform text-white font-bold py-0.5 px-4 rounded"
                    to='createpost'> Create Post
                </Link>
                <button className="animate-none hover:animate-pulse transition-animation bg-blue-500 hover:bg-red-500  text-white font-bold py-0.5 px-4 rounded" onClick={singUserOut}>Log Out</button>
            </div>
        </div>}
    </div >
}