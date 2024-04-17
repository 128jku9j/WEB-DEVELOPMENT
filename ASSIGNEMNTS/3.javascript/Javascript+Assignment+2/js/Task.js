'use strict';

import Component from './Component.js';

export default class Task extends Component {
    constructor( config ) {
        super();
        this.name = config.name;
        this.due = config.due;
    }

    update( config ) {
        Object.assign( this, config );
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="task pointer">
                ${this.name}
                <!--<i class="task-move fas fa-arrows-alt pointer"></i>-->
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

        this.container.querySelector( '.task' ).addEventListener( 'click', function() {
            const isSelected = this.classList.contains( 'selected' );
            document.querySelectorAll( '.selected' ).forEach( node => node.classList.remove( 'selected' ) );
            if( !isSelected ) {
                this.classList.add( 'selected' );
            } else {
                this.classList.remove( 'selected' );
            }
        });

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
    }
}

Task.id = 1;