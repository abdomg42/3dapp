import React from 'react';
import { useCategoryStore } from '../store/CategoryStore';
import { useProductStore } from '../store/ProductStore';
import FilterList from './FilterList';

const FilterSidebar = () => {
  const { categories, loadingC, errorC, fetchCategories } = useCategoryStore();
  const { formats, fetchFormats, logiciels, fetchLogiciels } = useProductStore();

  return (
    <aside className="lg:w-64 flex-shrink-0 lg:h-screen pt-4 rounded-xl shadow sticky top-0 overflow-y-auto z-30 bg-white p-4 my-2">
      <div className="space-y-6">
        <FilterList
          title="Categories"
          fetchItems={fetchCategories}
          items={categories}
          loading={loadingC}
          erro  r={errorC}
          navPrefix="category"
        />
        <FilterList
          title="Formats"
          fetchItems={fetchFormats}
          items={formats}
          loading={false}
          error={null}
          navPrefix="format"
        />
        <FilterList
          title="Logiciels"
          fetchItems={fetchLogiciels}
          items={logiciels}
          loading={false}
          error={null}
          navPrefix="logiciel"
        />
      </div>
    </aside>
  );
};

export default FilterSidebar;