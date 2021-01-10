import './ImageLinkForm.css';

const ImageLinkForm = ({onButtonClick}) => {
  return (
    <div>
      <div className="f3">
        <p>This button can detect human faces in your pictures. Please give it a try!</p>
      </div>
      <div className="center">
        <div className="form pa4 br3 shadow-5 center">
          <input type="text" className="f4 pa2 w-70 center" />
          <button onClick={onButtonClick} className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple">
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
