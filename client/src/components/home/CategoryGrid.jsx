import CategoryCard from './CategoryCard';

const CategoryGrid = ({ categories }) => {
  return (
    <section className="mt-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.key} {...category} />
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
