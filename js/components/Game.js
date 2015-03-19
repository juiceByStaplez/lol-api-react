var React = require('react');
var config = require('../config/config');

var ItemList = require('./ItemList');

var Game = React.createClass({
  getInitialState: function  () {
    return {
      championId: this.props.game.championId,
      championName: '',
      champions: this.props.champions,
      champSprite: '',
      championX: '',
      championY: '',
      win: '',
      kills: '',
      assists: '',
      deaths: '',
      items: [],
      itemData: this.props.itemData
    }
  },
  render: function  () {
    var backgroundStyles = {
      backgroundPosition: '-'+this.state.championX+'px -'+ this.state.championY+'px'
    };
    return (
      <div className={"game "+this.state.win } >
        <div className={"champicon-wrapper"}>
          <div className={"champicon "+ this.state.champSprite.replace('.png', '')} style={backgroundStyles}></div>
          <small>{this.state.championName}</small>
        </div>
        <div className={"stat-wrapper"} >
        <ItemList items={this.state.items} />
        K/D/A: <small> {this.state.kills} / {this.state.deaths} / {this.state.assists}</small>
        </div>
      </div>
    );
  },
  componentWillMount: function  () {
    this.getChampionById(this.state.championId);
  },
  componentWillReceiveProps: function  (nextProps) {
    this.getChampionById(nextProps.game.championId);
  },
  getChampionById: function  (champId) {
    var self = this;
    var champion = this.state.champions[champId].name;
    var champSprite = this.state.champions[champId].image.sprite;
    var champX = this.state.champions[champId].image.x;
    var champY = this.state.champions[champId].image.y;
    var win = this.props.game.stats.win;
    var kills = this.props.game.stats.championsKilled;
    var assists = this.props.game.stats.assists;
    var deaths = this.props.game.stats.numDeaths;
    var itemArray = [this.props.game.stats.item0, this.props.game.stats.item1, this.props.game.stats.item2, this.props.game.stats.item3, this.props.game.stats.item4, this.props.game.stats.item5, this.props.game.stats.item6];
    var items = [];
    if(win == true) {
      win = 'won';
    } else {
      win = 'lost';
    }
    itemArray.map(function  (item, index) {
      if(item === undefined) {
        itemObj = {
          id: '',
          name: '',
          plaintext: '',
          description: '',
          image: {
            sprite: 'empty_item',
            x: 0,
            y: 0
          }
        }
      } else {
        itemObj = {
          id: self.state.itemData[item].id,
          name: self.state.itemData[item].name,
          plaintext: self.state.itemData[item].plaintext,
          description: self.state.itemData[item].sanitizedDescription,
          image: {
            sprite: self.state.itemData[item].image.sprite,
            x: self.state.itemData[item].image.x,
            y: self.state.itemData[item].image.y,
          }
        }
      }
      items.push(itemObj);
    });
    this.setState({championName: champion, champSprite: champSprite, championX: champX, championY: champY, win: win, kills: kills, assists: assists, deaths: deaths, items: items});
  }
});

module.exports = Game;