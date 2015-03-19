var React = require('react');
var config = require('../config/config');

var Item = React.createClass({
  render: function() {
    var backgroundStyles = {
      backgroundPosition: '-'+this.props.item.image.x+'px -'+ this.props.item.image.y+'px'
    };
    return (
      <div className={"itemicon "+this.props.item.image.sprite.replace('.png', '')} style={backgroundStyles}>
        <div className={"tooltip"} >
          {this.props.item.description}
        </div>
      </div>
      );
  }
});

module.exports = Item;