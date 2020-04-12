import React from 'react';

import { List, Row, Col } from "antd";

import MovieCard from "./MovieCard";
import styles from "./styles.less";

const MovieList = ({ movies, details, toggleFavorite, pagination }) => {
  return (
    <Row gutter={16}>
      <List
        locale={{
          emptyText: "There are no matching movies :("
        }}
        dataSource={movies}
        renderItem={movie => (
          <Col span={8}>
            <List.Item className={styles.listItem}>
              <MovieCard
                movie={movie}
                details={details}
                toggleFavorite={toggleFavorite}
              />
            </List.Item>
          </Col>
        )}
        pagination={pagination}
      />
    </Row>
  );
}

export default MovieList;
