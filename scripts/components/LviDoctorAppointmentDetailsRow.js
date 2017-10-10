const extend = require('js-base/core/extend');
const Color = require('sf-core/ui/color');
const LviDoctorAppointmentDetailsRowDesign = require('library/LviDoctorAppointmentDetailsRow');

const LviDoctorAppointmentDetailsRow = extend(LviDoctorAppointmentDetailsRowDesign)(
  function(_super, props, pageName) {
    _super(this, props || LviDoctorAppointmentDetailsRowDesign.defaults);
    this.pageName = pageName;
    const lviDoctorAppointmentDetailsRow = this;
    var color;
    Object.defineProperties(lviDoctorAppointmentDetailsRow, {
      lblTitle: {
        enumerable: true,
        get: () => {
          return lviDoctorAppointmentDetailsRow.findChildById(1201);
        }
      },
      lblValue: {
        enumerable: true,
        get: () => {
          return lviDoctorAppointmentDetailsRow.findChildById(1202);
        }
      },
      color: {
        enumerable: true,
        get: () => { return color; },
        set: function(value) {
          var c = value;
          if (typeof value === "string")
            c = Color.create(value);
          lviDoctorAppointmentDetailsRow.lblTitle.textColor = c;
          lviDoctorAppointmentDetailsRow.lblValue.textColor = c;
          color = value;
        }
      },
      setData: {
        value: function(data = {}) {
          lviDoctorAppointmentDetailsRow.lblTitle.text = data.title;
          lviDoctorAppointmentDetailsRow.lblValue.text = data.value;
          lviDoctorAppointmentDetailsRow.color = data.color;
        },
        readOnly: true,
        enumerable: true
      }
    });



  }
);
Object.assign(LviDoctorAppointmentDetailsRowDesign.defaults, {
  width: NaN,
  height: NaN
});
module && (module.exports = LviDoctorAppointmentDetailsRow);
