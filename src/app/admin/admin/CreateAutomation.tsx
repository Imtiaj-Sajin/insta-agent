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

      {/* Keywords */}
      <label>Keywords</label>
      <div className="input-group">
        <input
          className="input"
          type="text"
          placeholder="Add keyword"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addKeyword(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
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
          <label>Answer List</label>
          <div className="input-group">
            <input
              className="input"
              type="text"
              placeholder="Search or Create New"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addAnswer("comment", e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
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
          <div className="input-group">
            <input
              className="input"
              type="text"
              placeholder="Search or Create New"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addAnswer("dm", e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
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
