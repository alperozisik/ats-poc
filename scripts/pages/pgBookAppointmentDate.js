const extend = require('js-base/core/extend');
const PgBookAppointmentDateDesign = require('ui/ui_pgBookAppointmentDate');
const Router = require("sf-core/ui/router");
const Calendar = require("@smartface/sf-calendar-component/components/Calendar");
const FlexLayout = require('sf-core/ui/flexlayout');
const Animator = require('sf-core/ui/animator');

const PgBookAppointmentDate = extend(PgBookAppointmentDateDesign)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    const page = this;
    const calendar = new Calendar();
    Object.assign(calendar, {
      width: NaN,
      top: NaN,
      bottom: NaN,
      left: NaN,
      right: NaN,
      height: NaN,
      flexGrow: 1,
      positionType: FlexLayout.PositionType.RELATIVE
    });
    page.calendar = calendar;
    page.flCalendarPlaceholder.addChild(calendar);

    calendar.onChanged = function(date) {
      if (!page.dateSelected) { //first time date selected in page
        Animator.animate(page.layout, 250, function() {
          page.btnBook.height = 70;
        }).complete(function() {
          Animator.animate(page.layout, 250, function() {
            page.lblSelectedCaption.alpha = 1;
            page.lblSelectedDate.alpha = 1;
          });
        });
      }
      page.dateSelected = date.date;
      page.lblSelectedDate.text = date.date.day + "/" + (date.monthInfo.longName) + "/" + date.date.year;

    };
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
  page.calendar.changeCalendar("en", "gregorian");
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
  const page = this;
  page.android.onBackButtonPressed = function() { Router.goBack() };
  page.btnBook.height = 0;
  page.lblSelectedCaption.alpha = 0;
  page.lblSelectedDate.alpha = 0;
  
  page.btnBook.onPress = function() {
    Router.goBack("pgFeed");
  };
}

module && (module.exports = PgBookAppointmentDate);
