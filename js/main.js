var React = require('react');
var config = require('./config/config');
var LeagueSearch = require('./components/LeagueSearch');
var GameList = require('./components/GameList');
var ItemList = require('./components/ItemList');
var FilterList = require('./components/FilterList');


React.render(
  <LeagueSearch />,
  document.getElementById('content')
);