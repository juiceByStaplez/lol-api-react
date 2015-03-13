var region = 'na';
var key = '5bb76a52-7540-4620-a9c7-e0deef2bb544';
var version = 'v1.4';
var staticVersion = 'v1.2';
var path = 'summoner/by-name/';
var champPath = 'champion';
var staticUrl = 'https://global.api.pvp.net/api/lol/static-data/'+region+'/'+staticVersion+'/';

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
      <div className="leagueSearch">
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="summonerName" placeholder="Enter summoner name.." defaultValue="godsgodgg" />
        <input type="submit" value="Search" />
      </form>
      <GameList games={this.state.games} champions={this.state.champions} itemData={this.state.itemData}/>
      </div>
    );
  },
  componentDidMount: function  () {
    $.ajax({
      url: staticUrl+champPath,
      dataType: 'json',
      data: {
        champData: 'image',
        dataById: true,
        api_key: key
      },
      type: 'GET',
      success: function  (data) {
        this.setState({champions: data.data});
      }.bind(this)
    });
    $.ajax({
      url: staticUrl+'item',
      dataType: 'json',
      data: {
        api_key: key,
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
    var url = 'https://'+region+'.api.pvp.net/api/lol/'+region+'/'+version+'/'+path;
      $.ajax({
        url: url+summonerName,
        dataType: 'json',
        data: {
          api_key: key,
        },
        success: function  (data) {
          console.log(data);
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
    var url = `https://${region}.api.pvp.net/api/lol/${region}/${gameVersion}/${gamePath}`;
    $.ajax({
      url: url,
      dataType: 'json',
      data: {
        api_key: key
      },
      success: function  (data) {
        this.setState({games: data.games});
      }.bind(this)
    });
  }

});

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
    itemArray.map(function  (item, index) {
      if(item === undefined) {
        itemObj = {
          id: '',
          name: '',
          plaintext: '',
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
          image: {
            sprite: self.state.itemData[item].image.sprite,
            x: self.state.itemData[item].image.x,
            y: self.state.itemData[item].image.y,
          }
        }
      }
      items.push(itemObj);
    });
    if(win == true) {
      win = 'won';
    } else {
      win = 'lost';
    }
    this.setState({championName: champion, champSprite: champSprite, championX: champX, championY: champY, win: win, kills: kills, assists: assists, deaths: deaths, items: items});
  }
});

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

var Item = React.createClass({
  render: function() {
    var backgroundStyles = {
      backgroundPosition: '-'+this.props.item.image.x+'px -'+ this.props.item.image.y+'px'
    };
    return (
      <div className={"itemicon "+this.props.item.image.sprite.replace('.png', '')} style={backgroundStyles}>
      </div>
      );
  }
});

React.render(
  <LeagueSearch />,
  document.getElementById('content')
);