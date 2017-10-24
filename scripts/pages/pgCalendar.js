/*globals Device*/
const extend = require('js-base/core/extend');
const PgCalendarDesign = require('ui/ui_pgCalendar');
const Calendar = require("@smartface/sf-calendar-component/components/Calendar");
const FlexLayout = require('sf-core/ui/flexlayout');

const PgCalendar = extend(PgCalendarDesign)(
    // Constructor
    function(_super) {
        // Initalizes super class for this page scope
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
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
        page.layout.addChild(calendar);

        calendar.addStyles(calendarStyle);


        calendar.onBeforeMonthChange = function(monthChangeArgs) {
            /* var dCurrent = new Date();
             dCurrent.setDate(1);
             var dNew = new Date(`${monthChangeArgs.year}-${monthChangeArgs.month}-01`);
             return Number(dNew) >= Number(dCurrent);*/
            return true;
        };

        calendar.onMonthChange = function(monthChangeArgs) {

        };

        calendar.onDaySelect = function(date) {

            if (date.dayInfo.specialDay.length === 0) {
                page.calendar.setDate({ month: date.date.month, year: date.date.year });

                return;
            }
            if (!page.dateSelected) { //first time date selected in page
            }
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
    loadCal.call(this);
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
}

module && (module.exports = PgCalendar);


function loadCal(month = 10, year = 2017) {
    const page = this;
    var result = [{ "monthDay": 1, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 2, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 3, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 4, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 7, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 8, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 9, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 10, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 11, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 14, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 15, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 16, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 17, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 18, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 21, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 22, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 23, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 24, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 25, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 28, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 29, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 30, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }, { "monthDay": 31, "apptCount": 4, "apptReserved": 0, "apptAvailable": 4 }];

    let specialDays = {
        byMonths: [{
            month: month,
            days: []
        }]
    };
    result.forEach((dayData) => {
        if (dayData.apptAvailable > 0) {
            let specialDateTempalte = {
                "day": dayData.monthDay,
                "calendars": {
                    "*": {
                        "availableLangs": "*",
                        "text": {
                            "*": String(dayData.apptAvailable)
                        }
                    }
                },
                "length": 1
            };
            specialDays.byMonths[0].days.push(specialDateTempalte);
        }
    });

    var lang = Device.language; //System.language.subStr(0, 2);
    lang = lang === "ar" ? "ar-sa" : "en";
    page.calendar.changeCalendar(lang, lang === "en" ? "gregorian" : "hijri", specialDays);
    page.calendar.setDate({ month, year });
}

var calendarStyle = {
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

            }
        }
    }
};
