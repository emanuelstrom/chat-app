import React from 'react'

export default function Message({ yes }) {
    return (
        <div
            className={`bg-green-300 py-1.5 px-2 rounded-lg mb-2${
                yes ? ' self-end' : ''
            }`}
        >
            message {yes + ''}
        </div>
    )
}
