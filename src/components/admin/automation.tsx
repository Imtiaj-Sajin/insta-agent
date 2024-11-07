import React, { useState } from 'react';
import './Automation.css';
import CreateAutomation from './CreateAutomation';  

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
            
        <div className="contentt" style={{padding: "0", margin: "1 rem", border: "0", boxShadow: "0 4px 8px rgba(0, 0, 0, 0)"}}>
            {/* Left Div with Buttons */}
            <div className={`left-div ${showRightDiv ? 'hide' : 'show'}`} style={{overflow: "auto", borderRadius:'0'}}>
                <button style={{backgroundColor: "rgb(7,77,88)"}} onClick={() => showContent( <CreateAutomation/>)}>Create Automation</button>
                <button onClick={() => showContent('Content for Button 1')}>Button 1</button>
                <button onClick={() => showContent('Content for Button 2')}>Button 2</button>
                <button onClick={() => showContent('Content for Button 3')}>Button 3</button>
                <button onClick={() => showContent('Content for Button 4')}>Button 4</button>
                <button onClick={() => showContent('Content for Button 1')}>Button 1</button>
                <button onClick={() => showContent('Content for Button 2')}>Button 2</button>
                <button onClick={() => showContent('Content for Button 3')}>Button 3</button>
                <button onClick={() => showContent('Content for Button 4')}>Button 4</button>
                <button onClick={() => showContent('Content for Button 1')}>Button 1</button>
                <button onClick={() => showContent('Content for Button 2')}>Button 2</button>
                <button onClick={() => showContent('Content for Button 3')}>Button 3</button>
                <button onClick={() => showContent('Content for Button 4')}>Button 4</button>
                <button onClick={() => showContent('Content for Button 4')}>Button 4</button>
                <button onClick={() => showContent('Content for Button 1')}>Button 1</button>
                <button onClick={() => showContent('Content for Button 2')}>Button 2</button>
                <button onClick={() => showContent('Content for Button 3')}>Button 3</button>
                <button onClick={() => showContent('Content for Button 4')}>Button 4</button>
                <button onClick={() => showContent('Content for Button 4')}>Button 4</button>
                <button onClick={() => showContent('Content for Button 1')}>Button 1</button>
                <button onClick={() => showContent('Content for Button 2')}>Button 2</button>
                <button onClick={() => showContent('Content for Button 3')}>Button 3</button>
                <button onClick={() => showContent('Content for Button 4')}>Button 4</button>
            </div>

            {/* Right Div for Displaying Content */}
            <div className={`right-div ${showRightDiv ? 'show' : 'hide'}`} style={{borderRadius:0}}>
                {/* , marginBottom:"100px"*/}
                <div id="content-display" style={{marginBottom:100}}>
                    {selectedContent || 'Select a button to see content here.'}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Automation;
