import { Link } from 'react-router-dom';

const HeroSection = ({ copy, children }) => {
  return (
    <section className="rounded-3xl border border-blue-100 bg-white/70 backdrop-blur-sm shadow-sm p-6 md:p-10 flex flex-col gap-6">
      <div className="text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          {copy.headline}
        </h1>
        <p className="mt-3 text-base text-gray-600 sm:text-lg">
          {copy.subheadline}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/events"
            className="inline-flex items-center justify-center px-7 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition"
          >
            {copy.primaryCta}
          </Link>
          <Link
            to="/groups/create"
            className="inline-flex items-center justify-center px-7 py-3 rounded-md border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 active:bg-blue-100 transition"
          >
            {copy.secondaryCta}
          </Link>
        </div>
      </div>

      {children ? <div>{children}</div> : null}
    </section>
  );
};

export default HeroSection;
