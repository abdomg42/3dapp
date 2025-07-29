import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/ProductStore';

const ExpandableButtonList = ({ items, selected, setSelected, onItemClick }) => {
  const [showAll, setShowAll] = useState(false);
  if (!items || items.length === 0) return null;
  const main = items.slice(0, 5);
  const extra = items.slice(5);
  return (
    <div className="mb-4">
      <div className="flex flex-col gap-1">
        {main.map((item) => {
          const itemValue = item.name || item.extension || item;
          return (
            <button
              key={item.id || item._id || item}
              className={`w-full text-left cursor-pointer px-3 py-1 rounded transition font-medium border-b last:border-b-0 border-gray-200 hover:bg-[#F8F6F2] hover:text-[#D6C16B] ${selected === (item.id || item._id || item) ? 'bg-[#F8F6F2] text-[#D6C16B]' : 'text-[#7A6B3F]'}`}
              onClick={() => {
                setSelected(item.id || item._id || item);
                onItemClick && onItemClick(itemValue);
              }}
            >
              {itemValue}
            </button>
          );
        })}
        {extra.length > 0 && !showAll && (
          <button
            className="w-full cursor-pointer text-left px-3 py-1 rounded transition font-medium border-b border-gray-200 hover:bg-[#F8F6F2] hover:text-[#D6C16B] text-[#7A6B3F]"
            onClick={() => setShowAll(true)}
          >
            Show more...
          </button>
        )}
        {showAll && extra.map((item) => {
          const itemValue = item.name || item.extension || item;
          return (
            <button
              key={item.id || item._id || item}
              className={`w-full cursor-pointer text-left px-3 py-1 rounded transition font-medium border-b last:border-b-0 border-gray-200 hover:bg-[#F8F6F2] hover:text-[#D6C16B] ${selected === (item.id || item._id || item) ? 'bg-[#F8F6F2] text-[#D6C16B]' : 'text-[#7A6B3F]'}`}
              onClick={() => {
                setSelected(item.id || item._id || item);
                onItemClick && onItemClick(itemValue);
              }}
            >
              {itemValue}
            </button>
          );
        })}
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogiciels();
  }, [fetchLogiciels]);

  const handleLogicielClick = (logicielName) => {
    navigate(`/logiciel/${encodeURIComponent(logicielName)}`);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#7A6B3F] mb-4">Logiciels</h2>
      <ExpandableButtonList
        items={logiciels}
        selected={selectedLogiciel}
        setSelected={setSelectedLogiciel}
        onItemClick={handleLogicielClick}
      />
    </div>
  );
};

export default Logiciels; 