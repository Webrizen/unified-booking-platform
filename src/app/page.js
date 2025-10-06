import React from 'react'

export default function page() {
  return (
    <section className="bg-white dark:bg-zinc-900 transition-colors duration-300 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto py-24 px-6 text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent">
              Unified Booking
            </span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            Effortlessly manage, schedule, and optimize your bookings with our all-in-one platform.
            Designed for speed, simplicity, and scalability.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <a
              href="/signup/admin"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-800 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:border-cyan-500 dark:hover:border-cyan-400 transform hover:-translate-y-1 transition-all duration-300"
            >
              Login
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group flex flex-col items-center p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl shadow-sm hover:shadow-xl border border-zinc-200 dark:border-zinc-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl p-4 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-4 text-zinc-900 dark:text-zinc-100">Easy Scheduling</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
              Book and manage appointments with a few clicks, anytime, anywhere with our intuitive interface.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group flex flex-col items-center p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl shadow-sm hover:shadow-xl border border-zinc-200 dark:border-zinc-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl p-4 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-4 text-zinc-900 dark:text-zinc-100">Real-Time Updates</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
              Stay in sync with instant notifications and live availability across all your devices.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group flex flex-col items-center p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl shadow-sm hover:shadow-xl border border-zinc-200 dark:border-zinc-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl p-4 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-7.13a4 4 0 110 8 4 4 0 010-8z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-4 text-zinc-900 dark:text-zinc-100">Team Collaboration</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
              Invite your team and work together seamlessly on all bookings with shared calendars.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
