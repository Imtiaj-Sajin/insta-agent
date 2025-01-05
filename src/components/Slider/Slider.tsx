import React, { useState } from "react";
import "./Slider.css";

const AutomationSlider = () => {
  const [messageDelay, setMessageDelay] = useState({ min: 0.5, max: 600 }); // Seconds for message reply
  const [commentDelay, setCommentDelay] = useState({ min: 0.5, max: 600 }); // Seconds for comment reply

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max",
    delayType: "message" | "comment"
  ) => {
    const value = parseFloat(e.target.value);

    if (delayType === "message") {
      setMessageDelay((prev) => {
        if (type === "min" && value < prev.max) {
          return { ...prev, min: value };
        }
        if (type === "max" && value > prev.min) {
          return { ...prev, max: value };
        }
        return prev;
      });
    } else if (delayType === "comment") {
      setCommentDelay((prev) => {
        if (type === "min" && value < prev.max) {
          return { ...prev, min: value };
        }
        if (type === "max" && value > prev.min) {
          return { ...prev, max: value };
        }
        return prev;
      });
    }
  };

  const formatTime = (value: number) => {
    if (value < 60) {
      return `${Math.floor(value)}s`;
    }
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return seconds > 0 ? `${minutes}min ${seconds}s` : `${minutes}min`;
  };

  const calculatePercent = (value: number) =>
    ((value - 0.5) / (600 - 0.5)) * 100;

  return (
    <div className="slider-wrapper">
      {/* Message Reply Delay */}
      <label className="slider-label">Message Reply Delay:</label>
      <div className="slider-container">
        <div
          className="slider-track"
          style={{
            left: `${calculatePercent(messageDelay.min)}%`,
            right: `${100 - calculatePercent(messageDelay.max)}%`,
          }}
        ></div>

        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={messageDelay.min}
          onChange={(e) => handleSliderChange(e, "min", "message")}
          className="slider-thumb"
        />

        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={messageDelay.max}
          onChange={(e) => handleSliderChange(e, "max", "message")}
          className="slider-thumb"
        />
      </div>
      <div className="slider-values">
        <div>
          <label>Min:</label>
          <input
            type="text"
            value={formatTime(messageDelay.min)}
            readOnly
            className="slider-value-display"
          />
        </div>
        <div>
          <label>Max:</label>
          <input
            type="text"
            value={formatTime(messageDelay.max)}
            readOnly
            className="slider-value-display"
          />
        </div>
      </div>
<br />
      {/* Comment Reply Delay */}
      <label className="slider-label">Comment Reply Delay:</label>
      <div className="slider-container">
        <div
          className="slider-track"
          style={{
            left: `${calculatePercent(commentDelay.min)}%`,
            right: `${100 - calculatePercent(commentDelay.max)}%`,
          }}
        ></div>

        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={commentDelay.min}
          onChange={(e) => handleSliderChange(e, "min", "comment")}
          className="slider-thumb"
        />

        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={commentDelay.max}
          onChange={(e) => handleSliderChange(e, "max", "comment")}
          className="slider-thumb"
        />
      </div>
      <div className="slider-values">
        <div>
          <label>Min:</label>
          <input
            type="text"
            value={formatTime(commentDelay.min)}
            readOnly
            className="slider-value-display"
          />
        </div>
        <div>
          <label>Max:</label>
          <input
            type="text"
            value={formatTime(commentDelay.max)}
            readOnly
            className="slider-value-display"
          />
        </div>
      </div>
    </div>
  );
};

export default AutomationSlider;
