const Progress = ({ currentTime, duration, onSeek }) => {
  const handleSeekChange = (e) => {
    onSeek(e.target.value);
  };

  return (
    <input
      type="range"
      min="0"
      max={duration}
      value={currentTime}
      onChange={handleSeekChange}
    />
  );
};

export default Progress;
