var React = require('react');
var config = require('../config/config');

var Game = require('./Game');

var GameList = React.createClass({
  render: function  () {
    var self = this;
    return (
      <div className="game-list">
        {this.props.games.map(function(game, index) {
          return (
            <Game game={game} key={index} champions={self.props.champions} itemData={self.props.itemData}/>
          );
        })}
      </div>
    );
  }
});

module.exports = GameList;