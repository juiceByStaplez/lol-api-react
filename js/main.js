var r = new XMLHttpRequest();
var region = 'na';
var key = '20ac4b0f-3425-4865-b694-beab1e6df748';
var version = 'v1.3';
var path = 'game/by-summoner/20727358/recent';
var url = 'https://'+region+'.api.pvp.net/api/lol/'+region+'/'+version+'/'+path+'?api_key='+key;

var SearchBox = React.createClass({
  loadGamesFromServer: function  () {
    $.ajax({
      url: url,
      dataType: 'json',
      success: function  (data) {
        console.log(data);
        this.setState({data:data});
      }.bind(this),
      error: function  (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function  () {
    return {data: []};
  },
  render: function() {
    return (
      <div>
      <label for="searchBox">Search:</label><br />
      <input className="searchBox" type="search" name="summonerName" />
      </div>
    );
  },
  componentDidMount: function  () {
    this.loadGamesFromServer();
  },
  handleSearchSubmit: function  (search) {
    this.loadGamesFromServer();
  }
});

React.render(
  <SearchBox />,
  document.getElementById('content')
);