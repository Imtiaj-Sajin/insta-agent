import React, { useState } from 'react';
import './App.css';

const CreateAutomation = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [answerList, setAnswerList] = useState<string[]>([]);

  const addKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };

  const addAnswer = (answer: string) => {
    if (answer && !answerList.includes(answer)) {
      setAnswerList([...answerList, answer]);
    }
  };

  return (
    <>
      <div className="dropdown">
        <label>Select Type</label>
        <select>
          <option>Reply to Comment</option>
          <option>Send DM</option>
          <option>Comment+DM</option>
        </select>
      </div>

      <div className="dropdown" style={{border:0}}>
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
          />
          <button onClick={() => addKeyword('')}>Add</button>
        </div>
        <div className="keyword-list">
          {keywords.map((keyword, index) => (
            <span key={index} className="keyword">{keyword}</span>
          ))}
        </div>
      </div>

      <div className="answer-list">
        <label>Answer List</label>
        <div className="answer-input">
          <input
            type="text"
            placeholder="Add answer"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addAnswer(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button onClick={() => addAnswer('')}>Add</button>
        </div>
        <div className="keyword-list">
          {answerList.map((keyword, index) => (
            <span key={index} className="keyword">{keyword}</span>
          ))}
        </div>
        
      </div>
      <div><button>Submit</button></div>
      
    </>
  );
};

export default CreateAutomation;
