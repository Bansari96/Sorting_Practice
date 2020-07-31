import React from 'react';
import './App.css';
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      result: "",
      sortType: "Integer",
      sortInput: ""
    }

    this.handlerInputChange = this.handlerInputChange.bind(this);
    this.handlerTypeChange = this.handlerTypeChange.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  handlerInputChange(e) {
    this.setState({ sortInput: e.target.value });
  }

  handlerTypeChange(e) {
    this.setState({ sortType: e.target.value });
  }

  //event for submit button
  onSubmitHandler(e) {
    e.preventDefault();
    axios.post('http://localhost:8080/sort', {
      sortingType: this.state.sortType,
      sortingInput: this.state.sortInput.split(",")
    }).then(({ data }) => {
      console.log(data.result)
      this.setState({ result: data.result })
    });

  }

  //react form
  render() {
    return (
      <div className="App">
        <div className="container">
          <form onSubmit={this.onSubmitHandler}>
            <div className="form-group row">
              <label htmlFor="sortType" className="col-sm-2 col-form-label"><b>Sorting Type:</b></label>
              <div className="col-sm-10">
                <select id="sortType" className="form-control form-control-sm" onChange={this.handlerTypeChange}>
                  <option value="Integer">Integer</option>
                  <option value="String">String</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label for="sortingInput" className="col-sm-2 col-form-label"><b>Sorting Input:</b></label>
              <div className="col-sm-10">
                <textarea id="sortingInput" className="form-control form-control-sm" onChange={this.handlerInputChange} placeholder="Enter Items seperated by ," />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          <hr />
          <div className="form-group row">
            <label for="sortingSteps" className="col-sm-2 col-form-label"><b>Sorting Output:</b></label>
            <div className="col-sm-10">
              <textarea id="sortingSteps" className="form-control form-control-sm" value={this.state.result.replace()} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
