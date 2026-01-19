const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">SocialUp</h3>
            <p className="text-gray-400 text-sm">
              Where interests become real connections. Join groups, attend events, and meet people who care about what you do.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Explore</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="/events" className="hover:text-white">Browse Events</a></li>
              <li><a href="/groups" className="hover:text-white">Find Groups</a></li>
              <li><a href="/events/create" className="hover:text-white">Create Event</a></li>
              <li><a href="/groups/create" className="hover:text-white">Create Group</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Your Account</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="/login" className="hover:text-white">Login</a></li>
              <li><a href="/register" className="hover:text-white">Register</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-gray-400 text-sm">
              Built for community builders, founders, and teams to create meaningful in-person and online meetups.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; 2026 SocialUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
