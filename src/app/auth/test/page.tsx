'use client';

import React, { useEffect, useState } from 'react';

const WebhookPage = () => {
  const [webhookData, setWebhookData] = useState<any>(null);

  useEffect(() => {
    // Establish SSE connection
    const eventSource = new EventSource('/api/sse');

    // Listen for incoming messages
    eventSource.onmessage = (event) => {
      console.log('Received SSE data:', event.data);
      setWebhookData(JSON.parse(event.data));
    };

    // Handle connection errors
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close(); // Close connection on error
    };

    return () => {
      eventSource.close(); // Cleanup on component unmount
    };
  }, []);

  return (
    <div>
      <h1>Webhook Data</h1>
      {webhookData ? (
        <pre>{JSON.stringify(webhookData, null, 2)}</pre>
      ) : (
        <p>No data received yet. Waiting for updates...</p>
      )}
    </div>
  );
};

export default WebhookPage;
