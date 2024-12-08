import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, Building, FileText, Users, Target, Calendar, User, X } from 'lucide-react';
import { contactService, Contact } from '../services/ContactService';
import { sampleOpportunities } from '../services/sampleData';
import NotesSection from './NotesSection';
import MEDDPICAnalysis from './MEDDPICAnalysis';

interface Opportunity {
  id: number;
  name: string;
  amount: number;
  stage: string;
  customerName: string;
  customerId: number;
  closeDate: string;
  associatedContacts: number[];
  metrics?: string;
  economicBuyer?: string;
  decisionCriteria?: string;
  decisionProcess?: string;
  paperProcess?: string;
  identifyPain?: string;
  champion?: string;
  competition?: string;
}

const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOpportunity = async () => {
      if (!id) return;

      try {
        const foundOpportunity = sampleOpportunities.find(opp => opp.id === parseInt(id));
        
        if (foundOpportunity) {
          setOpportunity({
            ...foundOpportunity,
            closeDate: new Date().toISOString().split('T')[0],
            associatedContacts: [],
            metrics: '',
            economicBuyer: '',
            decisionCriteria: '',
            decisionProcess: '',
            paperProcess: '',
            identifyPain: '',
            champion: '',
            competition: ''
          });
        } else {
          throw new Error('Opportunity not found');
        }

        const allContacts = await contactService.getAllContacts();
        setAvailableContacts(allContacts);
        setContacts([]);

      } catch (error) {
        console.error('Error loading opportunity:', error);
        setError(error instanceof Error ? error.message : 'Failed to load opportunity');
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunity();
  }, [id]);

  const handleOpportunityChange = (field: keyof Opportunity, value: any) => {
    if (!opportunity) return;
    setOpportunity({
      ...opportunity,
      [field]: value
    });
  };

  const handleCustomerClick = () => {
    if (opportunity) {
      navigate(`/customer/${opportunity.customerId}`);
    }
  };

  const handleAddContact = (contactId: number) => {
    if (!opportunity) return;
    handleOpportunityChange(
      'associatedContacts',
      [...opportunity.associatedContacts, contactId]
    );
  };

  const handleRemoveContact = (contactId: number) => {
    if (!opportunity) return;
    handleOpportunityChange(
      'associatedContacts',
      opportunity.associatedContacts.filter(id => id !== contactId)
    );
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-lg">Error: {error}</div>;
  if (!opportunity) return <div className="p-4">Opportunity not found</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Opportunity Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-500" size={24} />
            <input
              type="text"
              value={opportunity.name}
              onChange={(e) => handleOpportunityChange('name', e.target.value)}
              className="text-2xl font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500" size={18} />
              <input
                type="date"
                value={opportunity.closeDate}
                onChange={(e) => handleOpportunityChange('closeDate', e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Target className="text-gray-500" size={18} />
              <select
                value={opportunity.stage}
                onChange={(e) => handleOpportunityChange('stage', e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="Closed Lost">0: Closed Lost</option>
                <option value="Discovery">1: Discovery</option>
                <option value="Qualifying">2: Qualifying</option>
                <option value="Opportunity Development">3: Opportunity Development</option>
                <option value="POC">4: POC</option>
                <option value="Negotiation/Closing">5: Negotiation/Closing</option>
                <option value="Closed Won">6: Closed Won</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-end">
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-500" size={18} />
            <input
              type="number"
              value={opportunity.amount}
              onChange={(e) => handleOpportunityChange('amount', parseFloat(e.target.value) || 0)}
              className="text-2xl font-semibold text-green-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 text-right"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Building className="mr-2" />
          Customer Information
        </h3>
        <div 
          className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={handleCustomerClick}
        >
          <p className="text-lg font-semibold text-blue-600 hover:text-blue-800">
            {opportunity.customerName}
          </p>
        </div>
      </div>

      {/* Associated Contacts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Users className="mr-2" />
            Associated Contacts
          </h3>
          <select
            className="border rounded px-3 py-1"
            onChange={(e) => {
              const contactId = parseInt(e.target.value);
              if (contactId) handleAddContact(contactId);
            }}
            value=""
          >
            <option value="">Add Contact...</option>
            {availableContacts
              .filter(c => !opportunity.associatedContacts.includes(c.id))
              .map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4 bg-gray-50 rounded-lg relative group">
              <button
                onClick={() => handleRemoveContact(contact.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="text-red-500 hover:text-red-700" size={16} />
              </button>
              <div className="flex items-center mb-2">
                <User className="mr-2 text-blue-500" size={18} />
                <span className="font-semibold">{contact.name}</span>
              </div>
              <p className="text-sm text-gray-600">{contact.role}</p>
              <p className="text-sm text-gray-600">{contact.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MEDDPIC Section */}
      <div className="mb-8">
        <MEDDPICAnalysis
          opportunityId={opportunity.id}
          opportunityName={opportunity.name}
        />
      </div>

      {/* Notes Section */}
      <NotesSection 
        opportunityId={opportunity.id} 
        opportunityName={opportunity.name} 
      />
    </div>
  );
};

export default OpportunityDetail;