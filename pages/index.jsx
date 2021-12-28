import React, { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { fs } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import Message from '../components/Message'

export default function Home() {
    const { signup, currentUser, fetchingUser, logout } = useAuth()
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    // const [displayName, setDisplayName] = useState('')

    useEffect(() => {
        const ref = doc(fs, 'hej', 'pådig')
        getDoc(ref).then((data) => {
            console.log('data', data.data())
        })
    }, [])

    return (
        <div className='bg-blue-500'>
            <div className='bg-red-600 flex flex-col items-start'>
                <Message yes />
                <Message />
                <Message />
                <Message yes />
            </div>
            {currentUser.displayName}
            {currentUser.email}
        </div>
    )
}
