import React, { Component } from "react";
import classNames from "classnames";
//import swal from 'sweetalert';
//import Swal from 'sweetalert2';

import DropDown from "../generic/Dropdown";
import Loader from "../loader/Loader";
import ClusterStore from "../../stores/ClusterStore";
import DashboardStore from "../../stores/DashBoardStore";
import ClusterActionCreator from "../../actionCreator/ClusterActionCreator";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";
import CreateCluster from "./CreateCluster";
import { envBox } from "../alert/alert";

class ClusterStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContext: false,
      contextMenuSytle: {
        left: `0px`,
        top: `0px`,
      },
      contextMenuItems: [
        {
          id: "Delete",
          name: "Delete Cluster",
        },
      ],
      seletedRow: null,
      loading: false,
      sortConfig: {
        key: "createTime",
        ascending: false,
      },
    };
  }

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

  getClusterList = () => {
    const { data, loading, navigate } = this.props;
    if (!data || data.length === 0) {
      return loading ? <Loader position={true} /> : null;
    }

    //const sortedData = this.sortBy(this.state.sortConfig, data);
    //console.log('sortedData', sortedData);
    const sortedData = [{
      clusterReqId: "0d3ed01c-e36c-4121-9096-0c3f235078c2",
      id: 0, createStatus: "Failure", clusterName: "Application_1", environment: ['dev', 'as'], k8sDashboardUrl: null
    },
    {
      clusterReqId: "0d3ed01c-e36c-4121-9096-0c3f235078c2",
      id: 0, createStatus: "Failure", clusterName: "Application_23", environment: [''], k8sDashboardUrl: null
    }]
    const toRender = sortedData.map((value, index) => {
      const link = value.k8sDashboardUrl ? (
        <a
          data-url={value.k8sDashboardUrl}
          className="underline"
          onClick={this.props.navigate}
          href="#"
        >
          {value.clusterName}
        </a>
      ) : (
          value.clusterName
        );
      let status = (
        <img
          height="25px"
          title={value.statusMessage}
          src="./styles/images/inProgress.png"
          alt="inProgress"
        ></img>
      );
      //TODO: Hardcoding of values here. To be fetched from API
      let deploymentsCount = 0;
      let cpuUtilization = "CPU 0%";
      let alertCount = 0;
      let environment_first = (
        <span
          data-url={value.k8sDashboardUrl}
          className=""
          onClick={this.props.navigate}
          href="#"
        >
          {value.environment[0]}
        </span>
        )
      
      

      switch (value.createStatus) {
        case "Ready":
          status = (
            <img
              height="25px"
              title={value.statusMessage}
              src="./styles/images/ready.png"
              alt="inProgress"
            ></img>
          );
          //TODO: Remove the hardcoded values using values from API.
          deploymentsCount = value.clusterName.length;
          
          cpuUtilization = "CPU " + Math.floor(Math.random() * 100 + 1) + "%";
          alertCount = (value.clusterName.length - 5 < 0) ? 2 : value.clusterName.length - 5;
          break;
        case "InProgress":
          status = (
            <img
              height="25px"
              title={value.statusMessage}
              src="./styles/images/inProgress_1.png"
              alt="inProgress"
            ></img>
          );
          break;
        case "Failure":
          status = (
            <img
              height="25px"
              title={value.statusMessage}
              src="./styles/images/failed.png"
              alt="inProgress"
            ></img>
          );
          break;
        default:
          break;
      }
      return (
        <tr id={value.clusterReqId} key={index}>
          <td>{link}</td>
          <td>{environment_first}</td>
          
          {/* <td>{environment}</td> */}
          {/* <td className="icon">{status}</td>
          
          
          <td>{deploymentsCount}</td>
          <td>{cpuUtilization}</td>
          <td>{alertCount}</td> */}
          <td id={"td_index_" + index}>
            <a title="options" className="bin" aria-expanded="false">
              <i
                id={value.clusterReqId}
                data-clustername={value.clusterName}
                data-clusterid={value.clusterReqId}
                //onClick={this.props.plusSelect}
                onClick={this.handleContextMenu}
                className="mdi mdi-plus-circle"
              ></i>
            </a>
          </td>
        </tr>
      );
    });
    return toRender;
  };
  documentClickHandler = (event) => {
    const menu = document.getElementsByClassName("dropdown-menu")[0];
    const isOptionsClicked = event.target.classList.contains(
      "mdi-plus"
    );
    if (!isOptionsClicked && menu) {
      const isClickedOutside = !menu.contains(event.target);
      if (isClickedOutside) {
        this.setState({
          showContext: false,
          contextMenuSytle: {
            left: `0px`,
            top: `0px`,
          },
          seletedRow: null,
        });
      }
    }
  };

  handleContextMenu = (event) => {
    const selectedRow = event.target.dataset;
    let res = envBox(selectedRow.clustername);
    //console.log('env res',res);
    /* Swal.fire({
      title: 'Add Environment',
      inputPlaceholder: 'Environment Name!',
      //titleText: 'Add Environment',
      text: `App Name: ${selectedRow.clustername}`,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'On'
      },
      showCancelButton: false,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        return fetch(`https://jsonplaceholder.typicode.com/todos/1`)
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText)
            }
            return response.json()
          })
          .catch(error => {
            Swal.showValidationMessage(
              `Request failed: ${error}`
            )
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      console.log(result)
      if (result.value) {
        Swal.fire({
          title: `${result.value.login} environment creation initiated!`
          
        })
      }
    })*/
    
    const rect = document
      .getElementsByClassName("table-responsive")[0]
      .getBoundingClientRect();
    const menu = {
      width: 160,
      height: 30 * this.state.contextMenuItems.length,
    };
    let x = event.clientX - rect.left - menu.width;
    let y = event.clientY - rect.top;
    if (window.innerHeight < event.clientY + menu.height + 5) {
      y = y - menu.height;
    }

    this.setState({
      showContext: true,
      contextMenuSytle: {
        left: `${x}px`,
        top: `${y}px`,
      },
      seletedRow: selectedRow,
    });
  };
  onResize = (event) => {
    this.setState({
      showContext: false,
      contextMenuSytle: {
        left: `0px`,
        top: `0px`,
      },
      seletedRow: null,
    });
  };
  clusterDeleted = () => {
    this.setState({
      showContext: false,
      contextMenuSytle: {
        left: `0px`,
        top: `0px`,
      },
      seletedRow: null,
    });
  };
  handleContextMenuSelect = (event) => {
    const action = event.target.id;
    const { seletedRow } = this.state;
    if (!seletedRow) {
      return;
    }
    const payload = {
      clusterID: seletedRow.clusterid,
      clusterName: seletedRow.clustername,
    };
    switch (action) {
      case "Delete":
        ClusterActionCreator.deleteCluster(payload);
        break;
      default:
        break;
    }
  };
  componentDidMount() {
    document.addEventListener("click", this.documentClickHandler);
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onResize);
    ClusterStore.addEventListener(
      EventType.DELETE_CLUSTER_SUCCESS,
      this.clusterDeleted
    );
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.documentClickHandler);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onResize);
    ClusterStore.addEventListener(
      EventType.DELETE_CLUSTER_SUCCESS,
      this.clusterDeleted
    );
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row page-titles">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor">Application Management</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Application Management</h4>
                <div className="col-md-6 pull-left" style={{ padding: "0px" }}>
                  <input
                    type="text"
                    placeholder="Search for Application Name"
                    className="form-control form-control-line filter-text"
                    onChange={this.props.onChange}
                    value={this.props.searchValue}
                  />
                </div>
                <button
                  id={"createCluster"}
                  onClick={this.props.onClick}
                  className="btn pull-right btn-danger"
                >
                  Onboard Application
                </button>
                <div className="table-responsive position-relative">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          Application Name
                          <i
                            id="clusterName"
                            className="fa fa-sort float-right btn"
                            onClick={this.setSortConfig}
                          />
                        </th>
                        <th>
                          Environment Deployed
                          {/*                         <i
                            id="deployments"
                            className="fa fa-sort float-right btn"
                            onClick={this.setSortConfig}
                          /> */}
                        </th>
                        {/* <th>
                          Status
                          <i
                            id="createStatus"
                            className="fa fa-sort float-right btn"
                            onClick={this.setSortConfig}
                          />
                        </th>
                        <th>
                          Deployments
                          <i
                            id="deployments"
                            className="fa fa-sort float-right btn"
                            onClick={this.setSortConfig}
                          />
                        </th>
                        <th>
                          Utilization
                          <i
                            id="utilization"
                            className="fa fa-sort float-right btn"
                            onClick={this.setSortConfig}
                          />
                        </th>
                        <th>
                          Alerts
                          <i
                            id="alerts"
                            className="fa fa-sort float-right btn"
                            onClick={this.setSortConfig}
                          />
                        </th> */}
                        <th>Add Environment</th>
                      </tr>
                    </thead>
                    <tbody>{this.getClusterList()}</tbody>
                  </table>
                  {this.state.showContext ? (
                    <div
                      id="context-menu"
                      className="context-menu"
                      style={this.state.contextMenuSytle}
                    >
                      <ul
                        className={classNames(
                          "dropdown-menu",
                          this.state.showContext ? "show" : ""
                        )}
                        role="menu"
                      >
                        {this.state.contextMenuItems.map((item) => {
                          return (
                            <li>
                              <a
                                onClick={this.handleContextMenuSelect}
                                id={item.id}
                                tabindex="-1"
                              >
                                {item.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
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

export default ClusterStatus;
