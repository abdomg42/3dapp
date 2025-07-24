import React, { useEffect } from 'react';
import { useCategoryStore } from '../store/CategoryStore';

const Category = () => {
  const { categories, loadingC, errorC, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <aside className="w-56 min-w-[180px] max-w-xs shadow p-4 h-fit sticky top-8 self-start">
      <h2 className="text-2xl font-bold text-[#7A6B3F] mb-4">Categories</h2>
      {loadingC ? (
        <div className="text-gray-500">Loading...</div>
      ) : errorC ? (
        <div className="text-red-500">{errorC}</div>
      ) : (
        <ul className="space-y-1">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <li key={cat.id || cat._id || cat} className="border-b last:border-b-0 py-1 text-[#7A6B3F] cursor-pointer hover:text-[#D6C16B]">
                {cat.name || cat}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No categories</li>
          )}
        </ul>
      )}
    </aside>
  );
};

export default Category;
