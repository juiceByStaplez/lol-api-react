var region = 'na';
var key = '5bb76a52-7540-4620-a9c7-e0deef2bb544';
var version = 'v1.4';
var staticVersion = 'v1.2';
var path = 'summoner/by-name/';
var champPath = 'champion';
var staticUrl = 'https://global.api.pvp.net/api/lol/static-data/'+region+'/'+staticVersion+'/'+champPath;

var LeagueSearch = React.createClass({
  getInitialState: function  () {
    return {
      summonerId: '',
      summonerName: '',
      games: [],
      champions: []
    }
  },
  render: function  () {
    return (
      <div className="leagueSearch">
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="summonerName" placeholder="Enter summoner name.." defaultValue="godsgodgg" />
        <input type="submit" value="Search" />
      </form>
      <GameList games={this.state.games} champions={this.state.champions}/>
      </div>
    );
  },
  componentDidMount: function  () {
    $.ajax({
      url: staticUrl,
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
            <Game game={game} key={index} champions={self.props.champions} />
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
      deaths: ''
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
        <span>K/D/A:</span><small> {this.state.kills} / {this.state.assists} / {this.state.deaths}</small>
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
    var champion = this.state.champions[champId].name;
    var champSprite = this.state.champions[champId].image.sprite;
    var champX = this.state.champions[champId].image.x;
    var champY = this.state.champions[champId].image.y;
    var win = this.props.game.stats.win;
    var kills = this.props.game.stats.championsKilled;
    var assists = this.props.game.stats.assists;
    var deaths = this.props.game.stats.numDeaths;
    if(win == true) {
      win = 'won';
    } else {
      win = 'lost';
    }
    this.setState({championName: champion, champSprite: champSprite, championX: champX, championY: champY, win: win, kills: kills, assists: assists, deaths: deaths});
  }
});

React.render(
  <LeagueSearch />,
  document.getElementById('content')
);