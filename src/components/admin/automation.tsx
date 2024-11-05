import React, { useState } from 'react';
import './Automation.css';

const Automation = () => {
    const [selectedContent, setSelectedContent] = useState('');
    const [showRightDiv, setShowRightDiv] = useState(false);

    const showContent = (content) => {
        setSelectedContent(content);
        
        // Only toggle to right div on mobile view
        if (window.innerWidth < 768) {
            setShowRightDiv(true);
        } else {
            setShowRightDiv(true); // Ensure right-div shows in desktop mode without hiding left-div
        }
    };

    const toggleDivs = () => {
        setShowRightDiv(!showRightDiv);
    };

    return (
        <div style={{margin: "-1rem",}}>
            
            <div className="back-arrow" onClick={toggleDivs} style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0)",
                backgroundColor: "white",
                border: "0px solid #ffffff",
                margin: "-1rem ",
                
            }}>
            ← Automation                    
            </div>
            
        <div className="contentt">
            {/* Left Div with Buttons */}
            <div className={`left-div ${showRightDiv ? 'hide' : 'show'}`}>
                <button onClick={() => showContent('Content for Button 1')}>Button 1</button>
                <button onClick={() => showContent('Content for Button 2')}>Button 2</button>
                <button onClick={() => showContent('Content for Button 3')}>Button 3</button>
                <button onClick={() => showContent('Content for Button 4')}>Button 4</button>
            </div>

            {/* Right Div for Displaying Content */}
            <div className={`right-div ${showRightDiv ? 'show' : 'hide'}`}>
                
                <div id="content-display">
                    {selectedContent || 'Select a button to see content here.'}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Automation;
