import { Component } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { baseURL } from "./config";
import Navigation from "./components/navigation/Navigation";
import Logo from "./components/logo/Logo";
import Rank from "./components/rank/Rank";
import ImageLinkForm from "./components/imagelinkform/ImageLinkForm";
import FaceRecognition from "./components/facerecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import ParticlesBg from "particles-bg";
import "./App.css";

const initState = {
  input: "",
  imgURL: "",
  bboxes: [],
  imgError: "",
  isDetecting: false,
  detectionDone: false,
  route: "signIn",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initState;
    this.faceDetector = null;
    this._blobURL = null;
  }

  loadUser = (userData) => {
    const { id, name, email, entries, joined } = userData;
    this.setState({
      user: {
        id: id,
        name: name,
        email: email,
        entries: entries,
        joined: joined,
      },
    });
  };

  getOrCreateFaceDetector = async () => {
    if (this.faceDetector) return this.faceDetector;
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );
    //define model asset path here. More models can be found here: https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector#models
    const modelAssetPath =
      "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_full_range/float16/1/blaze_face_full_range.tflite";

    this.faceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath,
        delegate: "GPU",
      },
      runningMode: "IMAGE",
    });
    return this.faceDetector;
  };

  calcFaceLocation = async (imageUrl) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const faceDetector = await this.getOrCreateFaceDetector();
    const result = faceDetector.detect(img);

    const renderedWidth = 500;
    const scaleFactor = renderedWidth / img.naturalWidth;
    const renderedHeight = img.naturalHeight * scaleFactor;

    return result.detections.map((detection) => {
      const { originX, originY, width, height } = detection.boundingBox;
      return {
        leftCol: originX * scaleFactor,
        topRow: originY * scaleFactor,
        rightCol: renderedWidth - (originX + width) * scaleFactor,
        bottomRow: renderedHeight - (originY + height) * scaleFactor,
      };
    });
  };

  displayBBox = (bboxes) => {
    this.setState({ bboxes: bboxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onSubmitButton = async () => {
    this.setState({ imgURL: this.state.input, imgError: "", isDetecting: true, detectionDone: false });
    try {
      const boxes = await this.calcFaceLocation(this.state.input);
      this.displayBBox(boxes);
      this.setState({ detectionDone: true });
      const response = await fetch(`${baseURL}image`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: this.state.user.id,
        }),
      });
      const count = await response.json();
      this.setState({ user: { ...this.state.user, entries: count } });
    } catch (error) {
      console.log("error", error);
      this.setState({ imgError: "Could not load this image. The URL may not support cross-origin access — try a different URL." });
    } finally {
      this.setState({ isDetecting: false });
    }
  };

  onFileChange = (objectURL) => {
    if (this._blobURL) URL.revokeObjectURL(this._blobURL);
    this._blobURL = objectURL;
    this.setState({ input: objectURL }, () => this.onSubmitButton());
  };

  onRandomImage = async () => {
    try {
      const res = await fetch("https://randomuser.me/api/");
      const data = await res.json();
      const url = data.results[0].picture.large;
      this.setState({ input: url }, () => this.onSubmitButton());
    } catch (error) {
      console.log("Random image fetch failed", error);
    }
  };

  onRouteChange = (page) => {
    if (page !== "home") {
      this.setState(initState);
    } else if (page === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: page });
  };

  render() {
    const { isSignedIn, route, bboxes, imgURL, imgError, isDetecting, detectionDone, user } = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#ffffff" type="cobweb" bg={true} />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === "home" ? (
          <>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmitButton={this.onSubmitButton}
              onFileChange={this.onFileChange}
              onRandomImage={this.onRandomImage}
              isDetecting={isDetecting}
            />
            {imgError && <p className="white f5 mt2">{imgError}</p>}
            <FaceRecognition bboxes={bboxes} imgURL={imgURL} detectionDone={detectionDone} />
          </>
        ) : route === "signIn" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;

/* To-Dos
- add loading screen when signing in or registering
- allow you to upload your own images for prediction
- allow you to fetch random face image from the web?
*/
