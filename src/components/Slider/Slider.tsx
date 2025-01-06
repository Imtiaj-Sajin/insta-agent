import React, { useState, useEffect } from "react";
import "./Slider.css";

type AutomationSliderProps = {
  messageMin: number;
  messageMax: number;
  commentMin: number;
  commentMax: number;
  onMessageDelayChange: (min: number, max: number) => void;
  onCommentDelayChange: (min: number, max: number) => void;
};

const AutomationSlider: React.FC<AutomationSliderProps> = ({
  messageMin,
  messageMax,
  commentMin,
  commentMax,
  onMessageDelayChange,
  onCommentDelayChange,
}) => {
  const [localMessageDelay, setLocalMessageDelay] = useState({ min: messageMin, max: messageMax });
  const [localCommentDelay, setLocalCommentDelay] = useState({ min: commentMin, max: commentMax });

  useEffect(() => {
    // Synchronize with parent when prop values change
    setLocalMessageDelay({ min: messageMin, max: messageMax });
    setLocalCommentDelay({ min: commentMin, max: commentMax });
  }, [messageMin, messageMax, commentMin, commentMax]);

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max",
    delayType: "message" | "comment"
  ) => {
    const value = parseFloat(e.target.value);

    if (delayType === "message") {
      setLocalMessageDelay((prev) => {
        let newDelay = { ...prev };
        if (type === "min" && value < prev.max) {
          newDelay.min = value;
        }
        if (type === "max" && value > prev.min) {
          newDelay.max = value;
        }
        if (newDelay !== prev) {
          onMessageDelayChange(newDelay.min, newDelay.max); // Notify parent of change
        }
        return newDelay;
      });
    } else if (delayType === "comment") {
      setLocalCommentDelay((prev) => {
        let newDelay = { ...prev };
        if (type === "min" && value < prev.max) {
          newDelay.min = value;
        }
        if (type === "max" && value > prev.min) {
          newDelay.max = value;
        }
        if (newDelay !== prev) {
          onCommentDelayChange(newDelay.min, newDelay.max); // Notify parent of change
        }
        return newDelay;
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
            left: `${calculatePercent(localMessageDelay.min)}%`,
            right: `${100 - calculatePercent(localMessageDelay.max)}%`,
          }}
        ></div>

        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={localMessageDelay.min}
          onChange={(e) => handleSliderChange(e, "min", "message")}
          className="slider-thumb"
        />

        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={localMessageDelay.max}
          onChange={(e) => handleSliderChange(e, "max", "message")}
          className="slider-thumb"
        />
      </div>
      <div className="slider-values">
        <div>
          <label>Min:</label>
          <input
            type="text"
            value={formatTime(localMessageDelay.min)}
            readOnly
            className="slider-value-display"
          />
        </div>
        <div>
          <label>Max:</label>
          <input
            type="text"
            value={formatTime(localMessageDelay.max)}
            readOnly
            className="slider-value-display"
          />
        </div>
      </div>

      {/* Comment Reply Delay */}
      <br />
      <label className="slider-label">Comment Reply Delay:</label>
      <div className="slider-container">
        <div
          className="slider-track"
          style={{
            left: `${calculatePercent(localCommentDelay.min)}%`,
            right: `${100 - calculatePercent(localCommentDelay.max)}%`,
          }}
        ></div>

        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={localCommentDelay.min}
          onChange={(e) => handleSliderChange(e, "min", "comment")}
          className="slider-thumb"
        />

        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={localCommentDelay.max}
          onChange={(e) => handleSliderChange(e, "max", "comment")}
          className="slider-thumb"
        />
      </div>
      <div className="slider-values">
        <div>
          <label>Min:</label>
          <input
            type="text"
            value={formatTime(localCommentDelay.min)}
            readOnly
            className="slider-value-display"
          />
        </div>
        <div>
          <label>Max:</label>
          <input
            type="text"
            value={formatTime(localCommentDelay.max)}
            readOnly
            className="slider-value-display"
          />
        </div>
      </div>
    </div>
  );
};

export default AutomationSlider;
