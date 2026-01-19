const EventsIntroBanner = ({ show, text }) => {
  if (!show) return null;

  return (
    <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-blue-900">
      {text}
    </div>
  );
};

export default EventsIntroBanner;
