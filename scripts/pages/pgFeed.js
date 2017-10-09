const extend = require('js-base/core/extend');
const PgFeedDesign = require('ui/ui_pgFeed');
const ListViewItem = require('sf-core/ui/listviewitem');
const FeedItem = require("../components/FeedItem");
const ListViewLoadItem = require("../components/ListViewLoadItem");
const FlexLayout = require('sf-core/ui/flexlayout');
const Color = require('sf-core/ui/color');

const defaultListViewItemChildProps = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  positionType: FlexLayout.PositionType.ABSOLUTE,
};

const PgFeed = extend(PgFeedDesign)(
  // Constructor
  function(_super) {
    _super(this);
    this.onShow = onShow.bind(this, this.onShow.bind(this));
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
  const page = this;
  fetchData.call(page);
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
  lvFeed.rowHeight = 140;

  lvFeed.onRowHeight = function(index) {
    var height = index === (page.feedData.length - 1) ?
      100 : 140;
    console.log(`row height for index ${index} is ${height}`);
    return height;
  };

  lvFeed.onRowCreate = function() {
    var listViewItem = new ListViewItem();
    // var feedItem = new FeedItem(Object.assign({
    //   backgroundColor: Color.WHITE,
    //   id: 1110
    // }, defaultListViewItemChildProps));
    var listViewLoadItem = new ListViewLoadItem(Object.assign({
      id: 1010,
      alignItems: FlexLayout.AlignItems.CENTER,
      justifyContent: FlexLayout.JustifyContent.CENTER
    }, defaultListViewItemChildProps));
    // listViewItem.addChild(feedItem);
    listViewItem.addChild(listViewLoadItem);
    // console.log("row created");
    return listViewItem;
  };

  lvFeed.onRowBind = function(listViewItem, index) {
    // try {
    var lastRow = index === (page.feedData.length - 1);
    // var feedItem = listViewItem.findChildById(1110);
    var listViewLoadItem = listViewItem.findChildById(1010);
    // feedItem.visible = !lastRow;
    // listViewLoadItem.visible = lastRow;
    // }
    // catch (ex) {}
    // console.log(`row bind for index ${index}`);
  };


}

function fetchData() {
  const page = this;

  setTimeout(() => {
    page.feedData = [];
    page.feedData.length = 10;
    loadData.call(page);
  }, 150);

}

function loadData() {
  const page = this;
  page.lvFeed.itemCount = page.feedData.length;
  page.lvFeed.refreshData();

}

module && (module.exports = PgFeed);
