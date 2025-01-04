import React, { useState } from "react";
import "./Slider.css";

const AutomationSlider = (min:any, max:any) => {

  const [delay, setDelay] = useState({ min: 0.5, max: 600 }); // Seconds

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
    const value = parseFloat(e.target.value);

    setDelay((prev) => {
      if (type === "min" && value < prev.max) {
        return { ...prev, min: value };
      }
      if (type === "max" && value > prev.min) {
        return { ...prev, max: value };
      }
      return prev;
    });
  };

  const formatTime = (value: number) => {
    if (value < 60) {
      return `${Math.floor(value)}s`;
    }
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return seconds > 0 ? `${minutes}min ${seconds}s` : `${minutes}min`;
  };

  const minPercent = ((delay.min - 0.5) / (600 - 0.5)) * 100;
  const maxPercent = ((delay.max - 0.5) / (600 - 0.5)) * 100;

  return (
    <div className="slider-wrapper">
      <label className="slider-label">Message Delay:</label>
      <div className="slider-container">
        {/* Track */}
        <div
          className="slider-track"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        ></div>

        {/* Min Handle */}
        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={delay.min}
          onChange={(e) => handleSliderChange(e, "min")}
          className="slider-thumb"
        />

        {/* Max Handle */}
        <input
          type="range"
          min={0.5}
          max={600}
          step={0.5}
          value={delay.max}
          onChange={(e) => handleSliderChange(e, "max")}
          className="slider-thumb"
        />
      </div>
      <div className="slider-values">
        <div>
          <label>Min:</label>
          <input
            type="text"
            value={formatTime(delay.min)}
            readOnly
            className="slider-value-display"
          />
        </div>
        <div>
          <label>Maxc: {max?max:2}</label>
          <input
            type="text"
            value={formatTime(delay.max)}
            readOnly
            className="slider-value-display"
          />
        </div>
      </div>
    </div>
  );
};

export default AutomationSlider;
