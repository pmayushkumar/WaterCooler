import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Water Cooler
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            AI-powered conversation starters that help you build deeper relationships with colleagues.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
          <ol className="space-y-4 text-gray-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <strong>Create your profile</strong> — Tell us where you grew up and where you live now. This helps us explain your colleagues&apos; cultural context in terms you understand.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <strong>Add colleagues</strong> — Share their background, interests, and anything personal you know. The more you tell us, the better the conversation starters.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <strong>Get conversation starters</strong> — Receive personalized conversation starters for each colleague, based on real-time events relevant to their interests.
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What makes it special</h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><strong>Cultural bridge</strong> — Events are explained using analogies from your own background. If your colleague follows cricket and you grew up in Canada, we&apos;ll compare IPL to the NHL playoffs.</li>
            <li><strong>Real-time relevance</strong> — Starters are based on current events, sports results, festivals, and food trends happening right now.</li>
            <li><strong>Safe topics only</strong> — No politics, religion, or controversy. Only sports, food, festivals, hobbies, and human interest stories.</li>
          </ul>
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 font-bold text-lg"
          >
            Get Started
          </Link>
          <p className="text-sm text-gray-500">
            Already registered?{' '}
            <Link href="/colleagues/add" className="text-blue-600 hover:underline">
              Add a colleague
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
