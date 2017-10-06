/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const FeedItemDesign = require('library/FeedItem');

const FeedItem = extend(FeedItemDesign)(
  //constructor
  function(_super, props, pageName) {
    // initalizes super class for this scope
    _super(this, props || FeedItemDesign.defaults);
    this.pageName = pageName;
  }

);

module && (module.exports = FeedItem);