import React, { useState } from 'react';
import AddAgent from './AddAgent';
import "../../../styles/index.css";
import "../../../styles/globals.css";
const Agent = () => {
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
            ← Agents                    
            </div>
            
        <div className="contentt" style={{padding: "0", margin: "1 rem", border: "0", boxShadow: "0 4px 8px rgba(0, 0, 0, 0)"}}>
            {/* Left Div with Buttons */}
            <div className={`left-div ${showRightDiv ? 'hide' : 'show'}`} style={{overflow: "auto", borderRadius:'0'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <label htmlFor="">Create new moderator account </label>
                    <button style={{backgroundColor: "var(--create-button-color)", color:'#fff', width:'30%', marginTop:4, padding:4, textAlign: 'center'}} onClick={() => showContent( <AddAgent/>)}>New +</button>
                </div>
                <button style={{alignContent:'left'}} onClick={() => showContent('Content for Button 1')}><img src='https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg' height={20} width={20} alt='No Image'/> Button 1</button>
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

export default Agent;
