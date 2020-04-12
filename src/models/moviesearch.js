import { searchMovies, getMovieDetail, addFavoriteMovie, removeFavoriteMovie, getFavoriteMovies } from '@/services/apis';

//const movieData = [1,2,3,4,5,6];

export default {
  namespace: 'moviesearch',

  state: {
    movieList: [],
    movieDetails: {},
    favoriteList: [],
  },

  effects: {
    *searchMovies({ payload, callback }, { call, put }) {
      const response = yield call(searchMovies, payload);
      console.log("model response:", response);
      yield put({
        type: 'saveMovies',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchMovieDetails({ payload }, { call, put }) {
      const response = yield call(getMovieDetail, payload);
      console.log("movieDetails model:", response);
      yield put({
        type: 'saveMovieDetail',
        payload: {imdbId: payload.imdbId, moviedetail: response},
      });
    },
    *addFavoriteMovie({ payload, callback }, { call, put }) {
      yield call(addFavoriteMovie, payload);

      if (callback) callback();
    },
    *removeFavoriteMovie({ payload, callback }, { call, put }) {
      const response = yield call(removeFavoriteMovie, payload);
      console.log("removeFavoriteMovie model:", response);
      if (callback) callback(response);
    },
    *fetchFavoriteMovies({ payload, callback }, { call, put }) {
      const response = yield call(getFavoriteMovies, payload);
      console.log("fetchFavoriteMovies model:", response);
      yield put({
        type: 'saveFavoriteMovies',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveMovies(state, action) {
      return {
        ...state,
        movieList: action.payload,
      };
    },
    saveMovieDetail(state, action) {
      var details = JSON.parse(JSON.stringify(state.movieDetails));
      details[action.payload.imdbId] = action.payload.moviedetail;
      console.log("new state detail:", details);
      return {
        ...state,
        movieDetails: details,
      };
    },
    saveFavoriteMovies(state, action) {
      console.log("new favoriteList: ", action.payload);
      return {
        ...state,
        favoriteList: action.payload,
      };
    },

  },
};
