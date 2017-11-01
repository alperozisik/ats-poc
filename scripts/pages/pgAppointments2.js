const extend = require('js-base/core/extend');
const System = require('sf-core/device/system');
const PgAppointments2Design = require('ui/ui_pgAppointments2');
const Color = require('sf-core/ui/color');
const FlexLayout = require('sf-core/ui/flexlayout');
const Picker = require('sf-core/ui/picker');
const Calendar = require("@smartface/sf-calendar-component/components/Calendar");


const PgAppointments2 = extend(PgAppointments2Design)(
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

    calendar.addStyles({
      ".calendar": {
        ".day": {
          "parent": {
            touchEnabled: false
          },
          "&-specialDay": {
            backgroundColor: "#9DE188",
            parent: {
              touchEnabled: true
            },

          },
          "&-weekend": {
            "borderWidth": 0,
            "textColor": "#111111"
          }
        }
      }
    });
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

  var lang = global.Device.language;
  lang = lang === "ar" ? "ar-sa" : "en";
  page.calendar.changeCalendar(lang, lang === "en" ? "gregorian" : "hijri");
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
  const page = this;

  this.flHeader.backgroundColor = Color.createGradient({
    startColor: Color.create("#72d5ff"),
    endColor: Color.create("#505275"),
    direction: Color.GradientDirection.DIAGONAL_LEFT
  });

  if (System.OS === "Android")
    this.flHeader -= 24; //statusbar difference

}

module && (module.exports = PgAppointments2);
