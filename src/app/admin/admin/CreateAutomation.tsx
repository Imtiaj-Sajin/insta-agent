import React, { useState, useEffect } from "react";
import "./CreateAutomation.css";
import postss from "./posts.json";

// Define the structure of Instagram posts
interface InstagramPost {
  id: string;
  caption: string;
}

const CreateAutomation = () => {
  const [selectedType, setSelectedType] = useState<string>("Comment + DM");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [commentAnswers, setCommentAnswers] = useState<string[]>([]);
  const [dmAnswers, setDmAnswers] = useState<string[]>([]);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<string>("");

  // Fetch Instagram posts
  const fetchPosts = async () => {
    const data = postss;
    const formattedPosts = data.data.map((post: { id: string; caption?: string }) => ({
      id: post.id,
      caption: post.caption || "No caption available",
    }));
    setPosts(formattedPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add keyword logic
  const addKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) setKeywords([...keywords, keyword]);
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // Add answers logic
  const addAnswer = (type: "comment" | "dm", answer: string) => {
    if (type === "comment" && answer && !commentAnswers.includes(answer)) {
      setCommentAnswers([...commentAnswers, answer]);
    }
    if (type === "dm" && answer && !dmAnswers.includes(answer)) {
      setDmAnswers([...dmAnswers, answer]);
    }
  };

  const removeAnswer = (type: "comment" | "dm", index: number) => {
    if (type === "comment") {
      setCommentAnswers(commentAnswers.filter((_, i) => i !== index));
    } else {
      setDmAnswers(dmAnswers.filter((_, i) => i !== index));
    }
  };

  const handleCSVUpload = (file: File) => {
    // Create a FileReader to read the CSV file
    const reader = new FileReader();
  
    reader.onload = (event) => {
      // Get the CSV content as text from the reader
      const csvContent = event.target?.result as string;
      
      if (!csvContent) {
        alert("Error reading the CSV file.");
        return;
      }
  
      // Split the content into rows by newline
      const data = csvContent.split('\n').map(row => row.trim()); // Trim each row to remove any extra spaces
  
      if (!data.length) {
        alert("CSV is empty or invalid.");
        return;
      }
  
      const newKeywords: string[] = [];
      const newCommentAnswers: string[] = [];
      const newDmAnswers: string[] = [];
  
      data.forEach((row, index) => {
        // Skip header row (index 0)
        if (index === 0) return;
  
        // Split the row by commas to extract columns
        const columns = row.split(',');
  
        // Push values into the respective arrays, trimming spaces
        if (columns[0]) newKeywords.push(columns[0].trim()); // First column -> Keywords
        if (selectedType !== "Send DM" && columns[1]) newCommentAnswers.push(columns[1].trim()); // Second column -> Comments
        if (selectedType !== "Reply to Comment" && columns[2]) newDmAnswers.push(columns[2].trim()); // Third column -> DMs
      });
  
      // Assuming you have state functions to update the arrays
      setKeywords((prev) => [...prev, ...newKeywords]);
      if (selectedType !== "Send DM") setCommentAnswers((prev) => [...prev, ...newCommentAnswers]);
      if (selectedType !== "Reply to Comment") setDmAnswers((prev) => [...prev, ...newDmAnswers]);
    };
  




    
    reader.onerror = (error) => {
      console.error("Error reading the file:", error);
      alert("Error reading the CSV file.");
    };
  
    reader.readAsText(file); // Read the file as text
  };
  

  const handleSubmit = async () => {
    if (!selectedPost || keywords.length === 0) {
      alert("Please select a post and add keywords.");
      return;
    }

    const autoType =
      selectedType === "Reply to Comment" ? 1 : selectedType === "Send DM" ? 2 : 3;

    try {
      const response = await fetch("/api/addAautomation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: selectedPost,
          auto_type: autoType,
          keywords,
          commentAnswers,
          dmAnswers,
        }),
      });

      if (response.ok) {
        alert("Automation created successfully!");
        resetForm();
      } else {
        alert("Failed to create automation.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating automation.");
    }
  };

  const resetForm = () => {
    setKeywords([]);
    setCommentAnswers([]);
    setDmAnswers([]);
    setSelectedPost("");
    setSelectedType("Comment + DM");
  };

  return (
    <div className="container">
      {/* Header */}
      <h1>Create Automation</h1>

      {/* Select Type */}
      <label>Select Type</label>
      <select
        className="input"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option>Reply to Comment</option>
        <option>Send DM</option>
        <option>Comment + DM</option>
      </select>

      {/* Select Post */}
      <label>Select Post</label>
      <select
        className="input"
        value={selectedPost}
        onChange={(e) => setSelectedPost(e.target.value)}
      >
        <option value="" disabled>
          Select a post
        </option>
        {posts.map((post) => (
          <option key={post.id} value={post.id}>
            {post.caption.slice(0, 30) + "..."}
          </option>
        ))}
      </select>

      {/* Upload CSV Section */}
      <div className="csv-upload-section">
        <label className="csv-instruction">
          {selectedType === "Reply to Comment" &&
            "Upload CSV: First column - Keywords, Second column - Comment Reply."}
          {selectedType === "Send DM" &&
            "Upload CSV: First column - Keywords, Second column - DM Reply."}
          {selectedType === "Comment + DM" &&
            "Upload CSV: First column - Keywords, Second - Comment Reply, Third - DM Reply."}
        </label>
        <div className="csv-upload-container">
          <input
            type="file"
            accept=".csv"
            className="upload-csv-input"
            style={{ padding: "0px", border: "0px" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleCSVUpload(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      <div style={{ overflowY: "auto", maxHeight: "400px" }}>
        {/* Keywords */}
        <label>Keywords</label>
        <div className="tag-list">
          {keywords.map((keyword, index) => (
            <div key={index} className="tag">
              {keyword}
              <button onClick={() => removeKeyword(index)}>✖</button>
            </div>
          ))}
        </div>

        {/* Comment Answers */}
        {(selectedType === "Reply to Comment" || selectedType === "Comment + DM") && (
          <>
            <label>Answer List- Comment</label>
            <div className="tag-list">
              {commentAnswers.map((answer, index) => (
                <span key={index} className="tag">
                  {answer}
                  <button onClick={() => removeAnswer("comment", index)}>✖</button>
                </span>
              ))}
            </div>
          </>
        )}

        {/* DM Answers */}
        {(selectedType === "Send DM" || selectedType === "Comment + DM") && (
          <>
            <label>Answer List DM</label>
            <div className="tag-list">
              {dmAnswers.map((answer, index) => (
                <span key={index} className="tag">
                  {answer}
                  <button onClick={() => removeAnswer("dm", index)}>✖</button>
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Submit and Cancel */}
      <div className="action-buttons">
        <button className="cancel-btn" onClick={resetForm}>
          Reset
        </button>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateAutomation;
