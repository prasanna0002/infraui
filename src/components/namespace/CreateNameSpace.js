import React, { Component } from "react";
import classNames from "classnames";
import Loader from "../loader/Loader";
import TextBox from "../generic/TextBox";
import DashboardStore from "../../stores/DashBoardStore";
import DropDown from "../generic/Dropdown";
import RangeBucketModal from "./RangeBucketModal";
import NameSpaceStore from "../../stores/NameSpaceStore";
import NameSpaceActionCreator from "../../actionCreator/NameSpaceActionCreator";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";

class CreateNameSpace extends Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();    
    this.state.loading = false;
    
    this.state.renderNetworkConfigurationParametes = [];
    this.state.resourceQuotas = [];
    this.state.limitRanges = [];

    this.index = 0;
    this.handleNetworkConfigurationChecked = this.handleNetworkConfigurationChecked.bind(this);
  }

  getInitialState = () => {
    return {
      selectedClusterName: "",
      selectedClusterID: "",
      renderNetworkConfigurationParametes: [],
      selectedBucketRange:"",
      isNetworkConfigurationChecked: false,
      showSelectedBucketDetailsModal: false,
      bucketType: "",
      modalTitle:"",
      showResourceQuotaViewMoreOption: false,
      showLimitRangeViewMoreOption: false,
      isCustom: false,
      userMessage: "",
      namespaceName: "",
      clusterName: "",
      networkConfigurationParameters: [],
      selectedResourceQuotaType: "",
      selectedLimitRangeType:"",
      resourceQuota: {},
      limitRange: {}
    };
  };

  componentDidMount() {
    this.getLookupOptionData();
    NameSpaceStore.addEventListener(
      EventType.GET_LOOKUP_OPTIONS,
      this.getLookupOptionData
    );
    NameSpaceStore.addEventListener(
      EventType.CREATE_NAMESPACE_SUCCESS,
      this.namespaceCreated
    );
  }

  componentWillUnmount() {
    document.body.style.overflow = "auto";
    NameSpaceStore.removeEventListener(
      EventType.GET_LOOKUP_OPTIONS,
      this.getLookupOptionData
    );
    NameSpaceStore.removeEventListener(
      EventType.CREATE_NAMESPACE_SUCCESS,
      this.namespaceCreated
    );
  }

  namespaceCreated = () => {
    let initialState = this.getInitialState();
    initialState.userMessage = messages.NAMESPACE.NAME_SPACE_CREATED;
    this.setState(initialState);

  }
  
  getLookupOptionData = () => {
    const resourceQuotaType = DashboardStore.getDropdownData(
      "Resource Quota",
      "selectedResourceQuotaType"
    );
    const limitRangeType = DashboardStore.getDropdownData(
      "Limit Range",
      "selectedLimitRangeType"
    );
    this.setState({
      resourceQuotas: resourceQuotaType,
      limitRanges: limitRangeType
    });
  };

  handleReset = (event) => {
    event.preventDefault();
    this.index = 0;
    this.setState(this.getInitialState());
  };
  handleOnChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
      userMessage: "",
    });
  };
  setCustomRange = (bucketRangeObject) =>{
    document.body.style.overflow = "auto";
    let objectName = this.state.bucketType === "Resource Quota" ?
        "resourceQuota" : "limitRange";
    this.setState({
      [objectName]: bucketRangeObject[objectName],
      showSelectedBucketDetailsModal: false
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();

    if((this.state.selectedResourceQuotaType === "Custom" && !this.state["resourceQuota"]) ||
      ( this.state.selectedLimitRangeType === "Custom" && !this.state["limitRange"])) {
        this.setState({
          userMessage: messages.NAMESPACE.CUSTOM_VALUE_MISSING
        });
        return;
      }

    NameSpaceActionCreator.createNameSpace({
      "clusterName": this.state.selectedClusterName,
      "clusterID": this.state.selectedClusterID,
      "namespaceName": this.state.namespaceName,
      "resourceQuota": this.state.selectedResourceQuotaType === "Custom" ?
        this.state["resourceQuota"] : 
        {"resourceQuotaName": DashboardStore.getResourceQuotaBucketType(this.state.selectedResourceQuotaType)},
      "limitRange": this.state.selectedLimitRangeType === "Custom" ?
        this.state["limitRange"] : 
        {"limitRangeName": DashboardStore.getLimitRangeBucketType(this.state.selectedLimitRangeType)},
      "networkPolicy": this.state.networkConfigurationParameters
    });
  };

  handleNetworkConfigurationParameterOnChange = (event) => {
    let configurationParameter = [...this.state.networkConfigurationParameters];
    if(event && event.target){
    let selectedRowId = event.target.parentElement.parentElement.parentElement.parentElement.id
    selectedRowId = selectedRowId.substring(3);

    let selectedTargetId = event.target.id;
    let selectedParameter = selectedTargetId.substring(0, selectedTargetId.length-1);

    let selectdNetworkConfiguration = configurationParameter[selectedRowId];

    if(selectdNetworkConfiguration){
    selectdNetworkConfiguration.label = 
      selectedParameter == "label" ? event.target.value : selectdNetworkConfiguration.label;

    selectdNetworkConfiguration.port = 
      selectedParameter == "port" ? event.target.value : selectdNetworkConfiguration.port;
    } else{
    configurationParameter[selectedRowId] = {
      label: (selectedParameter == "label" ? event.target.value : ""),
      port: (selectedParameter == "port" ? event.target.value : 0)
    };
    }

    this.setState({ 
      networkConfigurationParameters: configurationParameter,
      userMessage: ""
    });
  }
  }

  allConfigurationParametersEdited() {
    let configurationParameter = [...this.state.networkConfigurationParameters];
    let renderedParameters = [...this.state.renderNetworkConfigurationParametes];
    if (renderedParameters.length === configurationParameter.length) {
      let isParameterMissing = configurationParameter.some((parameter) => 
      {
        return !parameter.label || !parameter.port
      });
      return !isParameterMissing;
    } else {
      return false;
    }
  }

  isInValid = () => {
    return(!this.state.selectedClusterID || 
      !this.state.namespaceName ||
      (!this.state.selectedResourceQuotaType && this.state.selectedResourceQuotaType !== "Select") ||
      !(this.state.selectedLimitRangeType && this.state.selectedLimitRangeType !== "Select") ||
      (this.state.isNetworkConfigurationChecked &&
        !this.allConfigurationParametersEdited()))
  }

  getNetworkConfigurationParameters = () => {
    
    let policy = (
      <tr 
        id={"row"+this.index}
        className={classNames(this.index % 2 == 0 ? "even-row" : "odd-row")}>
        <td>
          <TextBox
            id={"label"+this.index}
            labelName={"Application Label Name"}
            onChange={this.handleNetworkConfigurationParameterOnChange}
            value={this.state.applicationLabelName}
            required={true}
          />
        </td>
        <td>
          <TextBox
            id={"port"+this.index}
            labelName={"Application Port"}
            onChange={this.handleNetworkConfigurationParameterOnChange}
            value={this.state.applicationPort}
            required={true}
          />
        </td>
        <td>
          <a title="Delete" className="bin network-configuration-delete" aria-expanded="false">
                <i
                  key={"network-configuration-delete"+this.index}
                  onClick={this.deleteNetworkConfigurationParametes}
                  className="mdi mdi-delete"
                ></i>
              </a>
        </td>
      </tr>
    ); 

    this.index++;
    return policy;
  }

  addNetworkConfigurationParametes = (event) => {
    event.preventDefault();
    
    let toRender = [...this.state.renderNetworkConfigurationParametes];
    let policy = this.getNetworkConfigurationParameters();
    let configurationParameter = [...this.state.networkConfigurationParameters];

    toRender.push(policy);

    this.setState({
      renderNetworkConfigurationParametes: toRender,
      networkConfigurationParameters: (this.state.networkConfigurationParameters ? 
        configurationParameter : [])
    });
  }

  deleteNetworkConfigurationParametes = (event) => {
    event.preventDefault();

    if(this.state.renderNetworkConfigurationParametes.length > 0){
      let selectedRowId = event.target.parentElement.parentElement.parentElement.id.substring(3);

      let toRender = [...this.state.renderNetworkConfigurationParametes];
      let parameters = null;
      
      delete toRender[selectedRowId];
      if(this.state.networkConfigurationParameters) {
        parameters = [...this.state.networkConfigurationParameters];
        delete parameters[selectedRowId];
      }

      this.setState({
        renderNetworkConfigurationParametes: toRender,
        networkConfigurationParameters: parameters,
      });
    }
  }

  handleNetworkConfigurationChecked(event) {
    let toRender = [];
    let parameters = [];

    if(!this.state.isNetworkConfigurationChecked) {
      toRender = [...this.state.renderNetworkConfigurationParametes];
      let policy = this.getNetworkConfigurationParameters();
      parameters = [...this.state.networkConfigurationParameters];
      toRender.push(policy);
    } else {
      this.index = 0;
    }
    this.setState({
      isNetworkConfigurationChecked: event.target.checked,
      renderNetworkConfigurationParametes: toRender,
      networkConfigurationParameters: parameters
    });
  }

  viewSelectedBucketDetails = (event) => {
    event.preventDefault();
    event.stopPropagation();
    document.body.style.overflow = "hidden";

    let selectedtype = event.target.parentElement.parentElement.getElementsByTagName("label")[0].textContent;
    let selectedBucketRange = event.target.parentElement.parentElement.getElementsByTagName("label")[0].textContent;
    selectedBucketRange = selectedtype === "Resource Quota" ?
      DashboardStore.getResourceQuotaBucketType(this.state.selectedResourceQuotaType) :
      DashboardStore.getLimitRangeBucketType(this.state.selectedLimitRangeType);

    this.setState({
      showSelectedBucketDetailsModal: true,
      bucketType: selectedtype,
      selectedBucketRange: selectedBucketRange
    })
  }

  closeSelectedBucketDetailsModal = () => {
    if(this.state.showSelectedBucketDetailsModal) {
      document.body.style.overflow = "auto";
      this.setState({
        showSelectedBucketDetailsModal: false
      });
    }
  }

  handleOnResourceQuotaChange = () => {
    this.setState({
      selectedBucketRange: event.target.selectedOptions[0].text,
      selectedResourceQuotaType: event.target.value,
      showResourceQuotaViewMoreOption: (event.target.value ==="" ? false : true),
      userMessage: ""
    });
  }

  handleOnLimitRangeChange = () => {
    this.setState({
      selectedBucketRange: event.target.selectedOptions[0].text,
      selectedLimitRangeType: event.target.value,
      showLimitRangeViewMoreOption: (event.target.value ==="" ? false : true),
      userMessage: ""
    });
  }

  handleOnClusterChange = (event) => {
    this.setState({
      selectedClusterID: event.target.value,
      selectedClusterName: event.target.selectedOptions[0].text,
      userMessage: ""
    })
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    this.clusterData = DashboardStore.getClusterData();
    return (
      <div className="container-fluid">
        <div className="row page-titles">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor">NameSpace Creation</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">NameSpace Creation</h4>
                <div className="table-responsive">
                  <form className="form-horizontal form-material">
                    <DropDown
                      data={this.clusterData}
                      value={this.state.selectedClusterID}
                      onChange={this.handleOnClusterChange}
                      required={true}
                      mandatory={!this.state.selectedClusterID}
                    />
                    <TextBox
                      id={"namespaceName"}
                      labelName={"Namespace Name"}
                      onChange={this.handleOnChange}
                      value={this.state.namespaceName}
                      required={true}
                    />
                    <DropDown
                      data={this.state.resourceQuotas}
                      value={this.state.selectedResourceQuotaType}
                      onChange={this.handleOnResourceQuotaChange}
                      required={true}
                      mandatory={!this.state.selectedResourceQuotaType}
                      floatLeftDropDown={true}
                      additionalField={
                        this.state.showResourceQuotaViewMoreOption ? 
                        (<a 
                          href="" 
                          className="col-sm-12"
                          onClick={this.viewSelectedBucketDetails}>
                            {this.state.selectedResourceQuotaType === "Custom" ?
                              "Set Custom Value" : "View Details"}
                        </a>)                      
                        : null}
                    />
                    <DropDown
                      data={this.state.limitRanges}
                      value={this.state.selectedLimitRangeType}
                      onChange={this.handleOnLimitRangeChange}
                      required={true}
                      mandatory={!this.state.selectedLimitRangeType}
                      floatLeftDropDown={true}
                      additionalField={
                        this.state.showLimitRangeViewMoreOption ? 
                        (<a 
                          href="" 
                          className="col-sm-12"
                          onClick={this.viewSelectedBucketDetails}>                            
                            {this.state.selectedLimitRangeType === "Custom" ?
                              "Set Custom Value" : "View Details"}
                        </a>)
                        : null
                      }
                    />
                    <div className="form-group">
                      <label
                        className="checkbox-label">
                        <input 
                          className="input-checkbox"
                          type="checkbox"
                          checked={this.state.isNetworkConfigurationChecked}
                          onChange={(event) => this.handleNetworkConfigurationChecked(event)}
                        >
                        </input>
                        Network Configuration
                    </label>      
                    </div>
                    {this.state.isNetworkConfigurationChecked ? (
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          {this.state.renderNetworkConfigurationParametes}
                        </tbody>
                      </table>
                    <div className="form-group">
                      <div className="col-sm-10">
                      <input 
                        className="btn add-more-button"
                        type="button"
                        onClick={this.addNetworkConfigurationParametes}
                        value="Add More" />
                        </div></div>
                    </div> ) : null}
                    <div className="form-group float-left">
                      <div className="col-sm-10">
                        <button
                          onClick={this.handleSubmit}
                          className="btn btn-success"
                          disabled={this.isInValid()}
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
                      <h5 className="text-themecolor">{this.state.userMessage}</h5>
                    </div>
                  </form>
                  {this.state.showSelectedBucketDetailsModal ? 
                    (<RangeBucketModal 
                      closeModal={this.closeSelectedBucketDetailsModal} 
                      modalTitle={this.state.bucketType}
                      bucketRange={this.state.selectedBucketRange}
                      setCustomRange={this.setCustomRange}
                     />
                    ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateNameSpace;