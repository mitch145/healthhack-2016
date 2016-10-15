import React from 'react';
import Todo from './todo';

class TodoList extends React.Component {
    render() {
        return (
          <div className="container todoList">
            <div className="row">
              <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h1 className="text-center">Mitch's Todo List</h1>
                  </div>
                  <Todo/>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default TodoList;
