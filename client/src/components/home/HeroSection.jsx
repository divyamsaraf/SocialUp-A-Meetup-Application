import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection = ({ copy, children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        {copy.headline}
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
        {copy.subheadline}
      </p>
      <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-3">
        <Link
          to="/events"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {copy.primaryCta}
        </Link>
        {!isAuthenticated && (
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
          >
            {copy.secondaryCta}
          </Link>
        )}
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
};

export default HeroSection;
