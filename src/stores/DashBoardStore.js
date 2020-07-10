import { EventEmitter } from "events";
import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import EventType from "../constants/eventType";

class DashBoardStore extends EventEmitter {
  constructor() {
    super();
    Dispatcher.register(this.registerToActions);
    this.lookupOptionData = {};
  }
  registerToActions = (action) => {
    switch (action.actionType) {
      case ActionType.GET_LOOKUP_OPTIONS_DATA:
        this.lookupOptionData = action.value;
        this.emit(
          EventType.GET_LOOKUP_OPTIONS_DATA_SUCCESS,
          this.lookupOptionData
        );
        break;
      case ActionType.GET_LOOKUP_OPTIONS_DATA_FAILED:
        this.emit(EventType.CREATE_CLUSTER_FAILED);
        break;
      case ActionType.GET_CLUSTER_DATA:
        this.clusterData = action.value;
        this.emit(EventType.GET_CLUSTER_DATA_SUCCESS);
        break;
      default:
        break;
    }
  };

  getClusterData() {
    const options = this.clusterData;
    const data = Object.keys(options).map((_key) => {
      const item = options[_key];
      return {
            description: item.clusterName,
            value: item.clusterReqId,
          };
    });
    return {
      header: "Cluster Name",
      name: "Cluster Name",
      options: data
    };
  }

  getResourceQuotaBucketType(bucketValue) {  
    if(bucketValue === "Custom") {
      return "Custom";
    }

    const lookUpOptions = this.getOptions();
    const resourceQuotaType = lookUpOptions.find((option) => {
      return Object.keys(option)[0] === "resourceQuotaType";
    });

    const options = resourceQuotaType["resourceQuotaType"];
    const quotaItem = options.find((item) => item.value === bucketValue);

    return quotaItem && quotaItem.description;
  }

  getLimitRangeBucketType(bucketValue) {    
    if(bucketValue === "Custom") {
      return "Custom";
    }
    
    const lookUpOptions = this.getOptions();
    const limitRangeType = lookUpOptions.find((option) => {
      return Object.keys(option)[0] === "limitRangeType";
    });

    const options = limitRangeType["limitRangeType"];
    const quotaItem = options.find((item) => item.value === bucketValue);

    return quotaItem && quotaItem.description;
  }

  getOptions = () => {
    const options = this.lookupOptionData ? this.lookupOptionData.options : {};
    const data = Object.keys(options).map((_key) => {
      const item = options[_key];
      return {
        [_key]: Object.keys(item).map((key) => {
          return {
            description: item[key],
            value: key,
          };
        }),
      };
    });
    return data;
  };

  getDropdownData = (header, name, value) => {
    let options = [];
    const optionsData = this.getOptions();
    if (optionsData.length === 0) {
      return;
    }
    switch (header) {
      case "Provider":
        const _filter = optionsData.find((option) => {
          return Object.keys(option)[0] === "provider";
        });
        options = _filter["provider"];
        break;
      case "Master Instance Type":
        const _filter1 = optionsData.find((option) => {
          return Object.keys(option)[0] === "masterInstTypes";
        });
        options = _filter1["masterInstTypes"];
        break;
      case "Worker Instance Type":
        const _filter2 = optionsData.find((option) => {
          return Object.keys(option)[0] === "workerInstTypes";
        });
        options = _filter2["workerInstTypes"];
        break;
      case "Image Name":
        const _filter3 = optionsData.find((option) => {
          return Object.keys(option)[0] === "imageName";
        });
        options = _filter3["imageName"];
        break;
      case "Dashboard":
        const _filter4 = optionsData.find((option) => {
          return Object.keys(option)[0] === "dashboard";
        });
        options = _filter4["dashboard"];
        break;
      case "Credentials":
        const _filter5 = optionsData.find((option) => {
          return Object.keys(option)[0] === "credentials";
        });
        options = _filter5 && _filter5["credentials"];
        break;
      case "Credential Type":
        const _filter6 = optionsData.find((option) => {
          return Object.keys(option)[0] === "credentialType";
        });
        options = _filter6["credentialType"];
        break;
      case "Region":
        const _filter7 = optionsData.find((option) => {
          return Object.keys(option)[0] === "availZone";
        });
        options = _filter7["availZone"];
        break;
        case "Limit Range":
          const _filter8 = optionsData.find((option) => {
            return Object.keys(option)[0] === "limitRangeType";
          });
          options = _filter8["limitRangeType"];
          options.push({description: "Custom", value: "Custom"});
          break;
          case "Resource Quota":
            const _filter9 = optionsData.find((option) => {
              return Object.keys(option)[0] === "resourceQuotaType";
            });
            options = _filter9["resourceQuotaType"];
            options.push({description: "Custom", value: "Custom"});
            break;
    }

    return {
      header,
      name,
      value,
      options,
    };
  };
  addEventListener = (eventName, callBack) => {
    this.on(eventName, callBack);
  };
  removeEventListener = (eventName, callBack) => {
    this.removeListener(eventName, callBack);
  };
}

export default new DashBoardStore();
