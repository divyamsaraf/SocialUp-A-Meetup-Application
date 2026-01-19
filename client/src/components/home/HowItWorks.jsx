const steps = [
  {
    title: "Pick your interests",
    description: "Choose categories and find groups that match what you care about.",
  },
  {
    title: "Join events that fit",
    description: "Attend online or in-person meetups, workshops, and hangouts.",
  },
  {
    title: "Build real connections",
    description: "RSVP, chat, and keep momentum with people who share your goals.",
  },
];

const HowItWorks = () => {
  const icons = ['🎯', '🗓️', '🤝'];
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <div key={step.title} className="text-center">
            <div className="text-4xl mb-3">{icons[idx]}</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">{step.title}</div>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
