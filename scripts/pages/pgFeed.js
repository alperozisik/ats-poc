const extend = require('js-base/core/extend');
const PgFeedDesign = require('ui/ui_pgFeed');
const ListViewItem = require('sf-core/ui/listviewitem');
const FeedItem = require("../components/FeedItem");
const ListViewLoadItem = require("../components/ListViewLoadItem");
const FeedItemDesign = require('library/FeedItem');
const ListViewLoadItemDesign = require('library/ListViewLoadItem');
const Router = require("sf-core/ui/router");
const Color = require('sf-core/ui/color');

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
    page.headerBar.itemColor = Color.create("#104682");
    
    page.android.onBackButtonPressed = function() { Router.goBack()};

    const lvFeed = page.lvFeed;
    lvFeed.refreshEnabled = false;
    // lvFeed.rowHeight = Math.max(FeedItemDesign.defaults.designHeight, ListViewLoadItemDesign.defaults.designHeight);

    lvFeed.onRowHeight = function(index) {
        var height = index === page.feedData.length ?
            ListViewLoadItemDesign.defaults.designHeight : FeedItemDesign.defaults.designHeight;
        return height;
    };

    lvFeed.onRowCreate = function() {
        var listViewItem = new ListViewItem();
        var feedItem = new FeedItem();
        var listViewLoadItem = new ListViewLoadItem();
        listViewItem.addChild(feedItem);
        listViewItem.addChild(listViewLoadItem);
        return listViewItem;
    };

    lvFeed.onRowBind = function(listViewItem, index) {
        var lastRow = index === page.feedData.length;
        var feedItem = listViewItem.findChildById(1110);
        var listViewLoadItem = listViewItem.findChildById(1010);
        feedItem.visible = !lastRow;
        listViewLoadItem.visible = lastRow;
        listViewLoadItem.activityIndicator.visible = lastRow;
    };
    
    lvFeed.onRowSelected = function(listViewItem,index){
        var lastRow = index === page.feedData.length;
        if(lastRow)
            return;
        Router.go("pgDoctorAppointment", {
            data: page.feedData[index],
            chart: true
        });
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
    page.lvFeed.itemCount = page.feedData.length + 1; // added for load item
    page.lvFeed.refreshData();

}

module && (module.exports = PgFeed);
