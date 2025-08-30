import './ImageLinkForm.css'

const ImageLinkForm = ({ onInputChange, onSubmitButton }) => {
    return (
        <div >
            <p className="f3">
                {'This AI Brain will detect Faces in your pictures!'} <br />
                {'Enter image URL below and hit the Detect button to try!'}
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input className="f4 pa2 w-70 center" type="tex" onChange={onInputChange} />
                    <button
                        className="w-30 grow f4 link ph3 pv2 dib white bg-blue"
                        onClick={onSubmitButton}
                    >
                        Detect
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm