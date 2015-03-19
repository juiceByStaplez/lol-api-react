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
    this.setItems(this.props.game);
    this.setStats(this.props.game);
    this.getChampionById(this.state.championId);
  },
  componentWillReceiveProps: function  (nextProps) {
    this.setItems(nextProps.game);
    this.setStats(nextProps.game);
    this.getChampionById(nextProps.game.championId);
  },
  getChampionById: function  (champId) {
    var self = this;
    var champion = this.state.champions[champId].name;
    var champSprite = this.state.champions[champId].image.sprite;
    var champX = this.state.champions[champId].image.x;
    var champY = this.state.champions[champId].image.y;

    this.setState({championName: champion, champSprite: champSprite, championX: champX, championY: champY});
  },
  setItems: function  (game) {
    var self = this;
    var items = [];
    var itemArray = [game.stats.item0, game.stats.item1, game.stats.item2, game.stats.item3, game.stats.item4, game.stats.item5, game.stats.item6 ];
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
    this.setState({items: items});
  },
  setStats: function  (game) {
    var self = this;
    var kills = game.stats.championsKilled;
    var assists = game.stats.assists;
    var deaths = game.stats.numDeaths;
    var win = game.stats.win;

    win ? win = 'won' : win = 'lost';
    this.setState({kills: kills, assists: assists, deaths: deaths, win: win });
  }
});

module.exports = Game;