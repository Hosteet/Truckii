import { useState } from 'react';
import './TextSlider.css';

const TextSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      heading: 'Monitor and Maintain',
      content: 'With real-time data and intuitive analytics, you will have the insights you need to make informed decisions and ensure your fleet is running at its best',
    },
    {
      heading: 'Monitor and Maintain',
      content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  const handleClick = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="text-slider">
      <h2>{slides[activeSlide].heading}</h2>
      <p>{slides[activeSlide].content}</p>

      <div className="carousel-dots">
        {slides.map((slide, index) => (
          <span
            key={index}
            className={`dot ${activeSlide === index ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TextSlider;
