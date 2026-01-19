import CategoryCard from './CategoryCard';

const CategoryGrid = ({ categories }) => {
  return (
    <section className="mt-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
