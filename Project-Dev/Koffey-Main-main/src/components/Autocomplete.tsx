import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { sampleCustomers, sampleOpportunities } from '../services/sampleData';

interface AutocompleteProps {
  onSelect: (item: SearchResult) => void;
  placeholder?: string;
}

export interface SearchResult {
  id: number;
  type: 'customer' | 'contact' | 'opportunity';
  name: string;
  subtitle?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Search in customers
    const customerResults = sampleCustomers
      .filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(customer => ({
        id: customer.id,
        type: 'customer' as const,
        name: customer.name,
        subtitle: customer.email
      }));

    // Search in contacts
    const contactResults = sampleCustomers
      .flatMap(customer => customer.contacts)
      .filter(contact => 
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(contact => ({
        id: contact.id,
        type: 'contact' as const,
        name: `${contact.firstName} ${contact.lastName}`,
        subtitle: contact.title
      }));

    // Search in opportunities
    const opportunityResults = sampleOpportunities
      .filter(opp => 
        opp.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(opp => ({
        id: opp.id,
        type: 'opportunity' as const,
        name: opp.name,
        subtitle: `$${opp.amount.toLocaleString()} - ${opp.stage}`
      }));

    setResults([...customerResults, ...contactResults, ...opportunityResults]);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-64 border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Search size={20} />
        </button>
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={`${result.type}-${result.id}`}
              className={`p-3 cursor-pointer ${
                index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelect(result)}
            >
              <div className="font-medium">{result.name}</div>
              <div className="text-sm text-gray-500">
                {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                {result.subtitle && ` • ${result.subtitle}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;