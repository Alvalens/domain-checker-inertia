import React from 'react'

export default function Navbar() {
  return (
    <div className='w-full flex justify-between p-6'>
        <div className='flex'>
            <div className='font-bold text-3xl mx-5'>logo</div>
            <ul className='flex gap-4 ms-5 items-center'>
                <li>Website</li>
                <li>Hosting</li>
                <li>Domain</li>
                <li>VPS</li>
                <li>Email</li>
                <li>Add-on</li>
            </ul>
        </div>
        <div>
            <button className='rounded-3xl border-2 px-3 py-1 border-black  font-semibold'>Login</button>
        </div>
    </div>
  )
}

