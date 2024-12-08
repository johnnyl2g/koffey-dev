import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Briefcase, Save, X } from 'lucide-react';
import { contactService, Contact } from '../services/ContactService';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    powerRank: ''
  });

  useEffect(() => {
    const fetchContact = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const fetchedContact = await contactService.getContact(parseInt(id));
        setContact(fetchedContact);
        // Split the name into first and last name
        const [firstName = '', lastName = ''] = fetchedContact.name.split(' ');
        setFormData({
          firstName,
          lastName,
          email: fetchedContact.email,
          phone: fetchedContact.phone,
          title: fetchedContact.role,
          powerRank: ''
        });
      } catch (err) {
        console.error('Error fetching contact:', err);
        setError('Failed to load contact details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!contact) return;

    try {
      const updatedContact: Contact = {
        ...contact,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        role: formData.title
      };
      await contactService.updateContact(contact.id, updatedContact);
      navigate(-1);
    } catch (err) {
      console.error('Error updating contact:', err);
      setError('Failed to update contact. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading contact details...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!contact) {
    return <div className="text-center mt-8">Contact not found.</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <User className="mr-2 text-blue-500" />
          Edit Contact
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600"
          >
            <Save className="mr-2" size={18} />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center hover:bg-gray-400"
          >
            <X className="mr-2" size={18} />
            Cancel
          </button>
        </div>
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center flex-1">
            <User className="mr-2 text-gray-500" />
            <span className="font-semibold mr-2">First Name:</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="flex-grow border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center flex-1">
            <span className="font-semibold mr-2">Last Name:</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="flex-grow border rounded px-2 py-1"
            />
          </div>
        </div>
        <div className="flex items-center">
          <Mail className="mr-2 text-gray-500" />
          <span className="font-semibold mr-2">Email:</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="flex-grow border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center">
          <Phone className="mr-2 text-gray-500" />
          <span className="font-semibold mr-2">Phone:</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="flex-grow border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center">
          <Briefcase className="mr-2 text-gray-500" />
          <span className="font-semibold mr-2">Title:</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="flex-grow border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center">
          <User className="mr-2 text-gray-500" />
          <span className="font-semibold mr-2">Power Rank:</span>
          <input
            type="text"
            name="powerRank"
            value={formData.powerRank}
            onChange={handleInputChange}
            className="flex-grow border rounded px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;