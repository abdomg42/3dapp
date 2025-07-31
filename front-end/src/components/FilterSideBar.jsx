import React from 'react';
import { useCategoryStore } from '../store/CategoryStore';
import { useFormatStore } from '../store/FormatStore';
import { useLogicielStore } from '../store/LogicielStore';
import FilterList from './FilterList';

const FilterSidebar = () => {
  const { categories, loadingC, errorC, fetchCategories } = useCategoryStore();
  const { formats, loading: loadingF, error: errorF, fetchFormats } = useFormatStore();
  const { logiciels, loading: loadingL, error: errorL, fetchLogiciels } = useLogicielStore();

  return (
    <aside className="lg:w-64 flex-shrink-0 lg:h-screen pt-4 rounded-xl shadow sticky top-0 overflow-y-auto z-30 bg-white p-4 my-2">
      <div className="space-y-6">
        <FilterList
          title="Categories"
          fetchItems={fetchCategories}
          items={categories}
          loading={loadingC}
          error={errorC}
          navPrefix="category"
        />
        <FilterList
          title="Formats"
          fetchItems={fetchFormats}
          items={formats}
          loading={loadingF}
          error={errorF}
          navPrefix="format"
        />
        <FilterList
          title="Logiciels"
          fetchItems={fetchLogiciels}
          items={logiciels}
          loading={loadingL}
          error={errorL}
          navPrefix="logiciel"
        />
      </div>
    </aside>
  );
};

export default FilterSidebar;