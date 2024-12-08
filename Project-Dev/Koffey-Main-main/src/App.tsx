import React from 'react';
import { Users, BarChart, UserCheck, FileText } from 'lucide-react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import CustomerList from './components/CustomerList';
import CustomerProfile from './components/CustomerProfile';
import RolePlayCoach from './components/LLMChat';
import Dashboard from './components/Dashboard';
import OpportunityDetail from './components/OpportunityDetail';
import ContactDetail from './components/ContactDetail';
import OpportunityList from './components/OpportunityList';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">CRM Dashboard</h1>
              <div className="flex items-center gap-4">
                <span className="hidden md:inline">johnnyl2g@gmail.com</span>
              </div>
            </div>
          </header>
          
          <div className="container mx-auto p-4">
            <nav className="flex mb-4 flex-wrap gap-2">
              <Link
                to="/"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <BarChart className="inline-block mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link
                to="/customers"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Users className="inline-block mr-2" />
                <span className="hidden md:inline">Customer Accounts</span>
              </Link>
              <Link
                to="/opportunities"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <FileText className="inline-block mr-2" />
                <span className="hidden md:inline">Opportunities</span>
              </Link>
              <Link
                to="/roleplay"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <UserCheck className="inline-block mr-2" />
                <span className="hidden md:inline">Role Play Coach</span>
              </Link>
            </nav>
            
            <main>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/customers" element={<CustomerList onSelectCustomer={() => {}} />} />
                  <Route path="/customer/:id" element={<CustomerProfile />} />
                  <Route path="/opportunities" element={<OpportunityList />} />
                  <Route path="/opportunity/:id" element={<OpportunityDetail />} />
                  <Route path="/contact/:id" element={<ContactDetail />} />
                  <Route path="/roleplay" element={<RolePlayCoach />} />
                </Routes>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;