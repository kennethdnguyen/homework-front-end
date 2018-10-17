import ReactDOM from "react-dom";
import React, { Component } from "react";
import ModalImage from "react-modal-image";

// This is a Gif component that will display data for a particular gif
class Gif extends Component {
  render() {
    // the gif prop will have the data for a particular gif
    // gifUrl is the url for the gif to be displayed
    // gifTitle will show the title of the gif when a user clicks on the gif
    // expandUrl is a different size of the gif that will display when a user clicks on the gif
    const { gif } = this.props;
    const gifUrl = gif.images.fixed_width.url;
    const gifTitle = gif.title;
    const expandUrl = gif.images.fixed_height.url;

    return (
      <div className="gif">
        <ModalImage
          small={gifUrl}
          large={expandUrl}
          alt={gifTitle}
          hideDownload={true}
          hideZoom={true}
        />
      </div>
    );
  }
}

export default Gif;
