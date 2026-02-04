import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Search, Video, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const RightSidebar: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/friends/list');
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts');
    }
  };

  return (
    <div className="hidden xl:block w-80 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pl-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-facebook-secondary font-semibold text-sm">Contacts</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Video className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Search className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden">
                {contact.avatar ? (
                  <img src={contact.avatar} alt={contact.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-facebook-blue text-white flex items-center justify-center text-sm font-bold">
                    {contact.firstName[0]}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="font-medium text-facebook-text">{contact.firstName} {contact.lastName}</span>
          </div>
        ))}
      </div>

      <div className="border-t my-4 pt-4">
        <h3 className="text-facebook-secondary font-semibold text-sm mb-2">Group conversations</h3>
        <div className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xl">+</span>
          </div>
          <span className="font-medium text-facebook-text">Create New Group</span>
        </div>
      </div>
    </div>
  );
};