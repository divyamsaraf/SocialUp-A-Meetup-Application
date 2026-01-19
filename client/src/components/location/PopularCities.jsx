const PopularCities = ({ cities, onSelect }) => {
  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-gray-500 mb-2">Popular cities</div>
      <div className="flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:gap-2 md:overflow-visible">
        {cities.map((c) => (
          <button
            key={`${c.city}-${c.state || ''}`}
            type="button"
            onClick={() => onSelect(c)}
            className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {c.city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularCities;

