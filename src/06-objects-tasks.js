/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function area() {
    return this.width * this.height;
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
const getJSON = (obj) => JSON.stringify(obj);

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
const fromJSON = (proto, json) => Object.setPrototypeOf(JSON.parse(json), proto);

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const ELEMENTS_ORDER = {
  element: 1,
  id: 2,
  class: 3,
  attribute: 4,
  pseudoClass: 5,
  pseudoElement: 6,
};

class HTMLElement {
  constructor() {
    this.name = '';
    this.elements = {
      id: false,
      element: false,
      pseudoElement: false,
    };
    this.currentPosition = 0;
    this.countError = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.orderError = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  element(value) {
    if (this.currentPosition > ELEMENTS_ORDER.element) throw new Error(this.orderError);
    if (this.elements.element) throw new Error(this.countError);
    this.name += value;
    this.elements.element = true;
    this.currentPosition = 1;
    return this;
  }

  class(value) {
    if (this.currentPosition > ELEMENTS_ORDER.class) throw new Error(this.orderError);
    this.name += `.${value}`;
    this.currentPosition = 3;
    return this;
  }

  id(value) {
    if (this.currentPosition > ELEMENTS_ORDER.id) throw new Error(this.orderError);
    if (this.elements.id) throw new Error(this.countError);
    this.name += `#${value}`;
    this.elements.id = true;
    this.currentPosition = 2;
    return this;
  }

  attr(value) {
    if (this.currentPosition > ELEMENTS_ORDER.attribute) throw new Error(this.orderError);
    this.name += `[${value}]`;
    this.currentPosition = 4;
    return this;
  }

  pseudoClass(value) {
    if (this.currentPosition > ELEMENTS_ORDER.pseudoClass) throw new Error(this.orderError);
    this.name += `:${value}`;
    this.currentPosition = 5;
    return this;
  }

  pseudoElement(value) {
    if (this.currentPosition > ELEMENTS_ORDER.pseudoElement) throw new Error(this.orderError);
    if (this.elements.pseudoElement) throw new Error(this.countError);
    this.name += `::${value}`;
    this.elements.pseudoElement = true;
    this.currentPosition = 6;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.name = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    return this.name;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new HTMLElement().element(value);
  },

  id(value) {
    return new HTMLElement().id(value);
  },

  class(value) {
    return new HTMLElement().class(value);
  },

  attr(value) {
    return new HTMLElement().attr(value);
  },

  pseudoClass(value) {
    return new HTMLElement().pseudoClass(value);
  },

  pseudoElement(value) {
    return new HTMLElement().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new HTMLElement().combine(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
