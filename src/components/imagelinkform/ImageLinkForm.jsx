import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onSubmitButton, onFileChange, onRandomImage, isDetecting }) => {
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
            disabled={isDetecting}
          >
            {isDetecting ? "Detecting…" : "Detect"}
          </button>
          <div className="mt3 flex justify-center items-center">
            <label className="f6 link dim pointer ph3 pv2 dib white bg-dark-gray br2 mr2">
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="dn"
                onChange={(e) => {
                  if (e.target.files[0]) onFileChange(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </label>
            <button
              className="grow f6 link ph3 pv2 dib white bg-dark-green br2"
              onClick={onRandomImage}
              disabled={isDetecting}
            >
              Random
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
