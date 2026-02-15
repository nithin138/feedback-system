import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">About FeedbackHub</h1>
            <p className="text-xl text-primary-100">
              Empowering students to share their voice anonymously
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-10 space-y-8">
            {/* Mission */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                FeedbackHub is a comprehensive feedback management system designed to create a safe, 
                anonymous platform where students can share honest feedback about their educational 
                experience. We believe that every student's voice matters and should be heard without 
                fear of judgment or repercussion.
              </p>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Anonymous Posting</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Share feedback without revealing your identity, ensuring honest and unbiased opinions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Content Moderation</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Faculty and admins can flag inappropriate content to maintain a respectful community.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Rating System</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rate various aspects of your experience with our intuitive 5-star rating system.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Faculty and admins can view insights and trends from student feedback.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Roles */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Roles</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Students</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Post anonymous feedback, rate experiences, engage with other posts through likes and comments.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Faculty</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View feedback, access analytics, flag inappropriate content, and engage with student posts.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Administrators</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Approve faculty registrations, moderate flagged content, manage rating categories, and oversee the entire system.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy & Security</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We take your privacy seriously. Student identities are protected through our anonymous ID system, 
                ensuring that feedback cannot be traced back to individual students. Only administrators have 
                access to identity information in cases of severe policy violations.
              </p>
              <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <p className="text-sm text-primary-800 dark:text-primary-200">
                  <strong>Note:</strong> While we protect your anonymity, please remember to follow community 
                  guidelines and maintain respectful communication at all times.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Have questions or suggestions? We'd love to hear from you!
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/help"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Visit Help Center
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
