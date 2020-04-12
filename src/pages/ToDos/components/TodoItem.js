import React from "react";
import { Checkbox, Tooltip, Tag, Icon, List, Button } from "antd";

import styles from "./styles.less";

const TodoItem = ({ todo, onTodoRemoval, onTodoToggle }) => {

  let isoToDate;
  let dueDateColor;
  if (todo.dueDate !== undefined) {
    isoToDate = new Date(todo.dueDate.iso);

    // due date color
    const currentDate = new Date();
    const diff = (isoToDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0){
      dueDateColor = "#dcdcdc";
    } else if (diff >= 0 && diff <= 1) {
      dueDateColor = 'red';
    } else if (diff <= 3) {
      dueDateColor = 'orange';
    } else {
      dueDateColor = 'green';
    }
  }

  return (
    <List.Item
      actions={[
        <Tooltip title="Remove Todo">
          <Button type="danger" onClick={() => onTodoRemoval(todo.objectId)}>
            <Icon type="delete" />
          </Button>
        </Tooltip>
      ]}
      className={styles.listItem}
      key={todo.objectId}
    >
      <div className={styles.todoItem}>
        <Tooltip
          title={todo.completed ? "Mark as uncompleted" : "Mark as completed"}
        >
          <Checkbox
            defaultChecked={todo.completed}
            onChange={() => onTodoToggle(todo.objectId)}
          />
        </Tooltip>

        <Tag color={todo.completed ? "green" : "volcano"} className={styles.todoTag}>
          {todo.completed ? <Icon type="check" /> : "-"}
        </Tag>

        <div className={styles.todoName}>
          {todo.completed ? <del>{todo.name}</del> : todo.name}
        </div>

        <div className={styles.todoDue}>
          {isoToDate !== undefined ? <Tag color= {dueDateColor}><Icon type="calendar" /> {isoToDate.toDateString()}</Tag> : null}
        </div>
      </div>
    </List.Item>
  );
};

export default TodoItem;
