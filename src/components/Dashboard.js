import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel"
import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];



let PanelArray = [];

class Dashboard extends Component {
  
  state = { 
    loading: false,
    focused: null
  };

  selectPanel(id) {
    this.setState(prevState => ({
      focused: prevState.focused ? null : id
    }));
  }
  
  render() {

    PanelArray = data
    .filter(
      panel => this.state.focused === null || this.state.focused === panel.id
      )
      .map((element) => {
        return <Panel
        key={element.id} 
        id={element.id}
        label={element.label}
        value={element.value}
        onSelect={event => this.selectPanel(element.id)}
        />
      })
    const dashboardClasses = classnames({ "dashboard" : true,
    "dashboard--focused": this.state.focused
    });

    if (this.state.loading) {
      return <Loading />;
    }

    return <main className={dashboardClasses}>
      {PanelArray}
      </main>;
  }
}

export default Dashboard;
