import React, { Component } from "react";

import SecurityStore from "../../stores/SecurityStore";
import SecurityActionCreator from "../../actionCreator/SecurityActionCreator";
import DashboardStore from "../../stores/DashBoardStore";

import DropDown from "../../components/generic/Dropdown";

import Loader from "../loader/Loader";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";

import classNames from "classnames";

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.state.provider = [];
    this.state.loading = true;
  }

  getInitialState = () => {
    return {
      message: "",
      cloudSrvc: "",
      credentialName: "LOB Azure Ops Credentials",
      subscriptionId: "",
      clientId: "",
      tenant: "",
      secret: "",
      cloudSrvcMissing: false,
      credentialNameMissing: false,
      subscriptionIdMissing: false,
      clientIdMissing: false,
      tenantMissing: false,
      secretMissing: false,
      subscriptionIdHidden: true,
      clientIdHidden: true,
      tenantHidden: true,
      secretHidden: true,
    };
  };

  securityAdded = (clusterID) => {
    this.setState({
      nodeCount: "",
      clusterName: "",
      message: messages.SECURITY.SECURITY_CREATED,
    });
  };

  securityAddingFailed = () => {
    this.setState({
      message: messages.SECURITY.SOMETHING_WRONG,
    });
  };

  loadLookupOptionsData = () => {
    const provider = DashboardStore.getDropdownData("Provider", "cloudSrvc");

    this.setState({
      provider,
      loading: false,
    });
  };

  componentDidMount() {
    this.loadLookupOptionsData();
    SecurityStore.addEventListener(
      EventType.CREATE_SECURITY_SUCCESS,
      this.securityAdded
    );
    SecurityStore.addEventListener(
      EventType.CREATE_SECURITY_FAILED,
      this.securityAddingFailed
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
  }

  handleReset = (event) => {
    event.preventDefault();
    this.setState(this.getInitialState());
  };
  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Missing"]: false,
    });
  };
  handleToggle = (event) => {
    this.setState({
      [event.target.id]: !this.state[event.target.id],
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const {
      cloudSrvc,
      credentialName,
      subscriptionId,
      clientId,
      tenant,
      secret,
    } = this.state;

    if (
      !cloudSrvc ||
      !credentialName ||
      !subscriptionId ||
      !clientId ||
      !tenant ||
      !secret
    ) {
      this.setState({
        message: messages.SECURITY.FIELD_MISSING,
        cloudSrvcMissing: !cloudSrvc,
        credentialNameMissing: !credentialName,
        subscriptionIdMissing: !subscriptionId,
        clientIdMissing: !clientId,
        tenantMissing: !tenant,
        secretMissing: !secret,
      });
      return false;
    }
    //TODO PARAMETER
    SecurityActionCreator.createSecurity({
      userId: "123", //TODO - Lgged in user id, correct after development of login
      provider: this.state.cloudSrvc,
      name: this.state.credentialName,
      credntials: {
        subscriptionID: this.state.subscriptionId,
        clientID: this.state.clientId,
        tenant: this.state.tenant,
        secret: this.state.secret,
      },
    });
  };

  render() {
    if (this.state.loading || !this.state.provider) {
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
          <div className="col-lg-12">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Security</h4>
                <div className="table-responsive">
                  <form className="form-horizontal form-material">
                    {this.state.loading ? null : (
                      <DropDown
                        data={this.state.provider}
                        value={this.state.cloudSrvc}
                        onChange={this.handleOnChange}
                        mandatory={this.state.cloudSrvcMissing}
                        required={true}
                      />
                    )}
                    <div className="form-group">
                      <label className="col-md-12 required">
                        Credential Name
                      </label>
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="credentialName"
                          required
                          value={this.state.credentialName}
                          onChange={this.handleOnChange}
                          className={classNames(
                            "form-control form-control-line",
                            this.state.credentialNameMissing ? "mandatory" : ""
                          )}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-12 required">
                        Subscription ID
                      </label>
                      <div className="col-md-12">
                        <input
                          type={
                            this.state.subscriptionIdHidden
                              ? "password"
                              : "text"
                          }
                          name="subscriptionId"
                          required
                          value={this.state.subscriptionId}
                          onChange={this.handleOnChange}
                          className={classNames(
                            "form-control form-control-line",
                            this.state.subscriptionIdMissing ? "mandatory" : ""
                          )}
                        />
                        <i
                          id="subscriptionIdHidden"
                          className={classNames(
                            "eye fa",
                            this.state.subscriptionIdHidden
                              ? "fa-eye-slash"
                              : "fa-eye"
                          )}
                          onClick={this.handleToggle}
                        ></i>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-12 required">Client ID</label>
                      <div className="col-md-12">
                        <input
                          type={this.state.clientIdHidden ? "password" : "text"}
                          name="clientId"
                          required
                          value={this.state.clientId}
                          onChange={this.handleOnChange}
                          className={classNames(
                            "form-control form-control-line",
                            this.state.clientIdMissing ? "mandatory" : ""
                          )}
                        />
                        <i
                          id="clientIdHidden"
                          className={classNames(
                            "eye fa",
                            this.state.clientIdHidden
                              ? "fa-eye-slash"
                              : "fa-eye"
                          )}
                          onClick={this.handleToggle}
                        ></i>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-12 required">Tenant</label>
                      <div className="col-md-12">
                        <input
                          type={this.state.tenantHidden ? "password" : "text"}
                          name="tenant"
                          required
                          value={this.state.tenant}
                          onChange={this.handleOnChange}
                          className={classNames(
                            "form-control form-control-line",
                            this.state.tenantMissing ? "mandatory" : ""
                          )}
                        />
                        <i
                          id="tenantHidden"
                          className={classNames(
                            "eye fa",
                            this.state.tenantHidden ? "fa-eye-slash" : "fa-eye"
                          )}
                          onClick={this.handleToggle}
                        ></i>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-12 required">Secret</label>
                      <div className="col-md-12">
                        <input
                          type={this.state.secretHidden ? "password" : "text"}
                          name="secret"
                          required
                          value={this.state.secret}
                          onChange={this.handleOnChange}
                          className={classNames(
                            "form-control form-control-line",
                            this.state.secretMissing ? "mandatory" : ""
                          )}
                        />
                        <i
                          id="secretHidden"
                          className={classNames(
                            "eye fa",
                            this.state.secretHidden ? "fa-eye-slash" : "fa-eye"
                          )}
                          onClick={this.handleToggle}
                        ></i>
                      </div>
                    </div>

                    <div className="form-group float-left">
                      <div className="col-sm-10">
                        <button
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
