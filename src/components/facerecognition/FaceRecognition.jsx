import "./FaceRecognition.css"

const FaceRecognition = ({ imgURL, bboxes }) => {
    return (
        <div className="center ma">
            <div className="absolute mt2">
                {imgURL !== ''
                    ? <img id="inputImage" src={imgURL} alt="input image" width="500px" height="auto" />
                    : <></>
                }
                {/* <div className="bbox" style={{
                    top: bbox.topRow,
                    right: bbox.rightCol,
                    bottom: bbox.bottomRow,
                    left: bbox.leftCol,
                }}></div> */}
                {bboxes.map(bbox => {
                    <div
                        className="bbox"
                        style={{
                            top: bbox.topRow,
                            right: bbox.rightCol,
                            bottom: bbox.bottomRow,
                            left: bbox.leftCol,
                        }}
                    ></div>
                })}
            </div>
        </div>
    )
}

export default FaceRecognition