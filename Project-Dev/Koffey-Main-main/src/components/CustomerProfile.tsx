import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, User, FileText, Plus } from 'lucide-react';
import NotesSection from './NotesSection';
import Opportunity from './Opportunity';

interface CustomerProfileProps {
  customer?: {
    id: number;
    name: string;
  };
}

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  powerRank: string;
  address: string;
}

const exampleAccounts = [
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

const exampleContacts: { [key: number]: Contact[] } = {
  1: [
    { id: 1, firstName: "John", lastName: "Doe", title: "CEO", email: "john.doe@acmecorp.com", powerRank: "4", address: "123 Main St, Anytown, USA" },
    { id: 2, firstName: "Jane", lastName: "Smith", title: "CTO", email: "jane.smith@acmecorp.com", powerRank: "4", address: "123 Main St, Anytown, USA" }
  ],
  2: [
    { id: 3, firstName: "Alice", lastName: "Johnson", title: "Product Manager", email: "alice.johnson@techstart.com", powerRank: "3", address: "456 Innovation Ave, Tech City, USA" }
  ],
  3: [
    { id: 4, firstName: "Bob", lastName: "Williams", title: "Sales Director", email: "bob.williams@globalsolutions.com", powerRank: "4", address: "789 World Plaza, Metropolis, USA" },
    { id: 5, firstName: "Carol", lastName: "Brown", title: "Operations Manager", email: "carol.brown@globalsolutions.com", powerRank: "3", address: "789 World Plaza, Metropolis, USA" }
  ]
};

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer: propCustomer }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<{ id: number; name: string } | null>(propCustomer || null);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    powerRank: '3',
    address: '',
  });

  useEffect(() => {
    if (!customer && id) {
      const customerId = parseInt(id);
      const foundCustomer = exampleAccounts.find(acc => acc.id === customerId);
      
      if (foundCustomer) {
        setCustomer({
          id: foundCustomer.id,
          name: foundCustomer.name,
        });
        setContacts(exampleContacts[customerId] || []);
      }
    }
  }, [customer, id]);

  const handleContactClick = (contactId: number) => {
    navigate(`/contact/${contactId}`);
  };

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote('');
    }
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = { ...newContact, id: Date.now() };
    setContacts([...contacts, contact]);
    setNewContact({
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      powerRank: '3',
      address: '',
    });
  };

  if (!customer) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Building className="mr-2 text-blue-500" size={24} />
        <h2 className="text-2xl font-semibold">{customer.name}</h2>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {contacts.map((contact) => (
            <div 
              key={contact.id} 
              className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300"
              onClick={() => handleContactClick(contact.id)}
            >
              <div className="flex items-center mb-2">
                <User className="mr-2 text-green-500" />
                <h4 className="text-lg font-semibold">{`${contact.firstName} ${contact.lastName}`}</h4>
              </div>
              <p className="text-sm">{contact.title}</p>
              <p className="text-sm">{contact.email}</p>
              <p className="text-sm">Power Rank: {contact.powerRank}</p>
            </div>
          ))}
        </div>
      </div>

      <Opportunity customerId={customer.id} customerName={customer.name} />
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Account Notes</h3>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter a new note..."
          ></textarea>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
            onClick={addNote}
          >
            <Plus size={20} className="mr-2" /> Add Note
          </button>
        </div>
        <div className="space-y-2">
          {notes.map((note, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded flex items-start">
              <FileText className="mr-2 text-blue-500 flex-shrink-0 mt-1" />
              <p>{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;