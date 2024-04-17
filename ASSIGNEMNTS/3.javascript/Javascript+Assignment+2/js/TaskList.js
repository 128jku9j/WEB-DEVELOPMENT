'use strict';

import Component from './Component.js';
import Task from './Task.js';

export default class TaskList extends Component {
    constructor( config ) {
        super();
        this.name = config.name;
        this.tasks = config.tasks.map( taskConfig => new Task( taskConfig ) );
    }

    getTaskById( id /*: number | string */ ) {
        return this.tasks.find( task => task.id == id );
    }

    renderTasks( container ) {
        this.tasks.forEach( this.renderTask.bind( this, container ) );
    }

    renderTask( container, task ) {
        const taskWrapper = document.createElement( 'div' );
        taskWrapper.id = `component-${task.id}`;
        taskWrapper.classList.add( 'task-wrapper' );
        taskWrapper.setAttribute( 'draggable', true );

        taskWrapper.addEventListener( 'dragstart', function( event ) {
            this.classList.add( 'task-being-dragged' );
            // this.classList.add( 'hide' );
            // event.dataTransfer.setData( 'id', this.getAttribute( 'id' ) );
        });

        taskWrapper.addEventListener( 'dragenter', function( event ) {
            this.classList.add( 'task-being-dragged-over' );
        });
        
        taskWrapper.addEventListener( 'dragleave', function( event ) {
            this.classList.remove( 'task-being-dragged-over' );
        });

        container.appendChild( taskWrapper );
        
        task.setContainer( taskWrapper );
        task.render();
    }

    renderAddCard( container ) {
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
    }

    render() {
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

        this.container.querySelector( '.task-list' ).addEventListener( 'click', function() {
            const isSelected = this.classList.contains( 'selected-task-list' );
            document.querySelectorAll( '.selected-task-list' ).forEach( node => node.classList.remove( 'selected-task-list' ) );
            if( !isSelected ) {
                this.classList.add( 'selected-task-list' );
            } else {
                this.classList.remove( 'selected-task-list' );
            }
        });

        this.tasksWrapper = this.container.querySelector( '.tasks-wrapper' );
        this.renderTasks( this.tasksWrapper );
        this.renderAddCard( this.container.querySelector( '.add-card-wrapper' ) );

        // this.tasksWrapper.addEventListener( 'dragover', function( event ) {
        //     event.preventDefault();
        // });
        
        // this.tasksWrapper.addEventListener( 'drop', function( event ) {
        //     return;
        // });
    }

    pushTask( task ) {
        this.tasks.push( task );
        this.render();
    }

    removeTaskById( id ) {
        const idx = this.tasks.findIndex( task => task.id == id );
        const task = this.tasks.splice( idx, 1 )[0];
        
        this.render();

        return task;
    }

    addTaskAfter( task, id ) {
        if( id ) {
            const idx = this.tasks.findIndex( task => task.id == id );
            this.tasks.splice( idx + 1, 0, task );
        } else {
            this.tasks.push( task );
        }

        this.render();
    }
}