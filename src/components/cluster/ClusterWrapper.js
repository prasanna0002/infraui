import React, { Component } from "react";
import Iframe from "react-iframe";
import classNames from "classnames";

import DropDown from "../generic/Dropdown";
import Loader from "../loader/Loader";
import ClusterStore from "../../stores/ClusterStore";
import DashboardStore from "../../stores/DashBoardStore";
import ClusterActionCreator from "../../actionCreator/ClusterActionCreator";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";
import ClusterStatus from "./ClusterStatus";
import CreateCluster from "./CreateCluster";
import K8DashBoard from "./K8DashBoard";
import config from "../../../config.json";
import url from "../../../url.json";

class ClusterWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.clusterData,
      isStatus: true,
      isIframe: false,
      iFrameUrl: null,
      searchValue: "",
      loading: true,
      renderedOn: Date.now,
    };
  }

  getInitialState = () => {
    return {};
  };

  handleToggle = () => {
    console.log("handleToggle---");
    this.setState({
      isStatus: !this.state.isStatus,
      isIframe: false,
    });
  };

  handleOnChange = (event) => {
    this.setState({
      searchValue: event.target.value,
    });
  };
  handleNavigate = (event) => {
    console.log(event.target.dataset.url);
    ClusterActionCreator.loadIframe();
    this.setState({
      isIframe: true,
      isStatus: false,
      iFrameUrl: event.target.dataset.url,
    });
  };
  getIframe = () => {
    const { iFrameUrl } = this.state;
    return <K8DashBoard url={iFrameUrl} onClick={this.handleToggle} />;
  };
  getFilteredData = () => {
    const { searchValue } = this.state;
    const data = Object.assign([], this.props.clusterData);
    const filteredData = data
      ? data.filter((item) => {
          return (
            (item.createStatus &&
              item.createStatus
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) > -1) ||
            (item.clusterName &&
              item.clusterName
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) > -1)
          );
        })
      : [];
    return filteredData;
  };
  clusterUpdated = () => {
    this.setState({
      renderedOn: Date.now,
    });
  };
  componentDidMount() {
    ClusterStore.addEventListener(
      EventType.UPDATE_CLUSTER_DATA,
      this.clusterUpdated
    );
  }
  componentWillUnmount() {
    ClusterStore.removeEventListener(
      EventType.UPDATE_CLUSTER_DATA,
      this.clusterUpdated
    );
  }
  static getDerivedStateFromProps(props, state) {
    if (state.data !== props.clusterData) {
      return {
        data: props.clusterData,
      };
    }
    return null;
  }

  renderComponents = () => {
    const { isStatus, isIframe, searchValue, loading } = this.state;
    let toRender = null;
    if (isIframe) {
      toRender = this.getIframe();
    } else if (isStatus) {
      const filteredData = this.getFilteredData();
      toRender = (
        <ClusterStatus
          onClick={this.handleToggle}
          onChange={this.handleOnChange}
          data={filteredData}
          searchValue={searchValue}
          plusSelect={this.plusHandler}
          loading={loading}
          navigate={this.handleNavigate}
        />
      );
    } else {
      toRender = <CreateCluster onClick={this.handleToggle} />;
    }
    return toRender;
  };

  render() {
    let toRender = this.renderComponents();
    return toRender;
  }
}

export default ClusterWrapper;
