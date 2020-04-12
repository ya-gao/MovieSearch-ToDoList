import React from "react";
import { Card, Rate, Icon, Tooltip, Checkbox, Tag, Skeleton } from "antd";
import styles from "./styles.less";

const movieCard = ({ movie, details, toggleFavorite }) => {

    const { Meta } = Card;

    const detailFound = (movie.imdbID in details);
    const detail = details[movie.imdbID];
    //console.log("matched detail: ", detail);
    let plot, year, director, actors, cardTitle, rate, rating, cardExtra, isFavorite;

    if (detailFound) {
      plot = (detail === undefined ? "oops! No data!" : detail.Plot);
      year = (detail === undefined ? "N/A" : detail.Year);
      director = (detail === undefined ? "oops! No data!" : detail.Director);
      actors = (detail === undefined ? "oops! No data!" : detail.Actors);
      if (detail.Ratings === undefined) {
        rate = detail.Rate;
      } else {
        rate = (detail === undefined ? 0 : detail.Ratings[0].Value.substring(0, 3) / 2);
      }

      isFavorite = detail.favorite;
    }

    cardTitle = (
      <Skeleton loading={!detailFound} title={false} paragraph={{ rows: 1, width: 180 }} active>
        <Tag color="blue" style={{marginLeft: "0"}}>
          <Icon style={{paddingRight: "5px"}} type="calendar" />
          {year}
        </Tag>
        <Tooltip title={director}>
          <Icon className="directorIcon" style={{color:"#1890ff", padding: "0 10px"}} type="user" />
        </Tooltip>
        <Tooltip title={actors}>
          <Icon className="actorsIcon" style={{color:"#1890ff", paddingLeft: "5px"}} type="team" />
        </Tooltip>
      </Skeleton>
    );

    rating = (
      <Skeleton loading={!detailFound} title={false} paragraph={{ rows: 1, width: 200 }} active>
        <Rate allowHalf disabled value={rate} />
      </Skeleton>
    );


    cardExtra = (
      <Skeleton loading={!detailFound} title={false} paragraph={{ rows: 1, width: 20 }} active>
        <Tooltip title={isFavorite ? "Remove From Favorite" : "Add to Favorite"}>
        <Checkbox
          checked={isFavorite ? true : false}
          onChange={(e) => toggleFavorite(e, detail.imdbID, movie.Title, movie.Poster, plot, year, director, actors, rate)}
        />
        </Tooltip>
      </Skeleton>
    );

    return (
        <Card
          className={styles.movieCard}
          title={cardTitle}
          extra={cardExtra}
          style={{ width: 240 }}
          cover={<Tooltip title={plot}> <div style={{height: "300px"}}><img alt="movie poster" src={movie.Poster} height="300px" width="210px" /> </div></Tooltip>}
        >
          <Meta title={movie.Title} description={rating} />
        </Card>
    );

}

export default movieCard;
