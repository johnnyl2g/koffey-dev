import React, { useState, useMemo } from 'react';
import { FileText, Search, ChevronLeft, ChevronRight, DollarSign, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sampleOpportunities, sampleCustomers } from '../services/sampleData';

const RECENT_PAGE_SIZE = 10;
const ALL_PAGE_SIZE = 20;

interface OpportunityListProps {}

const OpportunityList: React.FC<OpportunityListProps> = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [recentPage, setRecentPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'amount' | 'stage' | 'customerName'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleOpportunityClick = (opportunityId: number) => {
    navigate(`/opportunity/${opportunityId}`);
  };

  const handleCustomerClick = (e: React.MouseEvent, customerId: number) => {
    e.stopPropagation();
    navigate(`/customer/${customerId}`);
  };

  const filteredOpportunities = useMemo(() => {
    return sampleOpportunities.filter(opportunity =>
      opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.stage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const sortedOpportunities = useMemo(() => {
    return [...filteredOpportunities].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'stage':
          comparison = a.stage.localeCompare(b.stage);
          break;
        case 'customerName':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredOpportunities, sortField, sortDirection]);

  const recentOpportunities = useMemo(() => {
    const startIndex = (recentPage - 1) * RECENT_PAGE_SIZE;
    return sortedOpportunities.slice(startIndex, startIndex + RECENT_PAGE_SIZE);
  }, [sortedOpportunities, recentPage]);

  const allOpportunities = useMemo(() => {
    const startIndex = (allPage - 1) * ALL_PAGE_SIZE;
    return sortedOpportunities.slice(startIndex, startIndex + ALL_PAGE_SIZE);
  }, [sortedOpportunities, allPage]);

  const totalRecentPages = Math.ceil(sortedOpportunities.length / RECENT_PAGE_SIZE);
  const totalAllPages = Math.ceil(sortedOpportunities.length / ALL_PAGE_SIZE);

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }> = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderOpportunityCard = (opportunity: typeof sampleOpportunities[0]) => (
    <div
      key={opportunity.id}
      className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200"
      onClick={() => handleOpportunityClick(opportunity.id)}
    >
      <div className="flex items-center mb-2">
        <FileText className="mr-2 text-blue-500" />
        <h3 className="text-lg font-semibold">{opportunity.name}</h3>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-1">
        <Building className="mr-1" size={16} />
        <span
          className="text-blue-600 hover:text-blue-800 cursor-pointer"
          onClick={(e) => handleCustomerClick(e, opportunity.customerId)}
        >
          {opportunity.customerName}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-1">
        <DollarSign className="mr-1" size={16} />
        {opportunity.amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </div>
      <div className="text-sm text-gray-600">Stage: {opportunity.stage}</div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Opportunities</h2>
        <div className="flex">
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setRecentPage(1);
              setAllPage(1);
            }}
            className="border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Recent Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentOpportunities.map(renderOpportunityCard)}
        </div>
        {totalRecentPages > 1 && (
          <Pagination
            currentPage={recentPage}
            totalPages={totalRecentPages}
            onPageChange={setRecentPage}
          />
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">All Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allOpportunities.map(renderOpportunityCard)}
        </div>
        {totalAllPages > 1 && (
          <Pagination
            currentPage={allPage}
            totalPages={totalAllPages}
            onPageChange={setAllPage}
          />
        )}
      </div>
    </div>
  );
};

export default OpportunityList;