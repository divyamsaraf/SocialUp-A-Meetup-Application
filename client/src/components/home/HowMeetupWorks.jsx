import { Link } from 'react-router-dom';
import LayoutContainer from '../common/LayoutContainer';

const HowMeetupWorks = () => {
  const steps = [
    {
      icon: '🔍',
      title: 'Discover events and groups',
      description: 'See who\'s hosting local events for all the things you love',
    },
    {
      icon: '👥',
      title: 'Find your people',
      description: 'Connect over shared interests, and enjoy meaningful experiences.',
    },
    {
      icon: '✨',
      title: 'Start a group to host events',
      description: 'Create your own group and grow a community around what matters to you.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <LayoutContainer>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">How Meetup works</h2>
          <p className="text-lg text-gray-600">Discover, connect, and belong</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/groups/create"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Start a group
          </Link>
        </div>
      </LayoutContainer>
    </section>
  );
};

export default HowMeetupWorks;
