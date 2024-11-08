import React, { useState, useEffect } from 'react';

const Updates = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      icon: '❤️',
      content: 'John Doe liked your post.',
      timestamp: '2024-11-08T10:30:00Z',
      postLink: 'https://www.instagram.com/p/DA528GnvQ1Y/',
    },
    {
      id: 2,
      type: 'comment',
      icon: '💬',
      content: "Jane Doe commented: 'Great post!'",
      timestamp: '2024-11-08T09:45:00Z',
      postLink: 'https://instagram.com/post/67890',
    },
    {
      id: 3,
      type: 'comment',
      icon: '↩️',
      content: 'Nidan replied to your comment.',
      timestamp: '2024-11-08T08:15:00Z',
      postLink: 'https://instagram.com/post/11223',
    },
    {
      id: 4,
      type: 'follow',
      icon: '❇️',
      content: 'Jessica started following you.',
      timestamp: '2024-11-08T07:50:00Z',
      postLink: 'https://instagram.com/user/user_d',
    },
  ]);

  const [selectedContent, setSelectedContent] = useState('');
  const [showRightDiv, setShowRightDiv] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showContent = (postLink) => {
    setSelectedContent(postLink);
    if (isMobile) {
      setShowRightDiv(true);
    }
  };

  const toggleDivs = () => {
    setShowRightDiv(!showRightDiv);
  };

  return (
    <div style={{ margin: '-1rem' }}>
      {isMobile && showRightDiv && (
        <div
          className="back-arrow"
          onClick={toggleDivs}
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0)',
            backgroundColor: 'white',
            border: '0px solid #ffffff',
            margin: '-1rem',
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ← Updates
        </div>
      )}

      <div
        className="contentt"
        style={{
          padding: '0',
          margin: '0rem',
          marginTop: '1rem',
          paddingBottom: '5%',
          border: '0',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0)',
        }}
      >
        {/* Left Div with Notifications */}
        <div
          className={`left-div ${showRightDiv && isMobile ? 'hide' : 'show'}`}
          style={{
            overflow: 'auto',
            borderRadius: '0',
            display: showRightDiv && isMobile ? 'none' : 'flex',
            flexDirection: 'column',
            padding: '10px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div
            className="header"
            style={{
              display: showRightDiv && isMobile ? 'none' : 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Updates</h1>
          </div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="notification-item"
              onClick={() => showContent(notification.postLink)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                margin: '5px 0',
                backgroundColor:
                  selectedContent === notification.postLink ? 'rgb(240,240,240)' : 'white',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                border: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0)',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <span style={{ marginRight: '8px' }}>{notification.icon}</span>
              <div style={{ margin: 0, padding: 0, flex: 1 }}>
                <span>{notification.content}</span>
              </div>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.8em',
                  color: '#888',
                }}
              >
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        {/* Right Div for Displaying Content */}
        <div
          className={`right-div ${showRightDiv ? 'show' : 'hide'}`}
          style={{
            borderRadius: 0,
            overflow: 'hidden',
            display: showRightDiv ? 'block' : 'none',
          }}
        >
          {selectedContent ? (
            <iframe
              src={selectedContent}
              title="Post Content"
              style={{
                width: '100%',
                height: '100vh',
                border: 'none',
              }}
            />
          ) : (
            'Select a notification to see content here.'
          )}
        </div>
      </div>
    </div>
  );
};

export default Updates;
