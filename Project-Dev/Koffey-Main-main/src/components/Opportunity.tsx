import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import NotesSection from './NotesSection';
import axios from 'axios';

interface OpportunityProps {
  customerId: number;
  customerName: string;
}

interface Opportunity {
  id: number;
  name: string;
  stage: string;
  amount: number;
  closeDate: string;
  nextStep: string;
}

const Opportunity: React.FC<OpportunityProps> = ({ customerId, customerName }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [newOpportunity, setNewOpportunity] = useState<Omit<Opportunity, 'id'>>({
    name: '',
    stage: 'Discovery',
    amount: 0,
    closeDate: '',
    nextStep: '',
  });
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const addOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    const opportunity = { ...newOpportunity, id: Date.now() };
    try {
      // Simulating API call - replace with actual API endpoint when available
      // const response = await axios.post('/api/opportunities', opportunity);
      // setOpportunities([...opportunities, response.data]);
      
      // For now, just add the opportunity directly to the state
      setOpportunities([...opportunities, opportunity]);
      setNewOpportunity({ name: '', stage: 'Discovery', amount: 0, closeDate: '', nextStep: '' });
    } catch (error) {
      console.error('Error adding opportunity:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Opportunities for {customerName}</h2>
      <form onSubmit={addOpportunity} className="mb-6 grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Opportunity Name"
          value={newOpportunity.name}
          onChange={(e) => setNewOpportunity({ ...newOpportunity, name: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <select
          value={newOpportunity.stage}
          onChange={(e) => setNewOpportunity({ ...newOpportunity, stage: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="Closed Lost">0: Closed Lost</option>
          <option value="Discovery">1: Discovery</option>
          <option value="Qualifying">2: Qualifying</option>
          <option value="Opportunity Development">3: Opportunity Development</option>
          <option value="POC">4: POC</option>
          <option value="Negotiation/Closing">5: Negotiation/Closing</option>
          <option value="Closed Won">6: Closed Won</option>
        </select>
        <input
          type="number"
          placeholder="Opportunity Amount"
          value={newOpportunity.amount}
          onChange={(e) => setNewOpportunity({ ...newOpportunity, amount: Number(e.target.value) })}
          className="p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
        <input
          type="date"
          value={newOpportunity.closeDate}
          onChange={(e) => setNewOpportunity({ ...newOpportunity, closeDate: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Next Step"
          value={newOpportunity.nextStep}
          onChange={(e) => setNewOpportunity({ ...newOpportunity, nextStep: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="col-span-2 bg-green-500 text-white p-2 rounded flex items-center justify-center">
          <Plus size={20} className="mr-2" /> Add Opportunity
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className={`bg-gray-100 p-4 rounded-lg cursor-pointer ${
              selectedOpportunity?.id === opportunity.id ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => setSelectedOpportunity(opportunity)}
          >
            <div className="flex items-center mb-2">
              <FileText className="mr-2 text-green-500" />
              <h3 className="text-lg font-semibold">{opportunity.name}</h3>
            </div>
            <p className="text-gray-600">{opportunity.stage}</p>
            <p className="text-sm">Amount: ${opportunity.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm">Close Date: {opportunity.closeDate}</p>
            <p className="text-sm">Next Step: {opportunity.nextStep}</p>
          </div>
        ))}
      </div>
      {selectedOpportunity && (
        <NotesSection opportunityId={selectedOpportunity.id} opportunityName={selectedOpportunity.name} />
      )}
    </div>
  );
};

export default Opportunity;