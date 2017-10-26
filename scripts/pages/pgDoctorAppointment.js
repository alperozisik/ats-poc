const extend = require('js-base/core/extend');
const PgDoctorAppointmentDesign = require('ui/ui_pgDoctorAppointment');
const JET = require('sf-extension-oracle-jet');
const LviDoctorAppointmentDetailsRow = require("../components/LviDoctorAppointmentDetailsRow");
const Color = require('sf-core/ui/color');
const Router = require("sf-core/ui/router");
const labService = require("../services/lab");
const waitDialog = require("../lib/waitDialog");

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
    global.SMF.i18n.bindLanguage("pgDoctorAppointment", page);
    page.wvChart.visible = false;
    page.headerBar.itemColor = Color.create("#104682");
    waitDialog.show();
    setTimeout(() => {
        fetchData.call(page, data.data.orderNo);
    }, 450);

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

function fetchData(orderNo) {
    const page = this;

    labService.getLabResults(orderNo).then((result) => {
        page.data = {
            results: [],
            series: []
        };
        waitDialog.hide();
        let labResultsTextArray = [];
        result.forEach((item) => {

            page.data.results.push({
                title: item.testName,
                value: item.result,
                color: (item.isHigh || item.isLow) ? "#EE0000" : "#111111"
            });
            labResultsTextArray.push(`∙ ${item.resultDetails}`);
            if (!isNaN(item.result)) {
                page.data.series.push({
                    name: item.testName,
                    items: [Number(item.result)]
                });
            }
        });
        page.lblSubTitle.text = labResultsTextArray.join("\n");
        loadData.call(page);
    }).catch((err) => {
        console.log(`Lab error: ${JSON.stringify(err)}`);
    });

}

function loadData() {
    const page = this;

    if (!page.jet && page.data.series.length > 0) {
        page.jet = new JET({
            jetPath: "assets://jet/",
            webView: page.wvChart
        });
        Object.assign(page.jet, {
            series: page.data.series,
            groups: [global.lang.labResults],
            type: JET.Type.BAR,
            orientation: JET.Orientation.VERTICAL,
            stack: JET.Stack.OFF,
            animationOnDisplay: JET.AnimationOnDisplay.AUTO,
            animationOnDataChange: JET.AnimationOnDataChange.AUTO,

        });
        page.jet.jetData.backgroundColor = "#FFFFFF";
        page.wvChart.visible = true;
    }
    page.data.series.length === 0 && page.layout.removeChild(page.wvChart);


    page.lvResults.itemCount = page.data.results.length;
    page.lvResults.refreshData();

}

module && (module.exports = PgDoctorAppointment);
