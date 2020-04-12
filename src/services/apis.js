import Parse from 'parse';

const TodoItem = Parse.Object.extend('TodoItem');

export async function addTodoItem(params = {}) {
  const { name, dueDate, completed } = params;

  const todoItem = new TodoItem({
    name: name,
    dueDate: dueDate,
    completed: completed,
  });

  console.log("api todoItem:", todoItem);
  return todoItem
        .save()
        .then(() => {
          console.log("saved");
        });
}

export async function deleteTodoItem(params = {}) {
  const { objectId } = params;

  const query = new Parse.Query(TodoItem);
  return query.get(objectId)
        .then((item) => {
          return item.destroy();
        });
}

export async function toggleTodoItem(params = {}) {
  const { objectId } = params;

  const query = new Parse.Query(TodoItem);
  return query.get(objectId)
        .then((item) => {
          return item.save("completed", !item.get("completed"));
        });
}


export async function getTodoItems(params = {}) {
  const { completed, sortByDueDate, pagination } = params;
  console.log("api pagination: ", pagination);
  const { pageSize, currentPage } = pagination;
  console.log("api sortByDueDate: ", sortByDueDate);

  const query = new Parse.Query(TodoItem);

  if( completed !== null ){
    query.equalTo('completed', completed);
  }
  if ( sortByDueDate ){
    query.descending("dueDate");
  } else {
    query.descending("updatedAt");
  }
  query.skip(pageSize * (currentPage - 1));
  query.limit(pageSize);
  query.withCount();
  return query.find().then(data => {
    console.log("data from backend: ", data);
    return {results: data.results.map(parseObj => parseObj.toJSON()), count: data.count};
  });
}

const FavoriteMovie = Parse.Object.extend('FavoriteMovie');

export async function searchMovies(params = {}) {
  const { title, pagination } = params;
  const { currentPage } = pagination;
  const request="http://www.omdbapi.com/?apikey=ae8c76cc&s=" + title + "&page=" + currentPage;
  console.log("api search Movies:", params, request);
  return fetch(request)
    .then((response) => {
      //console.log("response:", response);
      return response.json();
    })
    .then((data) => {
       console.log("api promise result:", data);
       return data;
     });
}

export async function getMovieDetail(params = {}) {
  const { imdbId } = params;
  const request="http://www.omdbapi.com/?apikey=ae8c76cc&i=" + imdbId;
  //console.log("api get Movie Detail:", params, request);
  const query = new Parse.Query(FavoriteMovie);
  return fetch(request)
    .then((response) => {
      // console.log("response:", response);
      return response.json();
    })
    .then((data) => {
       query.containedIn("imdbID", [data.imdbID]);
       return query.find()
              .then((queryResult) => {
                if (queryResult.length === 0) {
                  //console.log("api promise detail result:", {...data, favorite: false});
                  return {...data, favorite: false};
                } else {
                  console.log("api promise detail result:", {...data, favorite: true});
                  return {...data, favorite: true};
                }
              });
     });
}

export async function addFavoriteMovie(params = {}) {
  const { imdbID, Title, Poster, Plot, Year, Director, Actors, Rate } = params;

  const favoriteMovie = new FavoriteMovie({
    imdbID: imdbID,
    Title: Title,
    Poster: Poster,
    Plot: Plot,
    Year: Year,
    Director: Director,
    Actors: Actors,
    Rate: Rate,
  });

  console.log("api favoriteMovie:", favoriteMovie);
  return favoriteMovie
        .save()
        .then(() => {
          console.log("saved");
        });
}

export async function removeFavoriteMovie(params = {}) {
  const { imdbID } = params;

  const query = new Parse.Query(FavoriteMovie);
  query.equalTo("imdbID", imdbID);
  return query.find()
        .then((movie) => {
          return movie[0].destroy();
        });
}

export async function getFavoriteMovies(params = {}) {
  const { pagination } = params;
  const { pageSize, currentPage } = pagination;
  console.log("api currentPage: ", currentPage);

  const query = new Parse.Query(FavoriteMovie);

  query.skip(pageSize * (currentPage - 1));
  query.limit(pageSize);
  query.withCount();
  return query.find().then(data => {
    console.log("fav movies from back4app: ", data);
    return {results: data.results.map(parseObj => parseObj.toJSON()), count: data.count};
  });
}
