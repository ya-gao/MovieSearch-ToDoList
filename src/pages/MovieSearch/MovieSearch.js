import React, { PureComponent } from 'react';
import { Row, Col, Card, message } from "antd";
import { connect } from 'dva';

import MovieList from "./components/MovieList";
import SearchMovieForm from "./components/SearchMovieForm";

@connect(({ moviesearch }) => ({
  movieList: moviesearch.movieList,
  movieDetails: moviesearch.movieDetails,
  favoriteList: moviesearch.favoriteList,
}))
class MovieSearch extends PureComponent {
  state = {
    showFavorite: false,
    currentPage: 1,
    title: undefined,
  }

  componentDidMount() {
    this.fetchFavoriteMovies({pageNum: this.state.currentPage});
  }

  handleHeartClick = () => {
    this.setState({ showFavorite: true, currentPage: 1 });
    this.fetchFavoriteMovies({pageNum: 1});
  }

  fetchFavoriteMovies = (filter = {}) => {
    const { dispatch } = this.props;

    const pagination = {
      pageSize: 10,
      currentPage: filter.pageNum,
    };

    const payload = {
      pagination: pagination,
    };

    dispatch({
      type: 'moviesearch/fetchFavoriteMovies',
      payload: payload,

    });
  };

  fetchMovieDetails = (id=null) => {
    const { movieList, dispatch } = this.props;

    for (let i = 0; i < 10; i++) {
      dispatch({
        type: 'moviesearch/fetchMovieDetails',
        payload: {imdbId: movieList.Search[i].imdbID},
      });
    }

  };

  handleformSubmit = (values) => {
    this.setState({ showFavorite: false, title: values, currentPage: 1 });
    this.handleSearchMovies({title: values, pageNum: 1});
  }

  handleSearchMovies = (filter = {}) => {
    const { dispatch } = this.props;

    const pagination = {
      pageSize: 10,
      currentPage: filter.pageNum,
    };

    const payload = {
      title: filter.title,
      pagination: pagination,
    };

    console.log("payload:", payload);

    // dispatch actions to moviesearch model
    dispatch({
      type: 'moviesearch/searchMovies',
      payload,
      callback: () => {
        this.fetchMovieDetails();
      },
    });
  };

  handleToggleFavorite = (e, imdbID, title, poster, plot, year, director, actors, rate) => {
    if (e.target.checked) {
      this.handleAddFavorite(imdbID, title, poster, plot, year, director, actors, rate);
    } else {
      this.handleRemoveFavorite(imdbID);
    }
  };

  handleAddFavorite = (imdbID, title, poster, plot, year, director, actors, rate) => {
    //console.log("add favoriteMovies ", imdbID);
    const { dispatch } = this.props;

    // we pass the imdbId as payload
    dispatch({
      type: 'moviesearch/addFavoriteMovie',
      payload: {
        imdbID: imdbID,
        Title: title,
        Poster: poster,
        Plot: plot,
        Year: year,
        Director: director,
        Actors: actors,
        Rate: rate,
      },
      callback: (result) => {
        this.fetchMovieDetails();
        this.fetchFavoriteMovies({pageNum: this.state.currentPage});
        message.success(`Movie Added to Favorite `);
      },
    });
  };

  handleRemoveFavorite = (imdbID) => {
    console.log("remove favoriteMovies ", imdbID);
    const { dispatch } = this.props;

    // we pass the imdbId as payload
    dispatch({
      type: 'moviesearch/removeFavoriteMovie',
      payload: {imdbID: imdbID},
      callback: (response) => {
        this.fetchMovieDetails();
        this.fetchFavoriteMovies({pageNum: this.state.currentPage});
        message.success(`Movie Removed from Favorite `);

      },
    });
  };

  handlePageChange = (page) => {
    console.log("new page num: ", page);
    this.setState({currentPage: page});
    if (this.state.showFavorite) {
      this.fetchFavoriteMovies({pageNum: page});
    } else {
      this.handleSearchMovies({title: this.state.title, pageNum: page});
    }

  }

  render() {
    const { movieList, movieDetails, favoriteList } = this.props;
    const { showFavorite, currentPage } = this.state;
    console.log("in");
    let favoriteMovieDetails = {};
    if (showFavorite) {
      console.log("fav list: ", favoriteList.results);
      let numOfFavMovie = favoriteList.count - 10 * (currentPage - 1);

      if (numOfFavMovie > 10) {
        numOfFavMovie = 10;
      }
      if (numOfFavMovie > favoriteList.results.length) {
        numOfFavMovie = favoriteList.results.length;
      }
      console.log("render count: ", numOfFavMovie);
      for(let i = 0; i < numOfFavMovie; i++) {
        console.log("current item: ", favoriteList.results[i]);
        favoriteMovieDetails[favoriteList.results[i].imdbID] = { ...favoriteList.results[i], favorite: true };
      }
      console.log("fav movie details: ", favoriteMovieDetails);
    }

    let movieListTotal = (movieList.length === 0 ? 0 : parseInt(movieList.totalResults))
    let total = (showFavorite? favoriteList.count : movieListTotal);

    return (
      <Row type="flex" justify="center" align="middle">
        <Col
          xs={{ span: 23 }}
          sm={{ span: 23 }}
          md={{ span: 21 }}
          lg={{ span: 20 }}
          xl={{ span: 18 }}
        >
          <SearchMovieForm onFormSubmit={this.handleformSubmit} onHeartClick={this.handleHeartClick} count={favoriteList.count} />
          <Card title="Movie List">
            <MovieList
              movies={showFavorite? favoriteList.results : movieList.Search}
              details={showFavorite? favoriteMovieDetails : movieDetails}
              toggleFavorite = {this.handleToggleFavorite}
              pagination={{pageSize: 10, current: currentPage, total: total, onChange: this.handlePageChange}}
            />
          </Card>
        </Col>
      </Row>
    );
  }
};

export default MovieSearch;
