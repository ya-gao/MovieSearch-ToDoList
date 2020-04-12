import React from "react";
import moment from 'moment';
import { Form, Icon, Row, Col, Button, Input, DatePicker } from "antd";

import styles from "./styles.less";

const AddTodoForm = ({ form, onFormSubmit }) => {
  const { getFieldDecorator } = form;

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, todo) => {
      if (!err) {
        form.resetFields();

        if (todo.dueDate === undefined) {
          onFormSubmit(todo.name, undefined);
        } else if (todo.dueDate.toDate() instanceof Date) {
          onFormSubmit(todo.name, todo.dueDate.toDate());
        }

      }
    });
  };

  const disabledDate = current => {
    // Can not select days before today
    return current && current < moment().add(-1, 'day');
  }

  return (
    <Form
      onSubmit={e => handleSubmit(e)}
      layout="horizontal"
      className={styles.todoForm}
    >
      <Row gutter={20}>
        <Col xs={14} sm={14} md={10} lg={14} xl={16}>
          <Form.Item>
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Please, type in the todo name."
                }
              ]
            })(
            <Input
              prefix={<Icon type="tags" className="icon" />}
              placeholder="What needs to be done?"
              spellCheck={false}
            />
            )}
          </Form.Item>
        </Col>
        <Col xs={10} sm={10} md={7} lg={5} xl={4}>
            <Form.Item>
            {getFieldDecorator("dueDate", {
              rules: [
                {
                  type: 'object',
                  required: false,
                }
              ]
            })(
            <DatePicker disabledDate={disabledDate} />
            )}
            </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={7} lg={5} xl={4}>
          <Button type="primary" htmlType="submit" block>
            <Icon type="plus-circle" />
            Add
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create({ name: "AddTodoForm" })(AddTodoForm);
