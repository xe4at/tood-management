function sortTodos(todos) {
  const sortedData = {};

  todos.forEach((todo) => {
    if (!sortedData[todo.status]) {
      sortedData[todo.status] = [];
    }

    sortedData[todo.status].push(todo);
  });

  return sortedData;
}

export { sortTodos };
