import { addTodoItem, getTodoItems, deleteTodoItem, toggleTodoItem } from '@/services/apis';

const tododata = [
  {
    id: 1,
    completed: false,
    name: 'this is todo list 1',

  },
  {
    id: 2,
    completed: true,
    name: 'this is todo list 2',

  },
  {
    id: 3,
    completed: false,
    name: 'this is todo list 4',

  },

];


export default {
  namespace: 'todos',

  state: {
    todoList: [],
  },

  effects: {
    *fetchTodoItems({ payload }, { call, put }) {
      const response = yield call(getTodoItems, payload);
      yield put({
        type: 'saveTodoItems',
        payload: response,
      });
    },
    *addToDoItem({ payload, callback }, { call, put }) {
      const result = yield call(addTodoItem, payload);
      
      if (callback) callback(result);
    },
    *deleteToDoItem({ payload, callback }, { call, put }) {
      yield call(deleteTodoItem, payload);
      if (callback) callback();
    },
    *toogleTodoItem({payload, callback}, {call, put}) {
      yield call(toggleTodoItem, payload);
      if (callback) callback();
    },
  },

  reducers: {
    saveTodoItems(state, action) {
      return {
        ...state,
        todoList: action.payload,
      };
    },
    saveNewTodoItem(state, action) {
      var itemList = state.todoList;
      itemList.push(action.payload);
      return {
        ...state,
        todoList: itemList,
      };
    },
    deleteTodoItem(state, action) {
      // we create new list with items that id doesn't match deleted id
      const newList = state.todoList.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        todoList: newList,
      };
    },
    toggleTodoItem(state, action) {
      const newList = state.todoList.map((item) => {
        // if we found the item with requested id, we toggle the completed field
        if (item.id === action.payload.id) {
          item.completed = !item.completed;
        }
        return item;
      });
      return {
        ...state,
        todoList: newList,
      };
    },

  },
};
