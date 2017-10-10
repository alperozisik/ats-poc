const extend = require('js-base/core/extend');
const PgDoctorAppointmentDesign = require('ui/ui_pgDoctorAppointment');
const JET = require('sf-extension-oracle-jet');
const LviDoctorAppointmentDetailsRow = require("../components/LviDoctorAppointmentDetailsRow");
const Color = require('sf-core/ui/color');
const Router = require("sf-core/ui/router");

const PgDoctorAppointment = extend(PgDoctorAppointmentDesign)(
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
function onShow(superOnShow, data = {}) {
    superOnShow();
    const page = this;

    if (!page.jet) {
        page.jet = new JET({
            jetPath: "assets://jet/",
            webView: page.wvChart
        });
        Object.assign(page.jet, {
            series: [{ name: "Series 1", items: [74, 42, 70, 46] },
                { name: "Series 2", items: [50, 58, 46, 54] },
                { name: "Series 3", items: [34, 22, 30, 32] },
                { name: "Series 4", items: [18, 6, 14, 22] }
            ],
            groups: ["Group A", "Group B", "Group C", "Group D"],
            type: JET.Type.AREA,
            orientation: JET.Orientation.VERTICAL,
            stack: JET.Stack.OFF,
            animationOnDisplay: JET.AnimationOnDisplay.AUTO,
            animationOnDataChange: JET.AnimationOnDataChange.AUTO,

        });
        page.jet.jetData.backgroundColor = "#FFFFFF";
    }

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
    page.lvResults.refreshEnabled = false;
    page.headerBar.itemColor = Color.create("#104682");
    page.android.onBackButtonPressed = () => Router.goBack();
    
    page.lvResults.onRowCreate = function() {
        var listViewItem = new LviDoctorAppointmentDetailsRow();
        return listViewItem;
    };

    page.lvResults.onRowBind = function(listViewItem, index) {
        var rowData = page.data && page.data.results &&
            page.data.results[index] || {
                title: "title",
                value: "value",
                color: "#FF0000"
            };
        listViewItem.setData(rowData);
    };
}

function fetchData() {
    const page = this;

    setTimeout(() => {
        page.data = page.data || {};
        page.data.results = page.data.results || [{
                title: "Cholesterol",
                value: 3.5,
                color: "#8E9038"
            },
            {
                title: "Lab Result",
                value: 103,
                color: "#2BC122"
            }, {
                title: "Lab Result",
                value: "35/90",
                color: "#51BB4F"
            },
            {
                title: "Lab Result",
                value: "65%",
                color: "#E12C3B"
            }
        ];

        //to add more items remove comments below
        /*page.data.results.push({
            title: "Cholesterol",
            value: 3.5,
            color: "#8E9038"
        }, {
            title: "Lab Result",
            value: 103,
            color: "#2BC122"
        }, {
            title: "Lab Result",
            value: "35/90",
            color: "#51BB4F"
        }, {
            title: "Lab Result",
            value: "65%",
            color: "#E12C3B"
        }, {
            title: "Cholesterol",
            value: 3.5,
            color: "#8E9038"
        }, {
            title: "Lab Result",
            value: 103,
            color: "#2BC122"
        }, {
            title: "Lab Result",
            value: "35/90",
            color: "#51BB4F"
        }, {
            title: "Lab Result",
            value: "65%",
            color: "#E12C3B"
        });/**/

        loadData.call(page);
    }, 150);

}

function loadData() {
    const page = this;
    page.lvResults.itemCount = page.data.results.length;
    page.lvResults.refreshData();

}

module && (module.exports = PgDoctorAppointment);
