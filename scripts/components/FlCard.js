const extend = require('js-base/core/extend');
const Color = require('sf-core/ui/color');
const startColor = Color.create(60, 10, 10, 10);
const endColor = Color.create(20, 60, 60, 60);
const FlexLayout = require('sf-core/ui/flexlayout');

const shadowColorBottom = Color.createGradient({
  startColor,
  endColor,
  direction: Color.GradientDirection.VERTICAL
});
const shadowColorLeft = Color.createGradient({
  endColor: startColor,
  startColor: endColor,
  direction: Color.GradientDirection.HORIZONTAL
});
const shadowColorRight = Color.createGradient({
  startColor,
  endColor,
  direction: Color.GradientDirection.HORIZONTAL
});
const shadowColorLeftCorner = Color.createGradient({
  startColor,
  endColor,
  direction: Color.GradientDirection.DIAGONAL_RIGHT
});


const FlCardDesign = require('library/FlCard');

const FlCard = extend(FlCardDesign)(
  //constructor
  function(_super, props, pageName) {
    // initalizes super class for this scope
    _super(this, props || FlCardDesign.defaults);
    this.pageName = pageName;
    const flCard = this;
    flCard.flShadowRight.backgroundColor = shadowColorRight;
    flCard.flShadowLeft.backgroundColor = shadowColorLeft;
    flCard.flShadowBottom.backgroundColor = shadowColorBottom;
    flCard.flShadowLeftCorner.backgroundColor = shadowColorLeftCorner;


    flCard.setButtonVisible = function(value) {
      if (value) {
        flCard.flWaitAction.visible = false;
        flCard.btnSelect.visible = true;
      }
      else {
        flCard.flWaitAction.visible = true;
        flCard.btnSelect.visible = false;
      }
      //flCard.applyLayout();
    };
  }

);

module && (module.exports = FlCard);
