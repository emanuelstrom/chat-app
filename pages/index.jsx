import React, { useEffect, useState, useRef } from 'react'
import { fs } from '../firebase'
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    updateDoc,
    doc,
    arrayUnion,
} from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
    const { currentUser, fetchingUser, logout } = useAuth()
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!currentUser) return
        setLoading(true)
        const unsubscribe = onSnapshot(
            query(
                collection(fs, 'chats'),
                where('participants', 'array-contains', currentUser.uid)
            ),
            (snapshot) => {
                setChats(
                    snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                )
                setLoading(false)
            }
        )
        return unsubscribe
    }, [currentUser])

    async function addChat() {
        const name = prompt('Vad ska chaten heta?')
        if (name) {
            await addDoc(collection(fs, 'chats'), {
                name,
                participants: [currentUser.uid],
            })
        }
    }

    async function joinChat() {
        const id = prompt('Vad är chat id´t?')
        if (id) {
            try {
                const docRef = doc(fs, 'chats', id)
                await updateDoc(docRef, {
                    participants: arrayUnion(currentUser.uid),
                })
            } catch (error) {
                alert('could not find room')
            }
        }
    }

    useEffect(() => {
        if (!currentUser && !fetchingUser) router.replace('/register')
    }, [currentUser, router, fetchingUser])

    return (
        <div className='h-screen'>
            <div className='shadow-lg rounded-md border border-gray-200 mx-auto my-[10vh] max-w-3xl h-[80vh] p-6'>
                <div className='flex'>
                    <button
                        className='bg-theme text-white rounded-md py-1 px-3 mb-2 mr-2'
                        onClick={addChat}
                    >
                        Create chat
                    </button>
                    <button
                        className='text-theme border border-gray-200 rounded-md py-1 px-3 mb-2'
                        onClick={joinChat}
                    >
                        Join chat
                    </button>
                    <button
                        className='text-red-600 bg-red-100 border border-red-700 rounded-md py-1 px-3 mb-2 ml-auto'
                        onClick={async () => {
                            await logout()
                            router.replace('/register')
                        }}
                    >
                        Logout from {currentUser?.displayName}
                    </button>
                </div>

                {loading && (
                    <div className='mx-auto w-8 h-8 border-4 rounded-full border-gray-300 border-t-gray-500 animate-spin'></div>
                )}
                {chats.map((chat) => (
                    <Link
                        key={chat.id}
                        href={`chats/${chat.id}`}
                        passHref={true}
                    >
                        <div className='flex items-center justify-between border border-gray-200 mb-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer transition-colors'>
                            {chat.name}
                            <p className='text-theme text-xs'>
                                {chat.participants?.length} participant
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
