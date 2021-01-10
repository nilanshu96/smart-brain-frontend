import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className="center">
      <div className="absolute mt4">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          width="500px"
          height="auto"
        />
        {boxes.map((box, i) => (
          <div
            key={i}
            className="bounding-box"
            style={{
              inset: `${box.top}% ${box.right}% ${box.bottom}% ${box.left}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
