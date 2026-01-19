import { Link } from 'react-router-dom';

const HeroSection = ({ copy, right, children }) => {
  return (
    <section className="rounded-3xl border border-blue-100 bg-white/60 backdrop-blur-sm shadow-sm p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
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
          {children ? <div className="mt-6">{children}</div> : null}
        </div>

        <div className="relative">
          {right ? (
            right
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white shadow-sm p-6 min-h-[220px]">
              <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-blue-100" />
              <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-indigo-100" />
              <div className="relative flex items-center justify-center h-full">
                <div className="w-full max-w-xs">
                  <div className="rounded-2xl bg-white/80 border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Live online meetup
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-blue-100" />
                    <div className="mt-2 h-2 rounded-full bg-blue-200 w-4/5" />
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="h-12 rounded-lg bg-blue-50" />
                      <div className="h-12 rounded-lg bg-indigo-50" />
                      <div className="h-12 rounded-lg bg-purple-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
