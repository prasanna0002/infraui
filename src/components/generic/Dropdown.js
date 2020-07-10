import React, { Component } from "react";
import classNames from "classnames";

class Dropdown extends Component {
  constructor(props) {
    super(props);
  }
  generateOptions = () => {
    const { data } = this.props;
    if (!data || data.length === 0) {
      return null;
    }
    const options = data.options.map((option, i) => {
      return (
        <option key={"option_" + i} value={option.value}>
          {option.description}
        </option>
      );
    });
    return options;
  };
  render() {
    const options = this.generateOptions();
    const {
      data,
      onChange,
      value,
      required,
      floatLeftDropDown,
      additionalField,
    } = this.props;
    if (!data) {
      return null;
    }
    return (
      <div className="form-group">
        <label className={classNames("col-sm-12", required ? "required" : "")}>
          {data.header}
        </label>
        {floatLeftDropDown ? (
          <div className={"col-sm-10"}>
            <div className="col-sm-6 float-left close-to-margin">
              <select
                name={data.name}
                className={classNames(
                  "form-control form-control-line",
                  required && value === "" ? "mandatory" : ""
                )}
                value={value}
                onChange={onChange}
              >
                <option value="">Select</option>
                {options}
              </select>
            </div>
            {additionalField}
          </div>
        ) : (
          <div className={"col-sm-12"}>
            <select
              name={data.name}
              className={classNames(
                "form-control form-control-line",
                required && value === "" ? "mandatory" : ""
              )}
              value={value}
              onChange={onChange}
            >
              <option value="">Select</option>
              {options}
            </select>
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
