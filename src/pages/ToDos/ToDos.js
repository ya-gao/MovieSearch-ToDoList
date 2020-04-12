import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Card, Radio, Switch, Tooltip, message } from "antd";
import { connect } from 'dva';

import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";


@connect(({ todos }) => ({
  todolist: todos.todoList,
}))
class ToDos extends PureComponent {
  state = {
    filterState: null,
    switchChecked: false,
    currentPage: 1,
  }

  componentDidMount() {
    this.fetchTodoItems({completed: this.state.filterState, sortByDueDate: this.state.switchChecked, pageNum: this.state.currentPage});
  }

  fetchTodoItems = (filter = {}) => {
    const { dispatch } = this.props;

    const pagination = {
      pageSize: 10,
      currentPage: filter.pageNum,
    };

    var payload = {
      completed: filter.completed,
      sortByDueDate: filter.sortByDueDate,
      pagination: pagination,
    };

    dispatch({
      type: 'todos/fetchTodoItems',
      payload: payload,
    });
  };

  handleformSubmit = (name, dueDate) => {
    const { dispatch } = this.props;

    // create the new item payload to be passed through dispatch action
    const payload = {
      // id: Math.round(Math.random() * 36 ** 12).toString(36),
      name: name,
      dueDate: dueDate,
      completed: false,
    };

    console.log("payload:", payload);

    // dispatch actions to todos model
    dispatch({
      type: 'todos/addToDoItem',
      payload,
      callback: (result) => {
        this.fetchTodoItems({completed: this.state.filterState, sortByDueDate: this.state.switchChecked, pageNum: this.state.currentPage});
        console.log("addTodoItem result:", result);
        message.success(`New Todo Item added: ${name}`);
      },
    });
  };

  handleTodoToggle = (objectId) => {
    const { dispatch } = this.props;

    // we pass the item Id as payload, and don't need to do anything in callback
    dispatch({
      type: 'todos/toogleTodoItem',
      payload: {objectId: objectId},
      callback: () => {
        this.fetchTodoItems({completed: this.state.filterState, sortByDueDate: this.state.switchChecked, pageNum: this.state.currentPage});
        message.success(`Todo Item toggled `);
      },
    });
  };

  handleTodoRemoval = (objectId) => {
    const { dispatch } = this.props;

    // we pass the item Id as payload
    dispatch({
      type: 'todos/deleteToDoItem',
      payload: {objectId: objectId},
      callback: () => {
        this.fetchTodoItems({completed: this.state.filterState, sortByDueDate: this.state.switchChecked, pageNum: this.state.currentPage});
        message.success(`Todo Item deleted `);
      },
    });
  };

  onFilterChange = (e) => {
    var completed = null;

    if(e.target.value === 'completed'){
      completed = true;
    } else if (e.target.value === 'uncompleted') {
      completed = false;
    }
    this.setState({filterState: completed});
    this.fetchTodoItems({completed: completed, sortByDueDate: this.state.switchChecked, pageNum: this.state.currentPage});
  };

  handleSwitchChange = (checked) => {
    console.log(`switch to ${checked}`);
    this.setState({switchChecked: checked});
    this.fetchTodoItems({completed: this.state.filterState, sortByDueDate: checked, pageNum: this.state.currentPage});
  }

  handlePageChange = (page) => {
    this.setState({currentPage: page});
    this.fetchTodoItems({completed: this.state.filterState, sortByDueDate: this.state.switchChecked, pageNum: page});
  }

  render() {
    const { todolist } = this.props;
    const { currentPage } = this.state;

    const cardExtra = (
      <Fragment>
        <Tooltip
          title={this.state.switchChecked ? "Sort by update time" : "Sort by due date"}
        >
          <Switch style={{marginRight: "20px"}} onChange={this.handleSwitchChange} />
        </Tooltip>

        <Radio.Group defaultValue="all" onChange={this.onFilterChange}>
          <Radio.Button value="all" key={1}>All</Radio.Button>
          <Radio.Button value="completed" key={2}>Completed</Radio.Button>
          <Radio.Button value="uncompleted" key={3}>Uncompleted</Radio.Button>
        </Radio.Group>
      </Fragment>);
    console.log("todoList", todolist);

    return (
      <Row type="flex" justify="center" align="middle">
        <Col
          xs={{ span: 23 }}
          sm={{ span: 23 }}
          md={{ span: 21 }}
          lg={{ span: 20 }}
          xl={{ span: 18 }}
        >
          <AddTodoForm onFormSubmit={this.handleformSubmit} />

          <Card title="Todo List" extra={ cardExtra }>
            <TodoList
              todos={todolist.results}
              onTodoToggle={this.handleTodoToggle}
              onTodoRemoval={this.handleTodoRemoval}
              pagination={{pageSize: 10, current: currentPage, total: todolist.count, onChange: this.handlePageChange}}
            />
          </Card>
        </Col>
      </Row>
    );
  }
};

export default ToDos;
