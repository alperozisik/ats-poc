const extend = require('js-base/core/extend');
const PgFeedDesign = require('ui/ui_pgFeed');
const ListViewItem = require('sf-core/ui/listviewitem');
const FeedItem = require("../components/FeedItem");
const ListViewLoadItem = require("../components/ListViewLoadItem");
const FeedItemDesign = require('library/FeedItem');
const ListViewLoadItemDesign = require('library/ListViewLoadItem');
const Router = require("sf-core/ui/router");
const Color = require('sf-core/ui/color');
const FloatingMenu = require("sf-core/ui/floatingmenu");
const Image = require("sf-core/ui/image");
const mainColor = Color.create("#104682");
const waitDialog = require("../lib/waitDialog");
const userService = require("../services/user");

const PgFeed = extend(PgFeedDesign)(
    // Constructor
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

        const page = this;
        page.showDialog = () => {
            if (!page.lvFeed.visible)
                return;
            waitDialog.show();
            page.lvFeed.visible = false;
            page.fab && (page.fab.visible = false);
        };
        page.hideDialog = () => {
            if (page.lvFeed.visible)
                return;
            waitDialog.hide();
            page.lvFeed.visible = true;
            page.fab && (page.fab.visible = true);
            /*if (!page.feedData.reachedToTheEnd)
                page.lvFeed.scrollTo(page.feedData.items.length - 1); //hides loading row*/
        };



    });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow, data = {}) {
    superOnShow();
    const page = this;
    page.feedData = {
        page: 0,
        items: [],
        reachedToTheEnd: false
    };
    page.showDialog();
    setTimeout(() => {
        fetchData.call(page);
    }, 450);
    page.lvFeed.scrollTo(0);

    if (!page.fab) {
        let fabItems = [
            new FloatingMenu.Item({
                title: "Book Appointmnet",
                titleColor: Color.BLACK,
                icon: Image.createFromFile("images://ic_date_range.png"),
                color: Color.WHITE,
                onClick: function() {
                    Router.go("pgBookAppointment", { new: true });
                }
            })
        ];
        page.fab = new FloatingMenu({
            items: fabItems,
            rotateEnabled: true,
            icon: Image.createFromFile("images://ic_add_white.png"),
            color: mainColor
        });
        page.layout.addChild(page.fab);
    }
    console.log(`patientId is = ${data.patientId}`);
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;
    page.headerBar.itemColor = mainColor;

    page.android.onBackButtonPressed = function() { Router.goBack() };

    const lvFeed = page.lvFeed;
    lvFeed.refreshEnabled = false;
    // lvFeed.rowHeight = Math.max(FeedItemDesign.defaults.designHeight, ListViewLoadItemDesign.defaults.designHeight);

    lvFeed.onRowHeight = function(index) {
        var height = index === page.feedData.items.length ?
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
        var lastRow = index === page.feedData.items.length;
        var feedItem = listViewItem.findChildById(1110);
        var listViewLoadItem = listViewItem.findChildById(1010);
        feedItem.visible = !lastRow;
        listViewLoadItem.visible = lastRow;
        listViewLoadItem.activityIndicator.visible = lastRow;
        if (!lastRow) {
            feedItem.bindData(page.feedData.items[index]);
        }
        else {
            fetchData.call(page);
        }
    };

    lvFeed.onRowSelected = function(listViewItem, index) {
        var lastRow = index === page.feedData.items.length;
        if (lastRow)
            return;
        var data;
        page.feedData.items[index];
        if (!data.orderNo)
            return;
        Router.go("pgDoctorAppointment", {
            data,
            chart: true
        });
    };
}

function fetchData() {
    const page = this;
    if (page.fetching)
        return;
    page.fetching = true;


    userService.getTimeline(page.feedData.page + 1).then(result => {
        page.fetching = false;
        if (result.page === page.feedData.page + 1) {
            page.feedData.page = result.page;
            page.feedData.items = page.feedData.items.concat(result.items);
            page.feedData.items.sort(compareItems);
            let lastItem = page.feedData.items[page.feedData.items.length - 1];
            let lastItemPaging = Number(lastItem.paging);
            if ((lastItemPaging - 1) % 5 !== 0)
                page.feedData.reachedToTheEnd = true;
            loadData.call(page);
        }
        else {
            page.feedData.reachedToTheEnd = true;
        }
        page.hideDialog();

    }).catch(err => {
        //TODO: show alert?
        page.hideDialog();
    });

}

function loadData() {
    const page = this;

    var itemCount = page.feedData.items.length;
    if (!page.feedData.reachedToTheEnd)
        itemCount++; // added for load item
    page.lvFeed.itemCount = itemCount;
    page.lvFeed.refreshData();
}

function compareItems(a, b) {
    return Number(a.paging) - Number(b.paging);
}
/*
function isLastRow(page, index) {
    page.feedData.reachedToTheEnd
}*/


module && (module.exports = PgFeed);
