import React, { Component } from "react";

import NameSpaceStore from "../../stores/NameSpaceStore";
import NameSpaceActionCreator from "../../actionCreator/NameSpaceActionCreator";

class RangeBucketModal extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        window.addEventListener("click", this.handleWindowClick);
        const customRange = NameSpaceStore.getCustomBucketRangeValue(this.props.modalTitle === "Resource Quota" ? "resourceQuota" : "limitRange");
        if(customRange) {this.setState({customRange});}
    }
    componentWillUnmount() {
        window.removeEventListener("click", this.handleWindowClick);
    }

    closeModal = (event) => {
        event.preventDefault();
        this.props.closeModal();
    }

    // When the user clicks anywhere outside of the modal, close it
    handleWindowClick = (event) => {
        event.preventDefault();

        if(event.target.id == "cutom_modal" || (event.target).closest("#cutom_modal") === null) {
            event.stopPropagation();
            this.props.closeModal();
        } 
    }

    isInValid = () => {
        const bucketRangeComponents = NameSpaceStore.getBucketComponents(this.props.bucketRange, this.props.modalTitle);
        
        return bucketRangeComponents.some((component) => 
        {
            if(this.state.customRange) {
                return !this.state.customRange[component.name];
            } else {
                return !this.state[component.name];
            }
        });
      };

    handleSubmit = (event) => {
        let bucketRangeObject = this.props.modalTitle === "Resource Quota" ?
            {"resourceQuota":this.state.customRange ? this.state.customRange : this.state} :
            {"limitRange":this.state.customRange ? this.state.customRange : this.state};
        NameSpaceActionCreator.saveCustomBucketRange(bucketRangeObject);
        this.props.setCustomRange(bucketRangeObject);
    }

    handleReset = (event) => {
        var elements = document.getElementsByTagName("input");
        for (var i=0; i < elements.length; i++) {
            if (elements[i].type == "text") {
                elements[i].value = "";
            }
        }
        const bucketRangeComponents = NameSpaceStore.getBucketComponents(this.props.bucketRange, this.props.modalTitle);
        
        bucketRangeComponents.forEach((component) => 
        {
            if(this.state.customRange) {
                let custom = this.state.customRange;
                custom[component.name] = "";
                this.setState({customRange: custom});
            } else {
                this.setState({[component.name]: ""});
            }
            
        });
    }

    handleOnChange = (event) => {
        if(this.state.customRange) {
            let customRange = this.state.customRange;
            customRange[event.target.id] = event.target.value;
            this.setState({customRange: customRange});
        } 
        else {
            this.setState({
                [event.target.id]:  event.target.value,
              });
        }
    }

    getCustomComponent(obj) {
        let components = Object.keys(obj).map(function (key) { 
            return {
              name: key,
              value: obj[key], 
            }; 
        }); 
        return components;
    }

    getExistingCustomComponentsToRender(){
        let compoentsToRender = this.getCustomComponent(this.state.customRange);
        let toRender = [];
        let dynamicComponent = compoentsToRender.map((component) => {
            let rowItem = 
            (<tr>
                <td>
                    <label>{component.name}</label>
                </td>
                <td>
                <input 
                    id={component.name}
                    type="text" 
                    value={component.value}
                    className="form-control form-control-line"
                    onChange={this.handleOnChange} 
                />
                </td>
            </tr>);
            return rowItem;
        });
        toRender.push(dynamicComponent);
        return toRender;
                
    }

    getComponentsToRender() {        
        if(this.state.customRange) {
            return this.getExistingCustomComponentsToRender();
        }

        const bucketRangeComponents = NameSpaceStore.getBucketComponents(this.props.bucketRange, this.props.modalTitle);
        let toRender = [];
        const isCustom = this.props.bucketRange === "Custom";
        
        let dynamicComponent = bucketRangeComponents.map((component) => {
            let rowItem = isCustom ? 
                (<tr>
                    <td>
                        <label>{component.name}</label>
                    </td>
                    <td>
                        <input 
                            id={component.name}
                            type="text" 
                            className="form-control form-control-line"
                            onChange={this.handleOnChange} 
                        />
                    </td>
                </tr>) :
                (<tr>
                    <td>
                        <label>{component.name}</label>
                    </td>
                    <td>
                        <label>{component.value}</label>
                    </td>
                </tr>);
            return rowItem;
        });
        toRender.push(dynamicComponent);
        return toRender;
    }

    getFormActionButtons() {
        
        return (<div>
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
            <div className="form-group float-left">
                <div className="col-sm-10">
                    <button
                        onClick={this.handleReset}
                        className="btn btn-danger"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>);
    }

    render() {
        const isCustom = this.props.bucketRange === "Custom";

        let modalMarginLeft = document.getElementById("main-wrapper").className === "hide-sidebar"
          ? "0px" : "133px";
        let modalStyle = {"marginLeft":modalMarginLeft }
        return(<form>
            <div 
                id="cutom_modal" 
                className="modal"
                style={modalStyle}>
                {/* <!-- Modal content --> */}
                <div 
                    className="modal-content">
                    <span 
                        className="close"
                        onClick={this.closeModal}>
                            &times;
                    </span>
                    <div>
                        <h4>{this.props.modalTitle + " - " + this.props.bucketRange}</h4>
                        <table className="table">
                            <tbody>
                                {this.getComponentsToRender()}
                            </tbody>
                        </table>
                    </div>
                    {isCustom ? this.getFormActionButtons() : null }
                </div>
            </div></form>
        );
    }
}
export default RangeBucketModal;