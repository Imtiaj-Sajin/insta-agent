import React, { useState } from 'react';

const AddAgent: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    username: '',
    title: '',
    sendNotification: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-6 max-w-md mx-auto rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h2>

        {/* Each label and input pair is wrapped in a flex container */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="text-gray-600 sm:w-1/3 sm:text-right pr-4">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="text-gray-600 sm:w-1/3 sm:text-right pr-4">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="text-gray-600 sm:w-1/3 sm:text-right pr-4">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="text-gray-600 sm:w-1/3 sm:text-right pr-4">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <input
            placeholder='Username'
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <input
            placeholder='Title'
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      <div className="mt-4 flex items-center">
        <label className="text-gray-600 pr-2">Send email notification to agent</label>
        <input
          type="checkbox"
          name="sendNotification"
          checked={formData.sendNotification}
          onChange={handleChange}
          className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Confirm
      </button>
    </form>
  );
};

export default AddAgent;
