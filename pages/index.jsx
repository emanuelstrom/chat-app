import React, { useEffect, useState, useRef } from 'react'
import styles from '../styles/Home.module.css'
import { fs } from '../firebase'
import {
    doc,
    getDoc,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import Message from '../components/Message'

export default function Home() {
    const { signup, currentUser, fetchingUser, logout } = useAuth()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const dummyRef = useRef(null)

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(fs, 'messages'), orderBy('createdAt', 'asc')),
            (snapshot) => {
                console.log('snapshot: ', snapshot)
                setMessages(
                    snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                )
                dummyRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        )
        return unsubscribe
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        await addDoc(collection(fs, 'messages'), {
            text: message,
            authorId: currentUser.uid,
            authorName: currentUser.displayName,
            createdAt: new Date(),
        })
        setMessage('')
        dummyRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    console.log('messages: ', messages)
    console.log('currentUser: ', currentUser)

    return (
        <div className='h-screen flex flex-col overflow-hidden'>
            <div className='flex flex-col items-start mx-3 my-1 h-full overflow-y-scroll'>
                {messages.map((message) => {
                    return <Message key={message.id} message={message} />
                })}
                <div ref={dummyRef} />
            </div>

            <div className='bg-black flex-shrink-0'>
                <h2 className='text-lg font-bold text-theme'>
                    {currentUser?.displayName}
                </h2>
                <form className='bg-pink-500 flex' onSubmit={handleSubmit}>
                    <input
                        className='rounded-md border border-black py-1 px-2 outline-none focus-within:border-theme'
                        type='text'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </form>
                <button onClick={logout} className='bg-error p-2 rounded-md'>
                    logout
                </button>

                <input
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type='text'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type='text'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <button onClick={() => signup(email, password, displayName)}>
                    sign up
                </button>
            </div>
        </div>
    )
}
