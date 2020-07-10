import React, { Component } from "react";
import classNames from "classnames";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
  }
  hadleClick = (e) => {
    e.preventDefault();
    this.setState({
      isActive: true,
    });
  };
  render() {
    return (
      <li
        className={classNames({
          active: this.props.isActive,
        })}
      >
        <a
          className="waves-effect waves-dark"
          aria-expanded="false"
          onClick={this.props.onClick}
        >
          <i className={this.props.class}></i>
          <span className="hide-menu">{this.props.name}</span>
        </a>
      </li>
    );
  }
}

export default Item;
