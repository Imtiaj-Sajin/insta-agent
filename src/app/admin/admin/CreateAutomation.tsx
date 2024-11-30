import React, { useState, useEffect } from "react";
import "./App.css";
import postss from "./posts.json";

// Define the structure of an Instagram post
interface InstagramPost {
  id: string;
  caption: string;
}

const CreateAutomation = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [answerList, setAnswerList] = useState({ comment: [], dm: [] });
  const [selectedType, setSelectedType] = useState("Reply to Comment");
  const [posts, setPosts] = useState<InstagramPost[]>([]); // Store Instagram posts
  const [selectedPost, setSelectedPost] = useState<string | null>(null); // Selected post ID

  // Function to fetch Instagram posts
  const fetchInstagramPosts = async () => {
    const url =
      "https://graph.facebook.com/v21.0/17841470292534936?fields=media%7Bcaption%7D&access_token=EAAnZByvmjelsBOx4AMdYExJ6EJaAd9d19bBfAZAk22LiDFVOV4Dx5uq0y1E44cg4GCT3WhYBjNPXZAaEZADZCvuvzIcyjEmDX7OBwYmnCQ98ZAvwWwGG5CvXbLEa2wTsFphEgNmfDEKzqZBDFONYZAdM1DVIm5J1cO0JU63nlcPZBtHN27xXdYhUV56Fgs6ZAIM4OhJkhtKxUxPMFMZCK49HqCopoXk";

    // try {
    //   const response = await fetch(url);

    //   if (!response.ok) {
    //     throw new Error(`Failed to fetch posts: ${response.statusText}`);
    //   }

      //const data = await response.json();
      const data =postss
      // Transform and set posts
      //const formattedPosts = data.media.data.map((post: { id: string; caption?: string }) => ({
        const formattedPosts = data.data.map((post: { id: string; caption?: string }) => ({
          id: post.id,
        caption: post.caption || "No caption available",
      }));

      setPosts(formattedPosts);
    // } catch (error) {
    //   console.error("Error fetching Instagram posts:", error);
    // }
  };

  useEffect(() => {
    // Fetch posts on component mount
    fetchInstagramPosts();
  }, []);

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

  const handleSubmit = async () => {
    if (!selectedPost || !keywords.length) {
      alert("Please select a post and add keywords.");
      return;
    }
  
    const autoType =
      selectedType === "Reply to Comment"
        ? 1
        : selectedType === "Send DM"
        ? 2
        : 3;
  
    try {
      const response = await fetch("/api/addAautomation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: selectedPost,
          auto_type: autoType,
          keywords,
          commentAnswers: answerList.comment,
          dmAnswers: answerList.dm,
        }),
      });
  
      if (response.ok) {
        alert("Automation created successfully!");
        setKeywords([]);
        setAnswerList({ comment: [], dm: [] });
        setSelectedPost(null);
        setSelectedType("Reply to Comment");
      } else {
        const { error } = await response.json();
        alert(error || "Failed to create automation.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the automation.");
    }
  };
  

  return (
    <>
    <div className="container" style={{borderRadius:30,paddingTop:20,paddingBottom:20,background:'linear-gradient(135deg, #D76D77, #49267e)'}}>
      <div className="dropdown" style={{ borderRadius:25,border: 0,marginTop:0,marginBottom:0,}}>
        <label>Select Type</label>
        <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
          <option>Reply to Comment</option>
          <option>Send DM</option>
          <option>Comment+DM</option>
        </select>
      </div>

      <div className="dropdown" style={{ borderRadius:25,border: 0,marginTop:0,marginBottom:0}}>
        <label>Select Post</label>
        <select onChange={(e) => setSelectedPost(e.target.value)} value={selectedPost || ""}>
          <option value="" disabled>
            Select a post
          </option>
          {posts.map((post) => (
            <option key={post.id} value={post.id}>
              {/* {post.id} */}
              {post.caption.slice(0,30)+" ..."}
            </option>
          ))}
        </select>
      </div>
    </div>

      <input type="file" className="upload-csv" />

      <div className="keywords">
        <label>Keywords</label>
        <div className="keyword-input">
          <input
            type="text"
            placeholder="Add keyword"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addKeyword(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
            style={{ minWidth: "20%" }}
          />
          <button onClick={() => addKeyword("")} style={{ maxWidth: "20%" }}>
            Add
          </button>
        </div>
        <div className="keyword-list" style={{ margin: 0, padding: 0.1, border: 0, boxShadow: "0 0px 0px" }}>
          {keywords.map((keyword, index) => (
            <span key={index} className="keyword">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {(selectedType === "Reply to Comment" || selectedType === "Comment+DM") && (
        <div className="answer-list">
          <label>Answer List (Comment)</label>
          <div className="answer-input">
            <input
              type="text"
              placeholder="Add answer"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addAnswer(e.currentTarget.value, "comment");
                  e.currentTarget.value = "";
                }
              }}
              style={{ minWidth: "20%" }}
            />
            <button style={{ maxWidth: "20%" }} onClick={() => addAnswer("", "comment")}>
              Add
            </button>
          </div>
          <div className="keyword-list" style={{ margin: 0, padding: 0.1, border: 0, boxShadow: "0 0px 0px" }}>
            {answerList.comment.map((answer, index) => (
              <span key={index} className="keyword">
                {answer}
              </span>
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
                if (e.key === "Enter") {
                  addAnswer(e.currentTarget.value, "dm");
                  e.currentTarget.value = "";
                }
              }}
              style={{ minWidth: "20%" }}
            />
            <button style={{ maxWidth: "20%" }} onClick={() => addAnswer("", "dm")}>
              Add
            </button>
          </div>
          <div className="keyword-list" style={{ margin: 0, padding: 0.1, border: 0, boxShadow: "0 0px 0px" }}>
            {answerList.dm.map((answer, index) => (
              <span key={index} className="keyword">
                {answer}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: "0px", border: 0, boxShadow: "0 0px 0px", alignContent: "center", justifyItems: "center" }}>
      <button
          style={{ color: "white", minHeight: 30, background: "linear-gradient(135deg, #D76D77, #49267e)" }}
          onClick={handleSubmit}
        >
          Submit
      </button>
      </div>
    </>
  );
};

export default CreateAutomation;
