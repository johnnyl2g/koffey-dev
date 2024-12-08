import { Contact } from './ContactService';

export interface Customer {
  id: number;
  name: string;
  address: string;
  billingAddress: string;
  phoneNumber: string;
  email: string;
  owner: string;
  team: string[];
  createdAt: Date;
  contacts: Contact[];
}

export interface Opportunity {
  id: number;
  name: string;
  amount: number;
  stage: string;
  customerName: string;
  customerId: number;
}

export const sampleCustomers: Customer[] = [
  {
    id: 1,
    name: "Acme Corporation",
    address: "123 Main St, Anytown, USA",
    billingAddress: "123 Main St, Anytown, USA",
    phoneNumber: "555-123-4567",
    email: "info@acmecorp.com",
    owner: "John Smith",
    team: ["Sales Team A"],
    createdAt: new Date("2023-06-01"),
    contacts: [
      { id: 1, firstName: "John", lastName: "Doe", title: "CEO", email: "john@example.com", phone: "123-456-7890", role: "CEO" },
      { id: 2, firstName: "Jane", lastName: "Smith", title: "CTO", email: "jane@example.com", phone: "098-765-4321", role: "CTO" }
    ]
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
    createdAt: new Date("2023-06-15"),
    contacts: [
      { id: 3, firstName: "Alice", lastName: "Johnson", title: "Product Manager", email: "alice@example.com", phone: "555-555-5555", role: "Product Manager" }
    ]
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
    createdAt: new Date("2023-06-30"),
    contacts: [
      { id: 4, firstName: "Bob", lastName: "Williams", title: "Sales Director", email: "bob@example.com", phone: "111-222-3333", role: "Sales Director" },
      { id: 5, firstName: "Carol", lastName: "Brown", title: "Operations Manager", email: "carol@example.com", phone: "444-444-4444", role: "Operations Manager" }
    ]
  }
];

export const sampleOpportunities: Opportunity[] = [
  {
    id: 1,
    name: "Enterprise Software Deal",
    amount: 100000,
    stage: "Negotiation",
    customerName: "Acme Corporation",
    customerId: 1
  },
  {
    id: 2,
    name: "Cloud Migration Project",
    amount: 75000,
    stage: "Proposal",
    customerName: "TechStart Inc.",
    customerId: 2
  },
  {
    id: 3,
    name: "Consulting Services",
    amount: 50000,
    stage: "Discovery",
    customerName: "Global Solutions Ltd.",
    customerId: 3
  }
];