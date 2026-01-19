import CategoryCard from './CategoryCard';
import { spacing } from '../../theme';

const CategoryGrid = ({ categories }) => {
  return (
    <section style={{ marginTop: spacing[14] || spacing[12] }}>
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={{ gap: spacing[4] }}
      >
        {categories.map((category) => {
          const { key, ...categoryProps } = category;
          return (
            <CategoryCard key={key || category.title || category.name} {...categoryProps} />
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
