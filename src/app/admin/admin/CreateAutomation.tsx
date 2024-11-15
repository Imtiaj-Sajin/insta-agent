import React, { useState } from 'react';
import './App.css';

const CreateAutomation = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [answerList, setAnswerList] = useState({ comment: [], dm: [] });
  const [selectedType, setSelectedType] = useState("Reply to Comment");

  const addKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };

  const addAnswer = (answer: string, type: string) => {
    if (answer && !answerList[type].includes(answer)) {
      setAnswerList((prev) => ({ ...prev, [type]: [...prev[type], answer] }));
    }
  };

  return (
    <>
      <div className="dropdown">
        <label>Select Type</label>
        <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
          <option>Reply to Comment</option>
          <option>Send DM</option>
          <option>Comment+DM</option>
        </select>
      </div>

      <div className="dropdown" style={{ border: 0 }}>
        <label>Select Post</label>
        <select>
          <option>Only 2250 tk..! (Here you go..)</option>
          <option>Get the best quality at..</option>
          <option>Freaking comfortable..</option>
          <option>see more</option>
        </select>
      </div>
      
      <input type="file" className="upload-csv" />
      
      <div className="keywords">
        <label>Keywords</label>
        <div className="keyword-input">
          <input
            type="text" 
            placeholder="Add keyword"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addKeyword(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            style={{minWidth:'20%'}}
          />
          <button onClick={() => addKeyword('')} style={{maxWidth:'20%'}}>Add</button>
        </div>
        <div className="keyword-list" style={{ margin: 0, padding: 0.1, border: 0, boxShadow: '0 0px 0px' }}>
          {keywords.map((keyword, index) => (
            <span key={index} className="keyword">{keyword}</span>
          ))}
        </div>
      </div>

      {/* Conditionally render answer lists based on selected type */}
      {(selectedType === "Reply to Comment" || selectedType === "Comment+DM") && (
        <div className="answer-list">
          <label>Answer List (Comment)</label>
          <div className="answer-input">
            <input
              type="text"
              placeholder="Add answer"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addAnswer(e.currentTarget.value, 'comment');
                  e.currentTarget.value = '';
                }
              }}
              style={{minWidth:'20%'}}
            />
            <button style={{maxWidth:'20%'}} onClick={() => addAnswer('', 'comment')}>Add</button>
          </div>
          <div className="keyword-list" style={{ margin: 0, padding: 0.1, border: 0, boxShadow: '0 0px 0px' }}>
            {answerList.comment.map((answer, index) => (
              <span key={index} className="keyword">{answer}</span>
            ))}
          </div>
        </div>
      )}

      {(selectedType === "Send DM" || selectedType === "Comment+DM") && (
        <div className="answer-list">
          <label>Answer List (DM)</label>
          <div className="answer-input">
            <input
              type="text"
              placeholder="Add answer"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addAnswer(e.currentTarget.value, 'dm');
                  e.currentTarget.value = '';
                }
              }}
              style={{minWidth:'20%'}}
            />
            <button style={{maxWidth:'20%'}} onClick={() => addAnswer('', 'dm')}>Add</button>
          </div>
          <div className="keyword-list" style={{ margin: 0, padding: 0.1, border: 0, boxShadow: '0 0px 0px' }}>
            {answerList.dm.map((answer, index) => (
              <span key={index} className="keyword">{answer}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '0px', border: 0, boxShadow: '0 0px 0px', alignContent: 'center', justifyItems: 'center' }}>
        <button style={{ minHeight: 30 }}>Submit</button>
      </div>
    </>
  );
};

export default CreateAutomation;
