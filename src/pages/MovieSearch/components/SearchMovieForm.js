import React from "react";
import { Form, Icon, Row, Col, Button, Badge, Input } from "antd";


import styles from "./styles.less";

const SearchMovieForm = ({ form, onFormSubmit, onHeartClick, count }) => {
  const { getFieldDecorator } = form;

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, movie) => {
      if (!err) {
        form.resetFields();
        onFormSubmit(movie.name);
      }
    });
  };

  return (
    <Form
      onSubmit={e => handleSubmit(e)}
      layout="horizontal"
      className={styles.movieSearchForm}
    >
      <Row gutter={20}>
        <Col xs={24} sm={24} md={11} lg={15} xl={17}>
          <Form.Item>
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Please, type in the movie title."
                }
              ]
            })(
            <Input
              prefix={<Icon type="search" className="icon" />}
              placeholder="Search movies"
              spellCheck={false}
            />
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={7} lg={5} xl={4}>
          <Button type="primary" htmlType="submit" block style={{marginTop: '3px'}}>
            <Icon type="search" className="icon" />
            Search
          </Button>
        </Col>
        <Col xs={24} sm={24} md={6} lg={4} xl={3}>
          <Button type='button' onClick={onHeartClick} style={{marginTop: '3px'}}>
            <Icon type="heart" theme="filled" style={{ fontSize: '20px', color: 'red', paddingTop: '4px' }} />
            Favorite
            <Badge count={count} showZero style={{margin: '0 0 5px 6px'}} />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create({ name: "SearchMovieForm" })(SearchMovieForm);
