var React = require('react');
var config = require('../config/config');

var FilterList = require('./FilterList');
var GameList = require('./GameList');

var LeagueSearch = React.createClass({
  getInitialState: function  () {
    return {
      summonerId: '',
      summonerName: '',
      games: [],
      champions: [],
      itemData: []
    }
  },
  render: function  () {
    return (
      <div className={"leagueSearch"}>
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="summonerName" placeholder="Enter summoner name.." defaultValue="godsgodgg" />
        <input type="submit" value="Search" />
      </form>
      <FilterList games={this.state.games} items={this.state.itemData} />
      <GameList games={this.state.games} champions={this.state.champions} itemData={this.state.itemData}/>
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
        api_key: config.key
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
        api_key: config.key,
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
          api_key: config.key,
        },
        success: function  (data) {
          var self = this;
          summonerName = summonerName.toLowerCase().split(' ').join('');
          var summonerId = data[summonerName].id;
          var styledName = data[summonerName].name;
          this.setState({summonerId: summonerId, summonerName: styledName});
          this.getGamesById(summonerId);
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
        api_key: config.key
      },
      success: function  (data) {
        this.setState({games: data.games});
      }.bind(this)
    });
  }

});

module.exports = LeagueSearch;