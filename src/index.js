import React, { Component, useState } from 'react';
import ReactDOM, { render } from 'react-dom';
import axios from 'axios';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Toggle from "./Toggle";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState({ items: [], totalItems: 0 });
  const onInputChange = e => {
    setSearchTerm(e.target.value);
  };
  var startIndex = 0;
  var maxResults = 10;

  let API_URL = `https://www.googleapis.com/books/v1/volumes`;

  const fetchBooks = async () => {
    const result = await axios.get(`${API_URL}?q=${searchTerm}&startIndex=${startIndex}&maxResults=${maxResults}`);
    setBooks(result.data);
  };

  const serverTime = async () => {
    var request = require('request');

    let start_time = new Date().getTime();

    request.get(`${API_URL}?q=${searchTerm}&startIndex=${startIndex}&maxResults=${maxResults}`, function (err, response) {
      var response_time = new Date().getTime() - start_time;
      console.log(response_time);
      document.getElementById('outputServer').innerHTML = response_time;
    });
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    fetchBooks();
    serverTime();
  };

  function firstPage() {
    startIndex += 0;
    fetchBooks();
  }

  function nextPage() {
    startIndex += 10;
    fetchBooks();
  }

  function thirdPage() {
    startIndex += 20;
    fetchBooks();
  }

  function fourthPage() {
    startIndex += 30;
    fetchBooks();
  }

  function fifthPage() {
    startIndex += 40;
    fetchBooks();
  }

  function sixthPage() {
    startIndex += 50;
    fetchBooks();
  }

  const sortBooks = async () => {
    books.items.sort(function(a,b){
        return new Date(a.volumeInfo.publishedDate) - new Date(b.volumeInfo.publishedDate)
    });
  }

  function sortingOldest() {
    sortBooks();
    document.getElementById('oldest').innerHTML = JSON.stringify(books.items[0]);
  }

  function sortingNewest() {
    sortBooks();
    document.getElementById('newest').innerHTML = JSON.stringify(books.items[9]);
  }

  console.log(books.items)





  const bookAuthors = authors => {
    if (undefined !== authors && authors.length) {
      if (authors.length == 2) {
        authors = authors.join(" [, ") + (" ]");
      } else if (authors.length > 2) {
        let lastAuthor = " [, " + authors.slice(-1) + "]";
        authors.pop();
        authors = authors.join(" [, ") + ("]");
        authors += lastAuthor;
      }
    } else {
      return authors;
    }
    return authors;
  };

  var counts = {};
  var compare = 0;
  var mostFrequent;

  const commonAuthors = authors => {
    if (undefined !== authors && authors.length) {
      for(var i = 0, len = authors.length; i < len; i++){
        var word = authors;

        if(counts[word] === undefined){
            counts[word] = 1;
        }else{
            counts[word] = counts[word] + 1;
        }
        if(counts[word] > compare){
           compare = counts[word];
           mostFrequent = authors[i];
        }
        authors = mostFrequent;
      }
    } else {
      return authors;
    }
  return authors;
  };

  return (
    <section>
      <form onSubmit={onSubmitHandler}>
        <label>
          <span>Search for books</span>
          <input
            type="search"
            placeholder="app development, coffee, etc.,"
            value={searchTerm}
            onChange={onInputChange}
          />
          <button type="submit">Search</button>
          <span>Server Time:</span>
          <span id="outputServer"></span>
        </label>
      </form>
      <div>
        <h3>Pages: </h3>
        <input type="button" id="next" onClick={firstPage} value="1" />
        <input type="button" id="next" onClick={nextPage} value="2" />
        <input type="button" id="next" onClick={thirdPage} value="3" />
        <input type="button" id="next" onClick={fourthPage} value="4" />
        <input type="button" id="next" onClick={fifthPage} value="5" />
        <input type="button" id="next" onClick={sixthPage} value="6" />
      </div>
      <input type="button" id="sorting" onClick={sortingOldest} value="Earliest Publication" />
      <input type="button" id="sorting" onClick={sortingNewest} value="Latest Publication" />
      <span id="oldest"></span>
      <span id="newest"></span>
      <ul>
        {books.items.map((book, index) => {
          return (
            <div key={index}>
              <li>
                <div>
                  <div>
                    <h3>{bookAuthors(book.volumeInfo.authors)} - {book.volumeInfo.title}</h3>
                    <Toggle title="CLICK HERE to View Description">
				                <p>{book.volumeInfo.description}</p>
                        <p>{book.volumeInfo.publishedDate}</p>
			              </Toggle>
                    <Toggle title="CLICK HERE to View Common Author">
				                <h3>Most Common Author: {commonAuthors(book.volumeInfo.authors)}</h3>
			              </Toggle>
                  </div>
                </div>
                <hr />
              </li>
            </div>
          );
        })}
      </ul>
    </section>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<Library />, rootElement);
