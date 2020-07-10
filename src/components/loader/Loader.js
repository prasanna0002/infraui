import React, { Component } from "react";
import classNames from "classnames";

class Loader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className={classNames(
          !this.props.position ? "loaderWithPosFixed" : "loaderWithoutPos"
        )}
      >
        <img
          className={classNames(
            !this.props.position ? "loaderBig" : "loaderSmall"
          )}
          src="./styles/images/loader1.gif"
          alt="loader"
        />
      </div>
    );
  }
}

export default Loader;
