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
      style={{
        backgroundColor: '#ffffff',
        padding: '0rem',
        margin: '0 auto',
        borderRadius: '0.5rem',
      }}
    >
      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4a5568', marginBottom: '1rem' }}>
        Personal Details
      </h2>

      {/* Input fields */}
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem', padding:0, boxShadow:"0 4px 8px rgba(0, 0, 0, 0)"  }}>
        <input
          placeholder="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #718096',
            borderRadius: '0.375rem',
            
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem', padding:0, boxShadow:"0 4px 8px rgba(0, 0, 0, 0)" }}>
        <input
          placeholder="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d2d6dc',
            borderRadius: '0.375rem',
            
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem', padding:0 , boxShadow:"0 4px 8px rgba(0, 0, 0, 0)" }}>
        <input
          placeholder="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d2d6dc',
            borderRadius: '0.375rem',
            
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem', padding:0, boxShadow:"0 4px 8px rgba(0, 0, 0, 0)" }}>
        <input
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d2d6dc',
            borderRadius: '0.375rem',
            
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem', padding:0, boxShadow:"0 4px 8px rgba(0, 0, 0, 0)" }}>
        <input
          placeholder="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d2d6dc',
            borderRadius: '0.375rem',
            
          }}
        />
      </div>

      {/* Checkbox */}
      <div style={{ marginTop: '1rem', display: 'flex', borderWidth:0, alignItems: 'center', boxShadow:"0 4px 8px rgba(0, 0, 0, 0)" }}>
        <label style={{ color: '#4a5568', paddingRight: '0.5rem'}}>
          Send email notification to agent
        </label>
        <input
          type="checkbox"
          name="sendNotification"
          checked={formData.sendNotification}
          onChange={handleChange}
          style={{
            height: '1.25rem',
            width: '1.25rem',
            color: '#4299e1',
            borderRadius: '0.375rem',
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        style={{
          width: '100%',
          marginTop: '1.5rem',
          padding: '0.5rem',
          backgroundColor: 'var(--create-button-color)',
          color: '#fff',
          fontWeight: '600',
          borderRadius: '0.375rem',
          cursor: 'pointer',
        }}
      >
        Confirm
      </button>
    </form>
  );
};

export default AddAgent;
