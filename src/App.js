import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";
const socket = io("http://localhost:4000");
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      name: ""
    };
    socket.on("message", message => {
      this.setState({ name: message });
    });
  }

  componentDidMount() {
    socket.emit("message", "gooooootteeeemm");
  }

  render() {
    return <div className="App">Hey</div>;
  }
}
