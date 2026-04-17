import { Component } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import Navigation from "./components/navigation/Navigation";
import Logo from "./components/logo/Logo";
import Rank from "./components/rank/Rank";
import ImageLinkForm from "./components/imagelinkform/ImageLinkForm";
import FaceRecognition from "./components/facerecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import ParticlesBg from "particles-bg";
import "./App.css";

const baseURL = "https://ai-face-recognition-api.onrender.com/";

const initState = {
  input: "",
  imgURL: "",
  bboxes: [],
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

  // faceLocation = (data) => {
  //   console.log(data);
  //   const regions = data.outputs[0].data.regions;
  //   const image = document.getElementById("inputImage");
  //   const width = Number(image.width);
  //   const height = Number(image.height);

  //   const bboxes = regions.map((region) => {
  //     const boundingBox = region.region_info.bounding_box;

  //     return {
  //       leftCol: boundingBox.left_col * width,
  //       topRow: boundingBox.top_row * height,
  //       rightCol: width - boundingBox.right_col * width,
  //       bottomRow: height - boundingBox.bottom_row * height,
  //     };

  //     // region.data.concepts.forEach(concept => {
  //     //   // Accessing and rounding the concept value
  //     //   const name = concept.name;
  //     //   const value = concept.value.toFixed(4);
  //     // });
  //   });
  //   return bboxes;
  // };

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

  // onSubmitButton = async () => {
  //   this.setState({ imgURL: this.state.input });
  //   fetch(baseURL + "imageurl", {
  //     method: "post",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       input: this.state.input,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result) {
  //         fetch(baseURL + "image", {
  //           method: "put",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             id: this.state.user.id,
  //           }),
  //         })
  //           .then((response) => response.json())
  //           .then((count) => {
  //             this.setState(Object.assign(this.state.user, { entries: count }));
  //           })
  //           .catch(console.log);
  //       }
  //       this.displayBBox(this.faceLocation(result));
  //     })
  //     .catch((error) => console.log("error", error));
  // };

  onButtonSubmit = async () => {
    this.setState({ imgURL: this.state.input });
    try {
      const boxes = await this.calcFaceLocation(this.state.input);
      this.displayFaceBox(boxes);
      fetch(`${baseURL}/image`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: this.state.user.id,
        }),
      })
        .then((res) => res.json())
        .then((count) => {
          this.setState(Object.assign(this.state.user, { entries: count }));
        });
    } catch (error) {
      console.log("error", error);
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
    const { isSignedIn, route, bboxes, imgURL, user } = this.state;
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
            />
            <FaceRecognition bboxes={bboxes} imgURL={imgURL} />
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
- database on spreadsheet? -> try if it's possible to create db again on render
*/
