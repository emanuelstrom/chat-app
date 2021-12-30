import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
function InputField({ onChange, value, title, placeholder }) {
    return (
        <div className='mb-3'>
            <p className='text-xs mb-1'>{title}</p>
            <input
                className='outline-none border border-black rounded-md py-1 px-2 focus-within:border-theme focus-within:text-theme placeholder:text-gray-400/70'
                type='text'
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default function Register() {
    const { signup, currentUser } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (currentUser) router.replace('/')
    }, [currentUser, router])

    return (
        <div className='h-screen'>
            <div className='shadow-lg rounded-md border border-gray-200 mx-auto my-[10vh] max-w-3xl h-[80vh] p-6'>
                <h2 className='text-3xl font-bold text-theme mb-4'>
                    Register to our chat app!☺️
                </h2>
                <InputField
                    title='Email'
                    value={email}
                    onChange={setEmail}
                    placeholder={'Email...'}
                />
                <InputField
                    title='Password'
                    value={password}
                    onChange={setPassword}
                    placeholder={'Password...'}
                />
                <InputField
                    title='Display name'
                    value={displayName}
                    placeholder={'Display name...'}
                    onChange={setDisplayName}
                />
                {error && (
                    <p className='text-semibold text-red-500'>
                        Something went wrong
                    </p>
                )}

                <div>
                    <button
                        className='bg-theme text-white rounded-md py-1 px-3'
                        onClick={async () => {
                            const error = await signup(
                                email,
                                password,
                                displayName
                            )
                            if (error) {
                                setError(error)
                            } else {
                                router.replace('/')
                            }
                        }}
                    >
                        sign up
                    </button>
                </div>
            </div>
        </div>
    )
}
