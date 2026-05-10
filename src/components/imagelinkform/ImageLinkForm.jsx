import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onSubmitButton }) => {
  return (
    <div>
      <p className="f3">
        {'Enter URL of a Face Image below and hit "Detect" to try!'} <br />
        {"This AI Brain will detect Face(s)!"}
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-blue"
            onClick={onSubmitButton}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
