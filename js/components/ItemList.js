var React = require('react');
var config = require('../config/config');

var Item = require('./Item');

var ItemList = React.createClass({
  render: function  () {
    var self = this;
    return (
      <div className="item-list">
        {this.props.items.map(function(item, index) {
          return (
            <Item item={item} key={index} />
          );
        })}
      </div>
    );
  }
});

module.exports = ItemList;