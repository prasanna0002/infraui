import React, { Component } from "react";

import SecurityStore from "../../stores/SecurityStore";
import SecurityActionCreator from "../../actionCreator/SecurityActionCreator";
import DashboardActionCreator from "../../actionCreator/DashboardActionCreator";
import DashboardStore from "../../stores/DashBoardStore";

import DropDown from "../generic/Dropdown";
import TextBox from "../generic/TextBox";

import Loader from "../loader/Loader";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";
import swal from "sweetalert";

import classNames from "classnames";

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.state.loading = false;
  }

  getInitialState = () => {
    return {
      message: "",
      selectedCredential: "",
      credentialData: null,
      renderedOn: Date.now,
      sortConfig: {
        key: undefined,
        ascending: true,
      },
    };
  };

  securityAdded = () => {
    console.log("securityAdded");
    let initialState = this.getInitialState();
    initialState.message = messages.SECURITY.SECURITY_CREATED.replace(
      "<credentialName>",
      this.state.credentialData.credentialName
    );
    this.setState(initialState);
    DashboardActionCreator.loadOptionsData();
    // Rerender the credential list with latest data
    SecurityActionCreator.getCredentialList({ userID: "ik8smpuser" });
  };

  securityAddingFailed = () => {
    this.setState({
      message: messages.SECURITY.SOMETHING_WRONG,
    });
  };

  credentialsReturned = () => {
    this.setState({
      renderedOn: Date.now,
    });
  };

  credentialsDeleted = () => {
    swal({
      title: "Deleted Successfully",
    });
    this.setState({
      renderedOn: Date.now,
    });
    DashboardActionCreator.loadOptionsData();
    SecurityActionCreator.getCredentialList({ userID: "ik8smpuser" });
  };

  getLookupOptionData = () => {
    const credentialType = DashboardStore.getDropdownData(
      "Credential Type",
      "selectedCredential"
    );
    this.setState({
      credentialsType: credentialType,
    });
  };

  getCredentialTypeDisplayName = (credentialType) => {
    let credType = credentialType;
    switch (credentialType) {
      case "azureServicePrincipal":
        credType = "Azure Service Principal";
        break;
      case "awsCredential":
        credType = "AWS Credentials";
        break;
      case "smtpCredential":
        credType = "SMTP Credentials";
        break;
      default:
        break;
    }
    return credType;
  };

  setSortConfig = (event) => {
    this.setState({
      sortConfig: {
        key: event.target.id,
        ascending: !this.state.sortConfig.ascending,
      },
    });
  };

  sortBy = (sortConfig, items) => {
    let _items = items && items.length >= 0 ? [...items] : undefined;
    if (_items && sortConfig.key) {
      _items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.ascending ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.ascending ? 1 : -1;
        }
        return 0;
      });
    }
    return _items;
  };

  isCredentialExists = (credentialName) => {
    const data = Object.assign([], SecurityStore.credentialsList);
    const filteredData =
      data && credentialName
        ? data.filter((item) => {
            return (
              item.credentialName.toLowerCase() ===
                credentialName.toLowerCase() &&
              item.credentialType === this.state.selectedCredential
            );
          })
        : [];
    return filteredData.length > 0;
  };

  getCredentialList = () => {
    const _credentialList = SecurityStore.credentialsList;
    let credentialList = this.sortBy(this.state.sortConfig, _credentialList);

    return credentialList && credentialList.length >= 0 ? (
      credentialList.map((credential) => {
        return (
          <tr key={credential.credentialName}>
            <td>{credential.credentialName}</td>
            <td>
              {this.getCredentialTypeDisplayName(credential.credentialType)}
            </td>
            <td>
              <a title="Delete" className="bin" aria-expanded="false">
                <i
                  id={credential.credentialName}
                  onClick={this.handleDeleteCredential}
                  className="mdi mdi-delete"
                ></i>
              </a>
            </td>
          </tr>
        );
      })
    ) : (
      <Loader position={true} />
    );
  };

  componentDidMount() {
    SecurityActionCreator.getCredentialList({ userID: "ik8smpuser" });
    this.getLookupOptionData();

    SecurityStore.addEventListener(
      EventType.CREATE_SECURITY_SUCCESS,
      this.securityAdded
    );
    SecurityStore.addEventListener(
      EventType.CREATE_SECURITY_FAILED,
      this.securityAddingFailed
    );
    SecurityStore.addEventListener(
      EventType.GET_CREDENTIALS_SUCCESS,
      this.credentialsReturned
    );
    SecurityStore.addEventListener(
      EventType.DELETE_CREDENTIAL_SUCCESS,
      this.credentialsDeleted
    );
    SecurityStore.addEventListener(
      EventType.GET_LOOKUP_OPTIONS,
      this.getLookupOptionData
    );
  }
  componentWillUnmount() {
    SecurityStore.removeEventListener(
      EventType.CREATE_SECURITY_SUCCESS,
      this.securityAdded
    );
    SecurityStore.removeEventListener(
      EventType.CREATE_SECURITY_FAILED,
      this.securityAddingFailed
    );
    SecurityStore.removeEventListener(
      EventType.GET_CREDENTIALS_SUCCESS,
      this.credentialsReturned
    );
    SecurityStore.removeEventListener(
      EventType.DELETE_CREDENTIAL_SUCCESS,
      this.credentialsDeleted
    );
    SecurityStore.removeEventListener(
      EventType.GET_LOOKUP_OPTIONS,
      this.getLookupOptionData
    );
  }

  handleReset = (event) => {
    event.preventDefault();
    this.setState(this.getInitialState());
  };
  handleOnChange = (event) => {
    let credentialData = Object.assign({}, this.state.credentialData);
    credentialData[event.target.id] = event.target.value;
    let message = "";

    if (event.target.id === "credentialName") {
      message = this.isCredentialExists(event.target.value)
        ? messages.SECURITY.DUPLICATE_CREDENTIAL
        : "";
    } else if (this.state.credentialData.credentialName) {
      message = this.isCredentialExists(
        this.state.credentialData.credentialName
      )
        ? messages.SECURITY.DUPLICATE_CREDENTIAL
        : "";
    }
    this.setState({ credentialData: credentialData, message: message });
  };
  isInValid = () => {
    const { credentialData, selectedCredential, message } = this.state;
    const components = SecurityStore.getCredentialComponents(
      selectedCredential
    );
    if (
      !components ||
      !credentialData ||
      !credentialData.credentialName ||
      message === messages.SECURITY.DUPLICATE_CREDENTIAL
    ) {
      return true;
    }
    return components.some((component) => {
      return !credentialData[component.value];
    });
  };
  handleCredentialsTypeOnChange = (event) => {
    this.setState({
      credentialData: {},
      [event.target.name]: event.target.value,
      message: "",
    });
  };

  getComponentsToRender = () => {
    const components = SecurityStore.getCredentialComponents(
      this.state.selectedCredential
    );
    if (!components) {
      return null;
    }
    let toRender = [];
    let credentialNameComp = (
      <TextBox
        id={"credentialName"}
        labelName={"Name"}
        onChange={this.handleOnChange}
        value={
          this.state.credentialData.credentialName
            ? this.state.credentialData.credentialName
            : ""
        }
        required={true}
      />
    );
    toRender.push(credentialNameComp);
    let dynamicComp = components.map((component) => {
      return (
        <TextBox
          key={[component.value] + Date.now}
          id={[component.value]}
          labelName={[component.name]}
          onChange={this.handleOnChange}
          value={this.state.credentialData[component.value]}
          required={true}
          isPassword={
            this.state[component.value + "Hidden"] === undefined
              ? true
              : !this.state[component.value + "Hidden"]
          }
          showEyeIcon={true}
          eyeIcon={
            <i
              id={[component.value] + "Hidden"}
              className={classNames(
                "eye fa",
                this.state[component.value + "Hidden"]
                  ? "fa-eye"
                  : "fa-eye-slash"
              )}
              onClick={this.handleEyeToggle}
            ></i>
          }
        />
      );
    });
    toRender.push(dynamicComp);
    return toRender;
  };

  handleEyeToggle = (event) => {
    this.setState({
      [event.target.id]: !this.state[event.target.id],
    });
  };
  handleDeleteCredential = (event) => {
    event.preventDefault();
    const credentialName = event.target.id;
    swal({
      title: messages.SECURITY.DELETE_CONFIRMATION.replace(
        "<credentialName>",
        credentialName
      ),
      buttons: true,
    }).then((value) => {
      if (value) {
        const payLoad = {
          credentialName: credentialName,
          userID: "ik8smpuser",
        };
        SecurityActionCreator.deleteCredential(payLoad);
      }
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isInValid()) {
      this.setState({
        message: messages.SECURITY.FIELD_MISSING,
      });
      return false;
    }
    let that = this;
    let selectedComponentItems = {};
    let selectedCredentialComponents = SecurityStore.getCredentialComponents(
      this.state.selectedCredential
    );
    selectedCredentialComponents.map((component) => {
      selectedComponentItems[component.value] =
        that.state.credentialData[component.value];
    });
    //TODO PARAMETER
    SecurityActionCreator.createSecurity({
      userID: "ik8smpuser", //TODO - Lgged in user id, correct after development of login
      credentialType: this.state.selectedCredential,
      credentialName: this.state.credentialData.credentialName,
      [this.state.selectedCredential]: selectedComponentItems,
    });
  };
  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <div className="container-fluid">
        <div className="row page-titles">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor">Security</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-xlg-3 col-md-5">
            <div className="card">
              <div className="card-block">
                <h3 className="card-title">Credential List</h3>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          Credential Name
                          <i
                            id="credentialName"
                            className="fa fa-sort float-right btn"
                            onClick={this.setSortConfig}
                          />
                        </th>
                        <th>
                          Credential Type
                          <i
                            id="credentialType"
                            className="fa fa-sort float-right btn"
                            onClick={this.setSortConfig}
                          />
                        </th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>{this.getCredentialList()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xlg-9 col-md-7">
            <div className="card">
              <div className="card-block">
                <h3 className="card-title">Create Credential</h3>
                <div className="table-responsive">
                  <form className="form-horizontal form-material">
                    <DropDown
                      data={this.state.credentialsType}
                      value={this.state.selectedCredential}
                      onChange={this.handleCredentialsTypeOnChange}
                      required={true}
                    />
                    {this.getComponentsToRender()}
                    <div className="form-group float-left">
                      <div className="col-sm-10">
                        <button
                          disabled={this.isInValid()}
                          onClick={this.handleSubmit}
                          className="btn btn-success"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-10">
                        <button
                          onClick={this.handleReset}
                          className="btn btn-danger"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <h5 className="text-themecolor">{this.state.message}</h5>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Security;
