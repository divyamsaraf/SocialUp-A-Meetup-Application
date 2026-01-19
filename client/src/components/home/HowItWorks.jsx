import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';

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
    <section style={{ marginTop: spacing[12] }}>
      <h2 
        className="text-center"
        style={{
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.text.primary,
          marginBottom: spacing[6],
        }}
      >
        How it works
      </h2>
      <div 
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ gap: spacing[6] }}
      >
        {steps.map((step, idx) => (
          <div key={step.title} className="text-center">
            <div 
              style={{
                fontSize: typography.fontSize['4xl'],
                marginBottom: spacing[3],
              }}
            >
              {icons[idx]}
            </div>
            <div 
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
                marginBottom: spacing[2],
              }}
            >
              {step.title}
            </div>
            <p 
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
