var React = require('react');
var config = require('../config/config');
var api_key = require('../config/api_key').key;

var FilterList = require('./FilterList');
var GameList = require('./GameList');

var LeagueSearch = React.createClass({
  getInitialState: function  () {
    return {
      summonerId: '',
      summonerName: '',
      games: [],
      champions: [],
      itemData: [],
      activeGames: [],
    }
  },
  render: function  () {
    var items = this.state.itemData;
    var item_choices = [{name: 'Any', id: 'any'}];
    for(var key in items) {
      var itemObj = {
        name: items[key].name,
        id: items[key].id
      }
      item_choices.push(itemObj);
    }
    return (
      <div className={"leagueSearch"}>
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="summonerName" placeholder="Enter summoner name.." defaultValue="godsgodgg" />
        <input type="submit" value="Search" />
      </form>
      <select games={this.state.games} items={this.state.itemData} ref="filterList" onChange={this.filter}>
      {item_choices.map(function  (item, index) {
        return (
          <option value={item.id} key={index}>{item.name}</option>
        );
      })}
      </select>
      <GameList games={this.state.activeGames} champions={this.state.champions} itemData={this.state.itemData}/>
      </div>
    );
  },
  componentDidMount: function  () {
    $.ajax({
      url: `${config.staticUrl}/${config.region}/${config.staticVersion}/${config.champPath}`,
      dataType: 'json',
      data: {
        champData: 'image',
        dataById: true,
        api_key: api_key
      },
      type: 'GET',
      success: function  (data) {
        this.setState({champions: data.data});
      }.bind(this)
    });
    $.ajax({
      url: `${config.staticUrl}/${config.region}/${config.staticVersion}/item`,
      dataType: 'json',
      data: {
        api_key: api_key,
        locale: 'en_US',
        itemListData: 'all'
      },
      type: 'GET',
      success: function  (data) {
        this.setState({itemData: data.data});
      }.bind(this)
    });
  },
  handleSubmit: function  (e) {
    e.preventDefault();
    var summonerName = this.refs.summonerName.getDOMNode().value.trim();
    var summonerId = this.state.summonerId;
    var url = 'https://'+config.region+'.api.pvp.net/api/lol/'+config.region+'/'+config.version+'/'+config.path;
      $.ajax({
        url: url+summonerName,
        dataType: 'json',
        data: {
          api_key: api_key,
        },
        success: function  (data) {
          var self = this;
          summonerName = summonerName.toLowerCase().split(' ').join('');
          var summonerId = data[summonerName].id;
          var styledName = data[summonerName].name;
          this.getGamesById(summonerId);
          this.setState({summonerId: summonerId, summonerName: styledName});
        }.bind(this)
      });
  },
  getGamesById: function  (summonerId) {
    var gameVersion = 'v1.3';
    var gamePath = 'game/by-summoner/'+summonerId+'/recent';
    var url = `https://${config.region}.api.pvp.net/api/lol/${config.region}/${gameVersion}/${gamePath}`;
    $.ajax({
      url: url,
      dataType: 'json',
      data: {
        api_key: api_key
      },
      success: function  (data) {
        this.setState({games: data.games, activeGames: data.games});
      }.bind(this)
    });
  },
  filter: function  (e) {
    var value = this.refs.filterList.getDOMNode().value;
    var activeGames = [];
    if(value == 'any') {
      this.getGamesById(this.state.summonerId);
    } else {
    for(var key in this.state.games) {
      if(value == this.state.games[key].stats.item0 || value == this.state.games[key].stats.item1 || value == this.state.games[key].stats.item2 || value == this.state.games[key].stats.item3 || value == this.state.games[key].stats.item4 || value == this.state.games[key].stats.item5 || value == this.state.games[key].stats.item6) {
        activeGames.push(this.state.games[key]);
      }
    }
    this.setState({activeGames: activeGames});
  }
 }

});

module.exports = LeagueSearch;