(function() {
    'use strict';

    function Task( config ) {
        this.name = config.name;
        this.due = config.due;
    }

    Task.prototype.setContainer = function( container ) {
        this.container = container;
    };

    Task.prototype.update = function( config ) {
        Object.assign( this, config );
        this.render();
    };

    Task.prototype.render = function() {
        this.container.innerHTML = `
            <div class="task pointer">
                ${this.name}
                <i class="task-edit fas fa-pencil-alt pointer"></i>
            </div>
            <div class="task-edit-form hide">
                <form>
                    <textarea rows="3" placeholder="Enter a title for this card..." class="task-edit-input full-width-input"></textarea>
                    <div class="task-edit-form-actions">
                        <button class="btn btn-inline btn-primary task-edit-button pointer">Update Task</button>
                        <i class="fas fa-2x fa-times task-edit-cancel pointer"></i>
                    </div>
                </form>
            </div>
        `;

        this.container.querySelector( '.task-edit' ).addEventListener( 'click', () => {
            this.container.querySelector( '.task' ).classList.add( 'hide' );
            this.container.querySelector( '.task-edit-form' ).classList.remove( 'hide' );
            this.container.querySelector( '.task-edit-input' ).value = this.name;
        });

        this.container.querySelector( '.task-edit-cancel' ).addEventListener( 'click', () => {
            this.container.querySelector( '.task-edit-form' ).classList.add( 'hide' );
            this.container.querySelector( '.task' ).classList.remove( 'hide' );
        });

        this.container.querySelector( '.task-edit-button' ).addEventListener( 'click', ( event ) => {
            event.preventDefault();
            const taskText = this.container.querySelector( '.task-edit-input' ).value;
            if( taskText.trim() !== '' ) {
                this.update({
                    name: taskText
                });
            }
        });
    };

    function TaskList( config ) {
        this.name = config.name;
        this.tasks = config.tasks.map( taskConfig => new Task( taskConfig ) );
    }

    TaskList.prototype.setContainer = function( container ) {
        this.container = container;
    };

    TaskList.prototype.renderTasks = function( container ) {
        this.tasks.forEach( this.renderTask.bind( this, container ) );
    };

    TaskList.prototype.renderTask = function( container, task ) {
        const taskWrapper = document.createElement( 'div' );
        taskWrapper.classList.add( 'task-wrapper' );

        container.appendChild( taskWrapper );

        task.setContainer( taskWrapper );
        task.render();
    };

    TaskList.prototype.renderAddCard = function( container ) {
        if( this.tasks.length === 0 ) {
            container.innerHTML = `<div class="add-card-message pointer">+ Add card</div>`;
        } else {
            container.innerHTML = `<div class="add-card-message pointer">+ Add another card</div>`;
        }

        container.innerHTML += `
            <div class="add-card-form hide">
                <form>
                    <textarea rows="3" placeholder="Enter a title for this card..." class="add-card-input full-width-input"></textarea>
                    <div class="add-card-form-actions">
                        <button class="btn btn-inline btn-primary add-card-button pointer">Add Card</button>
                        <i class="fas fa-2x fa-times add-card-cancel pointer"></i>
                    </div>
                </form>
            </div>
        `;

        container.querySelector( '.add-card-message' ).addEventListener( 'click', function() {
            this.classList.add( 'hide' );
            container.querySelector( '.add-card-form' ).classList.remove( 'hide' );
        });

        container.querySelector( '.add-card-cancel' ).addEventListener( 'click', function() {
            container.querySelector( '.add-card-form' ).classList.add( 'hide' );
            container.querySelector( '.add-card-message' ).classList.remove( 'hide' );
        });

        container.querySelector( '.add-card-button' ).addEventListener( 'click', ( event ) => {
            event.preventDefault();
            const taskText = container.querySelector( '.add-card-input' ).value;
            if( taskText.trim() !== '' ) {
                this.pushTask(new Task({
                    name: taskText,
                    due: new Date()
                }));
            }
        });
    };

    TaskList.prototype.render = function() {
        this.container.innerHTML = `
            <div class="task-list">
                <div class="task-list-title-container">
                    <h3 class="task-list-title">${this.name}</h3>
                    <span class="task-list-more pointer">...</span>
                </div>
                <div class="tasks-wrapper"></div>
                <div class="add-card-wrapper"></div>
            </div>
        `;

        this.renderTasks( this.container.querySelector( '.tasks-wrapper' ) );
        this.renderAddCard( this.container.querySelector( '.add-card-wrapper' ) );
    };

    TaskList.prototype.pushTask = function( task ) {
        this.tasks.push( task );
        this.render();
    };

    function Board( config, container ) {
        this.setContainer( container );
        this.name = config.name;
        this.taskLists = config.taskLists.map( taskListConfig => new TaskList( taskListConfig ) );
    }

    Board.prototype.setContainer = function( container ) {
        this.container = container;
    };

    Board.prototype.render = function() {
        this.container.innerHTML = `
            <div class="board-menu">
                <div class="board-title">${this.name}</div>
                <div class="board-show-menu pointer">
                    <i class="fas fa-ellipsis-v"></i>
                    Show menu
                </div>
            </div>
            <div class="board">
                <div class="task-lists">
                    <div class="task-lists-wrapper"></div>
                    <!-- <div class="add-task-list-wrapper"></div> -->
                </div>
            </div>
        `;

        this.renderTaskLists( this.container.querySelector( '.task-lists-wrapper' ) );
    };

    Board.prototype.renderTaskLists = function( container ) {
        this.taskLists.forEach( this.renderTaskList.bind( this, container ) );

        const addTaskListWrapper = document.createElement( 'div' );
        addTaskListWrapper.classList.add( 'add-task-list-wrapper' );
        container.appendChild( addTaskListWrapper );

        this.renderAddTaskList( addTaskListWrapper );
    };

    Board.prototype.renderTaskList = function( container, taskList ) {
        const taskListWrapper = document.createElement( 'div' );
        taskListWrapper.classList.add( 'task-list-wrapper' );

        container.appendChild( taskListWrapper );

        taskList.setContainer( taskListWrapper );
        taskList.render();
    };

    Board.prototype.renderAddTaskList = function( container ) {
        let addListMessage, addListForm;

        if( this.taskLists.length === 0 ) {
            addListMessage = `<div class="add-list-message pointer">+ Add list</div>`;
        } else {
            addListMessage = `<div class="add-list-message pointer">+ Add another list</div>`;
        }

        addListForm = `
            <div class="add-list-form hide">
                <form>
                    <textarea rows="3" placeholder="Enter a title for this card..." class="add-list-input full-width-input"></textarea>
                    <div class="add-list-form-actions">
                        <button class="btn btn-inline btn-primary add-list-button pointer">Add List</button>
                        <i class="fas fa-2x fa-times add-list-cancel pointer"></i>
                    </div>
                </form>
            </div>
        `;

        container.innerHTML = `
            <div class="add-list">
                ${addListMessage}
                ${addListForm}
            </div>
        `;

        container.querySelector( '.add-list-message' ).addEventListener( 'click', function() {
            this.classList.add( 'hide' );
            container.querySelector( '.add-list-form' ).classList.remove( 'hide' );
        });

        container.querySelector( '.add-list-cancel' ).addEventListener( 'click', function() {
            container.querySelector( '.add-list-form' ).classList.add( 'hide' );
            container.querySelector( '.add-list-message' ).classList.remove( 'hide' );
        });

        container.querySelector( '.add-list-button' ).addEventListener( 'click', ( event ) => {
            event.preventDefault();
            const taskListText = container.querySelector( '.add-list-input' ).value;
            if( taskListText.trim() !== '' ) {
                this.pushTaskList(new TaskList({
                    name: taskListText,
                    tasks: []
                }));
            }
        });
    };

    Board.prototype.pushTaskList = function( taskList ) {
        this.taskLists.push( taskList );
        this.render();
    };

    const boardConfig = {
        name: 'Frontend Training',
        taskLists: [
            {
                name: 'To Do',
                tasks: [
                    {
                        name: 'Learn HTML',
                        due: new Date( 2019, 11, 15 )
                    },
                    {
                        name: 'Learn CSS',
                        due: new Date( 2019, 11, 25 )
                    },
                    {
                        name: 'Learn JavaScript',
                        due: new Date( 2019, 12, 14 )
                    }
                ]
            },
            {
                name: 'Doing',
                tasks: [
                    {
                        name: 'Prepare resume',
                        due: new Date( 2019, 12, 31 )
                    }
                ]
            },
            {
                name: 'Testing/Verifying',
                tasks: [
                    {
                        name: 'Twitter app frontend',
                        due: new Date( 2019, 11, 20 )
                    }
                ]
            },
            {
                name: 'Deploying',
                tasks: [
                    {
                        name: 'Twitter app backend',
                        due: new Date( 2019, 11, 18 )
                    }
                ]
            },
            {
                name: 'Deploying',
                tasks: [
                    {
                        name: 'Twitter app backend',
                        due: new Date( 2019, 11, 18 )
                    }
                ]
            },
            {
                name: 'Deploying',
                tasks: [
                    {
                        name: 'Twitter app backend',
                        due: new Date( 2019, 11, 18 )
                    }
                ]
            },
            {
                name: 'Done',
                tasks: []
            }
        ]
    };

    const board = new Board( boardConfig, document.querySelector( '.board-container' ) );
    board.render();
}());