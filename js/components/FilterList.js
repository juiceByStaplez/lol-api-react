var React = require('react');
var config = require('../config/config');

var FilterList = React.createClass({
  render: function() {
    return (
      <select ref="filterList" >
      </select>
    );
  }
});

module.exports = FilterList;