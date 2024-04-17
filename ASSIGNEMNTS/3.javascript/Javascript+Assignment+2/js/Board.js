'use strict';

import Component from './Component.js';
import TaskList from './TaskList.js';

export default class Board extends Component {
    constructor( config, container ) {
        super();
        this.setContainer( container );
        this.name = config.name;
        this.taskLists = config.taskLists.map( taskListConfig => new TaskList( taskListConfig ) );
    }

    getTaskListById( id /*: number | string */ ) {
        return this.taskLists.find( taskList => taskList.id == id );
    }

    render() {
        this.container.innerHTML = `
            <div class="board-menu">
                <div class="board-title">${this.name}</div>
                <div class="board-show-menu">
                    <div class="board-show-menu-inner">
                        <i class="fas fa-ellipsis-v"></i>
                        Show menu
                    </div>
                    <div class="board-show-menu-items">
                        <div class="board-show-menu-item delete-selected-task pointer">
                            <i class="fas fa-times"></i>
                            Delete selected task
                        </div>
                        <div class="board-show-menu-item move-selected-task pointer">
                            <i class="fas fa-arrows-alt"></i>
                            Move selected task
                            <select>
                                ${this.taskLists.reduce( ( acc, taskList ) => acc + `<option>${taskList.name}`, `` )}
                            </select>
                        </div>
                        <div class="board-show-menu-item save-board pointer">
                            <i class="fas fa-save"></i>
                            Save board
                        </div>
                    </div>
                </div>
            </div>
            <div class="board">
                <div class="task-lists">
                    <div class="task-lists-wrapper"></div>
                    <!-- <div class="add-task-list-wrapper"></div> -->
                </div>
            </div>
        `;

        this.container.querySelector( '.board-show-menu-inner' ).addEventListener( 'click', function() {
            if( !this.parentNode.classList.contains( 'show-menu' ) ) {
                this.parentNode.classList.add( 'show-menu' );
            } else {
                this.parentNode.classList.remove( 'show-menu' );
            }
        });
        
        this.container.querySelector( '.delete-selected-task' ).addEventListener( 'click', () => {
            const selectedTaskEl = document.querySelector( '.task.selected' );
            const selectedTaskListEl = document.querySelector( '.task-list.selected-task-list' );
            let selectedTaskList;

            if( selectedTaskEl ) {
                selectedTaskList = this.getTaskListById( selectedTaskListEl.parentNode.id.split( '-' )[1] );
                selectedTaskList.removeTaskById( selectedTaskEl.parentNode.id.split( '-' )[1] );
            }
        });
        
        this.container.querySelector( '.save-board' ).addEventListener( 'click', () => {
            localStorage.setItem( 'board', JSON.stringify({
                name: this.name,
                taskLists: this.taskLists
            }));
        });

        this.renderTaskLists( this.container.querySelector( '.task-lists-wrapper' ) );
    }

    renderTaskLists( container ) {
        this.taskLists.forEach( this.renderTaskList.bind( this, container ) );
        
        const addTaskListWrapper = document.createElement( 'div' );
        addTaskListWrapper.classList.add( 'add-task-list-wrapper' );
        container.appendChild( addTaskListWrapper );

        this.renderAddTaskList( addTaskListWrapper );
    }

    renderTaskList( container, taskList ) {
        const taskListWrapperOuter = document.createElement( 'div' );
        // taskListWrapperOuter.id = `component-${taskList.id}`;
        taskListWrapperOuter.classList.add( 'task-list-wrapper-outer' );

        const taskListWrapper = document.createElement( 'div' );
        taskListWrapper.id = `component-${taskList.id}`;
        taskListWrapper.classList.add( 'task-list-wrapper' );

        taskListWrapperOuter.appendChild( taskListWrapper );

        const onDragenterOrDragover = function( event ) {
            event.preventDefault();
            taskListWrapper.classList.add( 'task-list-being-dragged-over' );
        };

        const onDragleaveOrDrop = function( event ) {
            taskListWrapper.classList.remove( 'task-list-being-dragged-over' );
        }

        taskListWrapper.addEventListener( 'dragenter', onDragenterOrDragover );
        taskListWrapper.addEventListener( 'dragover', onDragenterOrDragover );
        taskListWrapper.addEventListener( 'dragover', () => {
            // if this is the first time a task list is being dragged over, then it is the task list with the dragged task
            if( !this.container.querySelector( '.task-list-with-task-being-dragged' ) ) {
                taskListWrapper.classList.add( 'task-list-with-task-being-dragged' );
            }
        });
        
        taskListWrapper.addEventListener( 'dragleave', onDragleaveOrDrop );
        taskListWrapper.addEventListener( 'drop', event => {
            const taskElBeingDragged = document.querySelector( '.task-being-dragged' );
            const taskElBeingDraggedOver = document.querySelector( '.task-being-dragged-over' );
            const taskListElWithTaskBeingDragged  = document.querySelector( '.task-list-with-task-being-dragged' );
            const taskListElBeingDraggedOver  = document.querySelector( '.task-list-being-dragged-over' );
            
            // @todo taskListBeingDraggedOver would be same as "this" (??) - if so the following condition may be removed
            if( !taskListElBeingDraggedOver ) {
                return;
            }
            
            const taskListWithTaskBeingDragged = this.getTaskListById( taskListElWithTaskBeingDragged.id.split( '-' )[1] );
            const taskListBeingDraggedOver = this.getTaskListById( taskListElBeingDraggedOver.id.split( '-' )[1] );

            const idTaskBeingDragged = parseInt( taskElBeingDragged.id.split( '-' )[1] );
            let idTaskBeingDraggedOver = null;
            if( taskElBeingDraggedOver ) {
                idTaskBeingDraggedOver = parseInt( taskElBeingDraggedOver.id.split( '-' )[1] );
            }

            const taskBeingDragged = taskListWithTaskBeingDragged.removeTaskById( idTaskBeingDragged );
            taskListBeingDraggedOver.addTaskAfter( taskBeingDragged, idTaskBeingDraggedOver );

            console.log( idTaskBeingDragged, idTaskBeingDraggedOver );

            // taskElBeingDragged.classList.remove( 'task-being-dragged' );
            // taskElBeingDraggedOver.classList.remove( 'task-being-dragged-over' );
            
            // if( taskElBeingDraggedOver ) {
            //     // Reference: https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
            //     this.insertBefore( taskElBeingDragged, taskElBeingDraggedOver.nextSibling );
            // }

            taskListElWithTaskBeingDragged.classList.remove( 'task-list-with-task-being-dragged' );
        });
        taskListWrapper.addEventListener( 'drop', onDragleaveOrDrop );

        container.appendChild( taskListWrapperOuter );
        
        taskList.setContainer( taskListWrapper );
        taskList.render();
    }

    renderAddTaskList( container ) {
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
    }

    pushTaskList( taskList ) {
        this.taskLists.push( taskList );
        this.render();
    }
}