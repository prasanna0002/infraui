import React, { Component } from "react";
import classNames from "classnames";
import IFRAME from "react-iframe";
class Iframe extends Component {
  constructor(props) {
    super(props);
  }
  onIframeLoad = () => {
    this.props.onLoad();
  };
  render() {
    return (
      <IFRAME
        url={this.props.url}
        id="myId"
        className="iframe"
        allow="fullscreen"
        onLoad={this.onIframeLoad}
      />
    );
  }
}

export default Iframe;
