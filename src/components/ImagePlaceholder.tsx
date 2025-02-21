import React from "react";

// Function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to generate a text-based placeholder with a gradient background
const generateTextPlaceholder = (title, className) => {
  // Create two random colors for the gradient
  const color1 = getRandomColor();
  const color2 = getRandomColor();

  // Use the first letter of the title or a default string if title is not available
  const text = title || "N/A";

  // Style for the placeholder
  const placeholderStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#fff",
    background: `linear-gradient(45deg, ${color1}, ${color2})`,
  };

  return (
    <div className={className} style={placeholderStyle}>
      {text}
    </div>
  );
};

const ImagePlaceholder = ({ title, className }) => {
  console.log("image render");

  return generateTextPlaceholder(title, className);
};

export default React.memo(ImagePlaceholder);
