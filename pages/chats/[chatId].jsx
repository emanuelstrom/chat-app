import React, { useEffect, useState, useRef } from 'react'
import { fs } from '../../firebase'
import {
    doc,
    getDoc,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import Message from '../../components/Message'
import { useRouter } from 'next/router'
export default function Home() {
    const { currentUser, fetchingUser } = useAuth()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [chatRoom, setChatRoom] = useState({})
    const dummyRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(fs, `chats/${router.query.chatId}/messages`),
                orderBy('createdAt', 'asc')
            ),
            (snapshot) => {
                setMessages(
                    snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                )
                dummyRef.current.scrollIntoView()
            }
        )
        getDoc(doc(fs, 'chats', router.query.chatId)).then((doc) => {
            setChatRoom(doc.data())
        })
        return unsubscribe
    }, [router.query.chatId])

    useEffect(() => {
        if (!currentUser && !fetchingUser) router.replace('/register')
    }, [currentUser, router, fetchingUser])

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage('')
        await addDoc(collection(fs, `chats/${router.query.chatId}/messages`), {
            text: message,
            authorId: currentUser.uid,
            authorName: currentUser.displayName,
            createdAt: new Date(),
        })
        dummyRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className='h-screen flex flex-col overflow-hidden'>
            <div className='flex-shrink-0 border-b border-b-gray-200 p-2'>
                <h2 className='text-3xl font-extrabold'>{chatRoom.name}</h2>
            </div>
            <div className='flex flex-col items-start mx-3 my-3 h-full overflow-y-scroll'>
                {messages.length === 0 && (
                    <h2 className='text-center w-full text-3xl text-gray-500/90'>
                        Det finns inga medelanden i denna chat, var fört och
                        skriv!
                    </h2>
                )}
                {messages.map((message) => {
                    return <Message key={message.id} message={message} />
                })}
                <div ref={dummyRef} />
            </div>
            <div className='flex-shrink-0 border-t border-t-gray-200 pt-2'>
                <form className='p-2 flex items-center' onSubmit={handleSubmit}>
                    <input
                        className='rounded-xl border w-full border-black py-2 px-3 outline-none focus-within:border-theme'
                        type='text'
                        value={message}
                        placeholder='Type your message...'
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className='bg-theme text-white rounded-md py-1 px-3 ml-2'
                        onClick={handleSubmit}
                    >
                        Send
                    </button>
                </form>

                {/* <p className='text-white'>{JSON.stringify(messages)}</p> */}
            </div>
        </div>
    )
}
