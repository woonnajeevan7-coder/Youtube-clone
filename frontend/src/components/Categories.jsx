import './Categories.css';

const categoriesList = [
  'All',
  'Gaming',
  'Music',
  'Education',
  'Technology',
  'Sports',
  'Lifestyle',
  'Fitness',
  'News',
  'Live',
];

const Categories = ({ activeCategory, onCategorySelect }) => {
  return (
    <div className="categories-container">
      {categoriesList.map((category) => (
        <button
          key={category}
          className={`category-chip ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Categories;
