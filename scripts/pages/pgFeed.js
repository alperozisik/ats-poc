/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const PgFeedDesign = require('ui/ui_pgFeed');
const ListViewItem = require('sf-core/ui/listviewitem');
const FeedItem = require("../components/FeedItem");
const ListViewLoadItem = require("../components/ListViewLoadItem");
const PgFeed = extend(PgFeedDesign)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  superOnShow();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
  const page = this;
  const lvFeed = page.lvFeed;
  lvFeed.refreshEnabled = false;

  lvFeed.onRowCreate = function() {
    var listViewItem = new ListViewItem();
    var feedItem = new FeedItem();
    feedItem.width = NaN;
    var listViewLoadItem = new ListViewLoadItem();
    listViewLoadItem.width = NaN;
    listViewItem.addChild(listViewLoadItem);
    listViewItem.addChild(feedItem);


    return listViewItem;
  };

  lvFeed.onRowBind = function(listViewItem, index) {
    var lastRow = index === (lvFeed.itemCount - 1);
    var feedItem = listViewItem.findChildById(1110);
    var listViewLoadItem = listViewItem.findChildById(1010);
    feedItem.visible = !lastRow;
    listViewLoadItem.visible = lastRow;
  };

  lvFeed.onRowHeight = (index) => {
    return index === (lvFeed.itemCount - 1) ?
      100 : 140;
  };


}

module && (module.exports = PgFeed);
