import axios from 'axios';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const mockContacts: Contact[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', role: 'CEO' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', role: 'CTO' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', phone: '555-555-5555', role: 'Product Manager' },
  { id: 4, name: 'Bob Williams', email: 'bob@example.com', phone: '111-222-3333', role: 'Sales Director' },
  { id: 5, name: 'Carol Brown', email: 'carol@example.com', phone: '444-444-4444', role: 'Operations Manager' },
];

class ContactService {
  private apiUrl = 'https://api.example.com/contacts'; // Replace with your actual API URL

  async getAllContacts(): Promise<Contact[]> {
    // For testing, return mock data
    return Promise.resolve(mockContacts);
  }

  async getContact(id: number): Promise<Contact> {
    // For testing, find and return a mock contact
    const contact = mockContacts.find(c => c.id === id);
    if (contact) {
      return Promise.resolve(contact);
    }
    return Promise.reject(new Error('Contact not found'));
  }

  async createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    // For testing, create a new contact with a mock ID
    const newContact = { ...contact, id: Date.now() };
    mockContacts.push(newContact);
    return Promise.resolve(newContact);
  }

  async updateContact(id: number, contact: Partial<Contact>): Promise<Contact> {
    // For testing, update a mock contact
    const index = mockContacts.findIndex(c => c.id === id);
    if (index !== -1) {
      mockContacts[index] = { ...mockContacts[index], ...contact };
      return Promise.resolve(mockContacts[index]);
    }
    return Promise.reject(new Error('Contact not found'));
  }

  async deleteContact(id: number): Promise<void> {
    // For testing, remove a mock contact
    const index = mockContacts.findIndex(c => c.id === id);
    if (index !== -1) {
      mockContacts.splice(index, 1);
      return Promise.resolve();
    }
    return Promise.reject(new Error('Contact not found'));
  }
}

export const contactService = new ContactService();