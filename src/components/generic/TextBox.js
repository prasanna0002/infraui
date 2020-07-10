import React, { Component } from "react";
import classNames from "classnames";

class TextBox extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      labelName,
      onChange,
      value,
      required,
      isPassword,
      id,
      showEyeIcon,
      eyeIcon,
      disabled = false,
      isReadOnly = false,
      type = "text",
    } = this.props;
    return (
      <div className="form-group">
        <label className={classNames("col-md-12", !required ? "" : "required")}>
          {labelName}
        </label>
        <div className="col-md-12">
          <input
            type={isPassword ? "password" : type}
            id={id}
            value={value}
            onChange={onChange}
            className={classNames(
              "form-control form-control-line",
              required && !value ? "mandatory" : ""
            )}
            readOnly={isReadOnly}
            disabled={disabled}
          />
          {showEyeIcon ? eyeIcon : null}
        </div>
      </div>
    );
  }
}

export default TextBox;
