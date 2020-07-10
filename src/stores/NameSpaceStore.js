import { EventEmitter } from "events";
import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import EventType from "../constants/eventType";

class NameSpaceStore extends EventEmitter {
  customBucketRange = {
    "resourceQuota": null,
    "limitRange": null
  };
  constructor() {
    super();
    Dispatcher.register(this.registerToActions);
  }

  registerToActions = (action) => {
    switch (action.actionType) {
      case ActionType.CREATE_NAMESPACE_SUCCESS:
        this.emit(EventType.CREATE_NAMESPACE_SUCCESS, action.value);
        break;
      case ActionType.CREATE_SECURITY_FAILED:
        this.emit(EventType.CREATE_NAMESPACE_FAILED);
        break;
        case ActionType.GET_LOOKUP_OPTIONS_DATA:
          this.lookupOptionData = action.value;
          this.emit(EventType.GET_LOOKUP_OPTIONS);
          break;
        case ActionType.SAVE_CUSTOM_BUCKET_RANGE:
          this.setCustomBucketRange(action.value);
          break;
      default:
        break;
    }
  };

  setCustomBucketRange(bucketRange) {
    let obj = bucketRange["resourceQuota"];
    if(bucketRange["resourceQuota"]) {
      this.customBucketRange["resourceQuota"] = bucketRange["resourceQuota"];
    }

    if(bucketRange["limitRange"]) {
      this.customBucketRange["limitRange"] = bucketRange["limitRange"];
    }
  }  

  getCustomBucketRangeValue(bucketType) {
    return this.customBucketRange[bucketType];
  }

  getBucketComponents(bucketRange, componentName) {  
    componentName = componentName === "Resource Quota" ? "resourceQuota" : "limitRange";
    switch(componentName){
      case "resourceQuota":
        const resourceQuotaBucketValues = this.lookupOptionData.componentsForResourceQuotaList;
        bucketRange = bucketRange === "Custom" ? resourceQuotaBucketValues[0].resourceQuotaType : bucketRange;
        const resourceBucketValues = resourceQuotaBucketValues.find(
          (item) => item.resourceQuotaType === bucketRange
        );
        return resourceBucketValues && resourceBucketValues.components;
        break;
      case "limitRange":
        const limitRangeBucketValues = this.lookupOptionData.componentsForLimitRangeList;
        bucketRange = bucketRange === "Custom" ? limitRangeBucketValues[0].limitRangeType : bucketRange;
        const limitBucketValues = limitRangeBucketValues.find(
          (item) => item.limitRangeType === bucketRange
        );
        return limitBucketValues && limitBucketValues.components;
        break;
    }
  }

  addEventListener = (eventName, callBack) => {
    this.on(eventName, callBack);
  };
  removeEventListener = (eventName, callBack) => {
    this.removeListener(eventName, callBack);
  };
}

export default new NameSpaceStore();
