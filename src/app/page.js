import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <section >
      <div className="max-w-4xl mx-auto py-24 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-100 mb-6">
          Welcome to <span className="text-blue-600">Unified Booking Platform</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-zinc-600 mb-10">
          Effortlessly manage, schedule, and optimize your bookings with our all-in-one platform. Designed for speed, simplicity, and scalability.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link
            href="/signup/admin"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Create Admin Account
          </Link>
          <a
            href="/signup"
            className="inline-block px-8 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-lg shadow hover:bg-blue-50 transition"
          >
            Create user Account
          </a>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Easy Scheduling</h3>
            <p className="text-zinc-500 text-center">Book and manage appointments with a few clicks, anytime, anywhere.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Real-Time Updates</h3>
            <p className="text-zinc-500 text-center">Stay in sync with instant notifications and live availability.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-7.13a4 4 0 110 8 4 4 0 010-8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Team Collaboration</h3>
            <p className="text-zinc-500 text-center">Invite your team and work together seamlessly on all bookings.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
