var React = require('react');
var config = require('../config/config');

var FilterList = React.createClass({
  render: function() {

    return (
      <select ref="filterList" >
      {item_choices.map(function  (item, index) {
        return (
          <option value={item.id} key={index}>{item.name}</option>
        );
      })}
      </select>
    );
  }
});

module.exports = FilterList;