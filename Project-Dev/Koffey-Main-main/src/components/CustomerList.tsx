import React, { useState, useMemo, useEffect } from 'react';
import { Building, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Account {
  id: number;
  name: string;
  address: string;
  billingAddress: string;
  phoneNumber: string;
  email: string;
  owner: string;
  team: string[];
  createdAt: Date;
}

interface CustomerListProps {
  onSelectCustomer: (account: { id: number; name: string }) => void;
}

const RECENT_PAGE_SIZE = 10;
const ALL_PAGE_SIZE = 20;

const exampleAccounts: Account[] = [
  {
    id: 1,
    name: "Acme Corporation",
    address: "123 Main St, Anytown, USA",
    billingAddress: "123 Main St, Anytown, USA",
    phoneNumber: "555-123-4567",
    email: "info@acmecorp.com",
    owner: "John Smith",
    team: ["Sales Team A"],
    createdAt: new Date("2023-06-01")
  },
  {
    id: 2,
    name: "TechStart Inc.",
    address: "456 Innovation Ave, Tech City, USA",
    billingAddress: "456 Innovation Ave, Tech City, USA",
    phoneNumber: "555-987-6543",
    email: "contact@techstart.com",
    owner: "Jane Doe",
    team: ["Sales Team B", "Tech Support"],
    createdAt: new Date("2023-06-15")
  },
  {
    id: 3,
    name: "Global Solutions Ltd.",
    address: "789 World Plaza, Metropolis, USA",
    billingAddress: "789 World Plaza, Metropolis, USA",
    phoneNumber: "555-246-8135",
    email: "info@globalsolutions.com",
    owner: "Bob Johnson",
    team: ["Enterprise Sales", "Customer Success"],
    createdAt: new Date("2023-06-30")
  }
];

const CustomerList: React.FC<CustomerListProps> = ({ onSelectCustomer }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState<Omit<Account, 'id' | 'createdAt'>>({
    name: '',
    address: '',
    billingAddress: '',
    phoneNumber: '',
    email: '',
    owner: '',
    team: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [recentPage, setRecentPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setAccounts(exampleAccounts);
  }, []);

  const handleAccountClick = (accountId: number) => {
    navigate(`/customer/${accountId}`);
  };

  const addAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const account = { ...newAccount, id: Date.now(), createdAt: new Date() };
    setAccounts([account, ...accounts]);
    setNewAccount({
      name: '',
      address: '',
      billingAddress: '',
      phoneNumber: '',
      email: '',
      owner: '',
      team: [],
    });
    onSelectCustomer({ id: account.id, name: account.name });
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  const recentAccounts = useMemo(() => {
    const sorted = [...filteredAccounts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const startIndex = (recentPage - 1) * RECENT_PAGE_SIZE;
    return sorted.slice(startIndex, startIndex + RECENT_PAGE_SIZE);
  }, [filteredAccounts, recentPage]);

  const alphabeticalAccounts = useMemo(() => {
    const sorted = [...filteredAccounts].sort((a, b) => a.name.localeCompare(b.name));
    const startIndex = (allPage - 1) * ALL_PAGE_SIZE;
    return sorted.slice(startIndex, startIndex + ALL_PAGE_SIZE);
  }, [filteredAccounts, allPage]);

  const totalRecentPages = Math.ceil(filteredAccounts.length / RECENT_PAGE_SIZE);
  const totalAllPages = Math.ceil(filteredAccounts.length / ALL_PAGE_SIZE);

  const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }> = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }) => (
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

  const renderAccountCard = (account: Account) => (
    <div
      key={account.id}
      className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200"
      onClick={() => handleAccountClick(account.id)}
    >
      <div className="flex items-center mb-2">
        <Building className="mr-2 text-blue-500" />
        <h3 className="text-lg font-semibold">{account.name}</h3>
      </div>
      <p className="text-sm">{account.email}</p>
      <p className="text-sm">{account.phoneNumber}</p>
      <p className="text-sm">Owner: {account.owner}</p>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Account Management</h2>
        <div className="flex">
          <input
            type="text"
            placeholder="Search accounts..."
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
        <h3 className="text-xl font-semibold mb-4">Recently Added Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentAccounts.map(renderAccountCard)}
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
        <h3 className="text-xl font-semibold mb-4">All Accounts (Alphabetical)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alphabeticalAccounts.map(renderAccountCard)}
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

export default CustomerList;