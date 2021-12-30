import React, { createContext, useContext, useState, useEffect } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth, fs } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

async function signup(email, password, displayName) {
    try {
        await createUserWithEmailAndPassword(auth, email, password).then(
            ({ user }) => {
                if (!user) return
                if (!displayName) return alert('no display name')

                setDoc(doc(fs, 'users', user.uid), {
                    displayName,
                    email,
                    userUID: user.uid,
                })
            }
        )
    } catch (error) {
        return error
    }
}

function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
}

function logout() {
    sessionStorage.clear()

    return auth.signOut()
}

async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email)
    } catch (error) {
        return error.message
    }
}

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [fetchingUser, setFetchingUser] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setCurrentUser(null)
                setFetchingUser(false)
                return
            }

            setFetchingUser(true)
            const response = await getDoc(doc(fs, 'users', user.uid))
            console.log('response: ', response)
            const data = { ...user, ...response.data() }
            setFetchingUser(false)
            setCurrentUser(data)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        fetchingUser,
        login,
        signup,
        logout,
        resetPassword,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
