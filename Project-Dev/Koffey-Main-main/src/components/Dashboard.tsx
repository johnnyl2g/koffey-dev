import React, { useState, useMemo } from 'react';
import { Users, FileText, DollarSign, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Autocomplete, { SearchResult } from './Autocomplete';
import { sampleCustomers, sampleOpportunities } from '../services/sampleData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleContactClick = (contactId: number) => {
    navigate(`/contact/${contactId}`);
  };

  const handleAccountClick = (accountId: number) => {
    navigate(`/customer/${accountId}`);
  };

  const handleSearchSelect = (result: SearchResult) => {
    switch (result.type) {
      case 'customer':
        navigate(`/customer/${result.id}`);
        break;
      case 'contact':
        navigate(`/contact/${result.id}`);
        break;
      case 'opportunity':
        navigate(`/opportunity/${result.id}`);
        break;
    }
  };

  const recentAccounts = useMemo(() => {
    return [...sampleCustomers]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <Autocomplete 
          onSelect={handleSearchSelect}
          placeholder="Search customers, contacts, or opportunities..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 text-blue-500" />
            Recent Customers
          </h3>
          <div className="space-y-4">
            {recentAccounts.map((customer) => (
              <div 
                key={customer.id} 
                className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => handleAccountClick(customer.id)}
              >
                <h4 className="text-lg font-semibold">{customer.name}</h4>
                <ul className="mt-2 space-y-1">
                  {customer.contacts.map((contact) => (
                    <li
                      key={contact.id}
                      className="text-sm flex items-center cursor-pointer hover:bg-gray-300 p-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactClick(contact.id);
                      }}
                    >
                      <User className="mr-2 text-gray-500" size={16} />
                      {contact.firstName} {contact.lastName} - {contact.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="mr-2 text-green-500" />
            New Opportunities
          </h3>
          <div className="space-y-4">
            {sampleOpportunities.map((opportunity) => (
              <Link
                key={opportunity.id}
                to={`/opportunity/${opportunity.id}`}
                className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition duration-300"
              >
                <h4 className="text-lg font-semibold">{opportunity.name}</h4>
                <p 
                  className="text-sm cursor-pointer hover:text-blue-600"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAccountClick(opportunity.customerId);
                  }}
                >
                  Customer: {opportunity.customerName}
                </p>
                <p className="text-sm">Stage: {opportunity.stage}</p>
                <p className="text-sm flex items-center">
                  <DollarSign className="mr-1 text-green-500" size={16} />
                  {opportunity.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;