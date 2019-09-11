import React, { Component } from "react";
import axios from "axios";
import Loading from "./Loading";
import Panel from "./Panel"
import classnames from "classnames";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";
 import setInterview from "../helpers/reducers";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];



let PanelArray = [];

class Dashboard extends Component {
  
  state = { 
    loading: true,
    days: [],
    appointments: {},
    interviewers: {},
    focused: null
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);
    
      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        this.setState(previousState =>
          setInterview(previousState, data.id, data.interview)
        );
      }
    };

    if (focused) {
      this.setState({ focused });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

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
        value={element.getValue(this.state)}
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
