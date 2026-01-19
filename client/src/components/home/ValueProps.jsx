const ValueProps = ({ items }) => {
  return (
    <section className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm p-6 text-center flex flex-col items-center gap-3"
          >
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-50 text-2xl">
              {item.icon}
            </div>
            <p className="text-gray-800 font-semibold">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValueProps;
