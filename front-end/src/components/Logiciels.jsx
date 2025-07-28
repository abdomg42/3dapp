import React, { useEffect, useState } from 'react';
import { useProductStore } from '../store/ProductStore';

const ExpandableButtonList = ({ items, selected, setSelected, label }) => {
  const [showAll, setShowAll] = useState(false);
  if (!items || items.length === 0) return null;
  const main = items.slice(0, 5);
  const extra = items.slice(5);
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-[#7A6B3F] mb-2">{label}</h3>
      <div className="flex flex-col gap-1">
        {main.map((item) => (
          <button
            key={item.id || item._id || item}
            className={`w-full text-left px-3 py-1 rounded transition font-medium border-b last:border-b-0 border-gray-200 hover:bg-[#F8F6F2] hover:text-[#D6C16B] ${selected === (item.id || item._id || item) ? 'bg-[#F8F6F2] text-[#D6C16B]' : 'text-[#7A6B3F]'}`}
            onClick={() => setSelected(item.id || item._id || item)}
          >
            {item.name || item.extension || item}
          </button>
        ))}
        {extra.length > 0 && !showAll && (
          <button
            className="w-full text-left px-3 py-1 rounded transition font-medium border-b border-gray-200 hover:bg-[#F8F6F2] hover:text-[#D6C16B] text-[#7A6B3F]"
            onClick={() => setShowAll(true)}
          >
            Show more...
          </button>
        )}
        {showAll && extra.map((item) => (
          <button
            key={item.id || item._id || item}
            className={`w-full text-left px-3 py-1 rounded transition font-medium border-b last:border-b-0 border-gray-200 hover:bg-[#F8F6F2] hover:text-[#D6C16B] ${selected === (item.id || item._id || item) ? 'bg-[#F8F6F2] text-[#D6C16B]' : 'text-[#7A6B3F]'}`}
            onClick={() => setSelected(item.id || item._id || item)}
          >
            {item.name || item.extension || item}
          </button>
        ))}
        {showAll && extra.length > 0 && (
          <button
            className="w-full text-left px-3 py-1 rounded transition font-medium border-b border-gray-200 hover:bg-[#F8F6F2] hover:text-[#D6C16B] text-[#7A6B3F]"
            onClick={() => setShowAll(false)}
          >
            Show less...
          </button>
        )}
      </div>
    </div>
  );
};

const Logiciels = () => {
  const { logiciels, fetchLogiciels } = useProductStore();
  const [selectedLogiciel, setSelectedLogiciel] = useState(null);

  useEffect(() => {
    fetchLogiciels();
  }, [fetchLogiciels]);

  return (
    <aside className="w-56 min-w-[180px] max-w-xs shadow p-4 h-fit sticky top-8 self-start bg-white rounded-xl">
      <h2 className="text-2xl font-bold text-[#7A6B3F] mb-4">Logiciels</h2>
      <ExpandableButtonList
        items={logiciels}
        selected={selectedLogiciel}
        setSelected={setSelectedLogiciel}
        label="Logiciel"
      />
    </aside>
  );
};

export default Logiciels; 