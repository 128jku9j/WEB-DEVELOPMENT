'use strict';

export default class Component {
    constructor() {
        this.id = Component.getNextId(); // every component instance gets a unique id
    }

    // within a static method, context ("this") is the class
    static getNextId() {
        this.id++;
        return this.id;
    }

    setContainer( container ) {
        this.container = container;
    }

    // override this method in a concrete implementation of Component
    render() {
        return;
    }
}

Component.id = 0;