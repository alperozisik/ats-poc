/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const ListViewLoadItemDesign = require('library/ListViewLoadItem');

const ListViewLoadItem = extend(ListViewLoadItemDesign)(
  //constructor
  function(_super, props, pageName) {
    // initalizes super class for this scope
    _super(this, props || ListViewLoadItemDesign.defaults);
    this.pageName = pageName;
  }

);

module && (module.exports = ListViewLoadItem);