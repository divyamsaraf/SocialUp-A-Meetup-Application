import { Link } from 'react-router-dom';

const HeroSection = ({ copy }) => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Gradient background with subtle shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      
      <div className="relative py-16 md:py-24 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl leading-tight">
          {copy.headline}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-700 sm:text-2xl leading-relaxed">
          {copy.subheadline}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/events"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {copy.primaryCta}
          </Link>
          <Link
            to="/groups/create"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full text-lg font-semibold text-blue-700 bg-white border-2 border-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {copy.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
