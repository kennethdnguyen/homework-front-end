import ReactDOM from "react-dom";
import React, { Component } from "react";
import "./index.css";
import App from "./App";
import axios from "axios";
import * as serviceWorker from "./serviceWorker";
import ModalImage from "react-modal-image";
import "./appPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Gif from "./Gif";

// AppPage is the parent component that will allow users to search for gifs, view trending gifs,
// and sort them in order by date of most recent or oldest first
class AppPage extends Component {
  // search is the name of the gif a user wants to search for
  // array will contain the data of the gifs returned from the API call
  // trendingArray will contain the data of the trending gifs returned from the API call
  // trendingClicked is defaulted to false, it is set to true when the trending button is clicked
  // isSorting is defaulted to false, it is set to true when either options in the sorting dropdown is clicked
  // sortRecent is defaulted to false, it is set to true when the recent option in the dropdown is clicked
  constructor() {
    super();
    this.state = {
      search: "",
      array: [],
      trendingArray: [],
      trendingClicked: false,
      isSorting: false,
      sortRecent: false
    };
  }

  // sets the value of the name of the gif a user inputs to the search string
  handleSearch(event) {
    this.setState({ search: event.target.value });
  }

  // This is triggered when user clicks on search button.
  // It will make the get request to the Giphy api with the name of the gif the user inputs
  // and will set the data returned into the array
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ search: this.state.search, trendingClicked: false });

    axios
      .get(
        "https://api.giphy.com/v1/gifs/search?q=" +
          this.state.search +
          "&api_key=YVfyrI9GhN3QnZXYkciljScn5nhensrF"
      )
      .then(res => this.setState({ array: res.data.data }));
  }

  // This is triggered when user clicks on trending button.
  // It makes a get request to the Giphy api to get the data of the current trending gifs
  // and will set the data returned into the trendingArray
  handleClick() {
    axios
      .get(
        "https://api.giphy.com/v1/gifs/trending?api_key=YVfyrI9GhN3QnZXYkciljScn5nhensrF"
      )
      .then(res =>
        this.setState({ trendingArray: res.data.data, trendingClicked: true })
      );
  }

  // This is triggered when a user wants to sort by most recent
  handleRecent() {
    this.setState({ sortRecent: true, isSorting: true });
  }

  // This is triggered when a user wants to sort by oldest gifs first
  handleOldest() {
    this.setState({ sortRecent: false, isSorting: true });
  }

  render() {
    const inputStyle = {
      margin: "auto",
      maxWidth: "300px"
    };

    // This will sort the array by most recent or oldest first.
    // If sortRecent and isSorting is true, it will sort it by most recent based on the timestamp of the gifs,
    // otherwise it will sort it by oldest first.
    // If trendingClicked is true, the trendingArray will be sorted, otherwise the array containing the gifs
    // a user searches for will be sorted
    if (this.state.sortRecent && this.state.isSorting) {
      if (this.state.trendingClicked) {
        this.state.trendingArray.sort(function(x, y) {
          return new Date(y.import_datetime) - new Date(x.import_datetime);
        });
      } else {
        this.state.array.sort(function(x, y) {
          return new Date(y.import_datetime) - new Date(x.import_datetime);
        });
      }
    } else if (!this.state.sortRecent && this.state.isSorting) {
      if (this.state.trendingClicked) {
        this.state.trendingArray.sort(function(x, y) {
          return new Date(x.import_datetime) - new Date(y.import_datetime);
        });
      } else {
        this.state.array.sort(function(x, y) {
          return new Date(x.import_datetime) - new Date(y.import_datetime);
        });
      }
    }

    // Checks to see if a user seached for gifs or clicked on the trending button.
    // It will pass each gif in the appropriate array based on the previous check to the Gif component.
    // the variable gifs will contain the list of gifs to be displayed
    if (this.state.trendingClicked) {
      var gifs = this.state.trendingArray.map(element => {
        return (
          <li className="champions_item" key={element.id}>
            <Gif gif={element} />
          </li>
        );
      });
    } else {
      var gifs = this.state.array.map(element => {
        return (
          <li className="champions__item" key={element.id}>
            <Gif gif={element} />
          </li>
        );
      });
    }

    return (
      <div className="page">
        <div className="topInfo">
          <h1>Giphy Searcher</h1>
          <p>Search for gifs and view what's trending</p>
          <div />
          <form
            className="example"
            style={inputStyle}
            onSubmit={this.handleSubmit.bind(this)}
          >
            <input
              type="text"
              value={this.state.search}
              onChange={this.handleSearch.bind(this)}
              placeholder="Enter gif name"
            />
            <button type="submit">
              <i className="fa fa-search" />
            </button>
          </form>
        </div>
        <div className="flex-container">
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.handleClick.bind(this)}
            >
              Trending Gifs
            </button>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenu2"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Sort By
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
              <button
                className="dropdown-item"
                type="button"
                onClick={this.handleRecent.bind(this)}
              >
                Recent
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={this.handleOldest.bind(this)}
              >
                Oldest
              </button>
            </div>
          </div>
        </div>
        <ul className="champions">{gifs}</ul>
      </div>
    );
  }
}

ReactDOM.render(<AppPage />, document.getElementById("root"));
serviceWorker.unregister();
