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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/addAgent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Agent added successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          username: "",
          title: "",
          sendNotification: true,
        });
      } else {
        console.error("Error adding agent:", result.error);
        alert("Failed to add agent: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred.");
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        // margin: '30',
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
          width: '20%',
          marginTop: '1.5rem',
          padding: '0.5rem',
          backgroundColor: 'var(--navbar-active-bg)',
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
