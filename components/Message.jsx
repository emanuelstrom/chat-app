import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Message({ message }) {
    const { currentUser } = useAuth()

    return (
        <div
            className={`py-1.5 px-2 rounded-lg mb-2 max-w-[70vw] break-words ${
                currentUser?.uid === message.authorId
                    ? ' self-end bg-theme text-white'
                    : 'border'
            }`}
        >
            {message.text}
            <p
                className={`text-xs mt-1 ${
                    currentUser?.uid === message.authorId
                        ? ' text-gray-800'
                        : 'text-gray-500'
                }`}
            >
                {message.authorName}
            </p>
        </div>
    )
}
