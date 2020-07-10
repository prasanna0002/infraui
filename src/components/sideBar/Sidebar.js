import React, { Component } from "react";
import MenuItem from "./MenuItem";

class SideBar extends Component {
  render() {
    return (
      <aside className="left-sidebar">
        <div className="slimScrollDiv">
          <div className="scroll-sidebar">
            <nav className="sidebar-nav active">
              <ul id="sidebarnav" className="in">
                <MenuItem item="Menuitem" />
              </ul>
            </nav>
          </div>
          <div className="slimScrollBar"></div>
          <div className="slimScrollRail"></div>
        </div>
      </aside>
    );
  }
}

export default SideBar;
