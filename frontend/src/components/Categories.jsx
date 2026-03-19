// Categories.jsx
// Horizontal filter bar displayed at the top of the Home page.
// Renders a row of clickable category chips (pills).
// Props:
//   - activeCategory  : the currently selected category string
//   - onCategorySelect: callback fired when the user clicks a chip

import './Categories.css';

// Full list of available filter categories shown in the bar
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
    // Scrollable horizontal container for all category chips
    <div className="categories-container">
      {categoriesList.map((category) => (
        <button
          key={category}
          // Highlight the chip that matches the active/selected category
          className={`category-chip ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onCategorySelect(category)} // Notify parent of selection
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Categories;
