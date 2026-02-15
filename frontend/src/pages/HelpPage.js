import React, { useState } from 'react';

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on the "Register" button in the navigation bar. Students can register directly, while faculty members need to wait for admin approval after registration.'
        },
        {
          q: 'Why is my faculty account pending approval?',
          a: 'Faculty accounts require administrator approval to ensure only authorized personnel can access faculty features. You will receive a notification once your account is approved.'
        },
        {
          q: 'How do I reset my password?',
          a: 'Currently, password reset functionality is being implemented. Please contact your system administrator for password assistance.'
        }
      ]
    },
    {
      category: 'Posting Feedback',
      questions: [
        {
          q: 'How do I create a post?',
          a: 'Students can click the "Create Post" button in the navigation bar. Fill in your feedback, select a category, provide ratings, and click "Post Feedback".'
        },
        {
          q: 'Is my feedback really anonymous?',
          a: 'Yes! Your posts are displayed with an anonymous ID instead of your real name. Only administrators can view your identity in cases of severe policy violations.'
        },
        {
          q: 'What categories can I post in?',
          a: 'You can post feedback in four categories: General (campus-wide feedback), Faculty (about professors), Course (about specific courses), and Facility (about campus facilities).'
        },
        {
          q: 'Can I edit or delete my posts?',
          a: 'Yes, you can edit or delete your own posts. Look for the edit/delete options on your posts in the feed.'
        }
      ]
    },
    {
      category: 'Ratings & Interactions',
      questions: [
        {
          q: 'How does the rating system work?',
          a: 'You can rate various aspects of your experience on a scale of 1-5 stars. The average rating is displayed on your post to give others a quick overview.'
        },
        {
          q: 'Can I like and comment on posts?',
          a: 'Yes! You can like posts by clicking the heart icon and add comments to engage in discussions. All interactions maintain your anonymity.'
        },
        {
          q: 'What happens when I flag a post?',
          a: 'Faculty and admins can flag inappropriate posts. Flagged posts are hidden from the feed and sent to administrators for review.'
        }
      ]
    },
    {
      category: 'For Faculty',
      questions: [
        {
          q: 'What can faculty members do?',
          a: 'Faculty can view all feedback, access analytics dashboards, flag inappropriate content, and engage with posts through likes and comments.'
        },
        {
          q: 'How do I access analytics?',
          a: 'Click on "Analytics" in the navigation bar to view trends, sentiment analysis, and insights from student feedback.'
        },
        {
          q: 'When should I flag a post?',
          a: 'Flag posts that contain harassment, hate speech, false information, or violate community guidelines. Provide a clear reason when flagging.'
        }
      ]
    },
    {
      category: 'For Administrators',
      questions: [
        {
          q: 'How do I approve faculty registrations?',
          a: 'Navigate to "Approvals" in the admin menu. Review pending faculty registrations and click "Approve" or "Reject" for each application.'
        },
        {
          q: 'How do I handle flagged posts?',
          a: 'Go to "Moderation" to view all flagged posts. You can dismiss the flag (restore the post), suspend the user temporarily, or ban them permanently.'
        },
        {
          q: 'Can I manage rating categories?',
          a: 'Yes! Visit "Categories" in the admin menu to add, edit, or remove rating categories that students can use when posting feedback.'
        }
      ]
    },
    {
      category: 'Privacy & Security',
      questions: [
        {
          q: 'Who can see my real identity?',
          a: 'Your identity is protected by an anonymous ID system. Only administrators can view your real identity, and only in cases of severe policy violations requiring disciplinary action.'
        },
        {
          q: 'What information is stored about me?',
          a: 'We store your name, email, role, and anonymous ID. Your posts are linked to your anonymous ID, not your real identity.'
        },
        {
          q: 'How is my data protected?',
          a: 'We use industry-standard encryption for passwords, secure authentication tokens, and follow best practices for data protection.'
        }
      ]
    },
    {
      category: 'Troubleshooting',
      questions: [
        {
          q: 'I can\'t see any posts in the feed',
          a: 'Make sure you\'re logged in and have a stable internet connection. Try refreshing the page or checking your filter settings.'
        },
        {
          q: 'My post isn\'t showing up',
          a: 'Posts appear immediately after creation. If you don\'t see your post, try refreshing the page. If it was flagged, it may be hidden pending review.'
        },
        {
          q: 'The dark mode isn\'t working',
          a: 'Click the theme toggle button (sun/moon icon) in the navigation bar to switch between light and dark modes.'
        },
        {
          q: 'I\'m getting an error when posting',
          a: 'Ensure your feedback content is not empty and is under 500 characters. Check your internet connection and try again.'
        }
      ]
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions and learn how to use FeedbackHub
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <a
            href="#getting-started"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learn the basics of using FeedbackHub</p>
          </a>

          <a
            href="#posting"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Posting Feedback</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">How to create and manage your posts</p>
          </a>

          <a
            href="#privacy"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy & Security</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Understand how we protect your data</p>
          </a>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{section.category}</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {section.questions.map((faq, faqIndex) => {
                  const globalIndex = `${sectionIndex}-${faqIndex}`;
                  const isOpen = openFaq === globalIndex;
                  
                  return (
                    <div key={faqIndex}>
                      <button
                        onClick={() => toggleFaq(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-primary-100 mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
