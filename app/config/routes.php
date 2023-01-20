<?php
$routes->get('/', 'Home@index');

// API Stuff
$routes->get('/player/{id:\d+}', 'API@player');
$routes->get('/player/{id:\d+}/development[/{leagueID:\d+}]', 'API@player_development');
$routes->get('/team/{teamID:\d+}/players', 'API@team_players');
$routes->get('/match/{id:\d+}', 'API@match');
$routes->get('/match/latest[/{leagueID:\d+}]', 'API@latest_match');
$routes->get('/matches[/{leagueID:\d+}]', 'API@match_list');

// API Votes
$routes->post('/vote/{playerID:\d+}', 'API@cast_vote');

// CMS
$routes->get('/admin', 'Matches@index');
$routes->get('/cms', 'Matches@index');

// Stats
$routes->get('/cms/stats', 'Stats@index');

// Matches
$routes->get('/cms/matches/create', 'Matches@create');
$routes->post('/cms/matches/create', 'Matches@save');
$routes->get('/cms/matches/{id:\d+}', 'Matches@edit');
$routes->post('/cms/matches/{matchID:\d+}/vote/{playerID:\d+}', 'Matches@cast_internal_vote');
$routes->get('/cms/matches/{id:\d+}/vote', 'Matches@internal_vote');
$routes->post('/cms/matches/{id:\d+}', 'Matches@update');
$routes->get('/cms/matches/{id:\d+}/delete', 'Matches@delete');

// Locations
$routes->get('/cms/locations', 'Locations@index');
$routes->get('/cms/locations/create', 'Locations@create');
$routes->post('/cms/locations/create', 'Locations@save');
$routes->get('/cms/locations/{id:\d+}', 'Locations@edit');
$routes->post('/cms/locations/{id:\d+}', 'Locations@update');
$routes->get('/cms/locations/{id:\d+}/delete', 'Locations@delete');

// Teams
$routes->get('/cms/teams', 'Teams@index');
$routes->get('/cms/teams/create', 'Teams@create');
$routes->post('/cms/teams/create', 'Teams@save');
$routes->get('/cms/teams/{id:\d+}', 'Teams@edit');
$routes->post('/cms/teams/{id:\d+}', 'Teams@update');
$routes->get('/cms/teams/{id:\d+}/delete', 'Teams@delete');

// Players
$routes->get('/cms/players', 'Players@index');
$routes->get('/cms/players/create', 'Players@create');
$routes->post('/cms/players/create', 'Players@save');
$routes->get('/cms/players/{id:\d+}', 'Players@edit');
$routes->post('/cms/players/{id:\d+}', 'Players@update');
$routes->get('/cms/players/{id:\d+}/delete', 'Players@delete');

// Leagues
$routes->get('/cms/embed', 'Leagues@embed');
$routes->get('/cms/leagues', 'Leagues@index');
$routes->get('/cms/leagues/create', 'Leagues@create');
$routes->post('/cms/leagues/create', 'Leagues@save');
$routes->get('/cms/leagues/default/{id:\d+}', 'Leagues@set_default');
$routes->get('/cms/leagues/{id:\d+}', 'Leagues@edit');
$routes->post('/cms/leagues/{id:\d+}', 'Leagues@update');
$routes->get('/cms/leagues/{id:\d+}/delete', 'Leagues@delete');


// You can delete these if you don´t need Users in your App

// Authentication Routes
$routes->get('/login', 'Authentication@login');
$routes->post('/login', 'Authentication@login');
$routes->get('/logout', 'Authentication@logout');
$routes->get('/profile', 'Authentication@profile');
$routes->get('/password-reset', 'Authentication@password_reset_form');
$routes->post('/password-reset', 'Authentication@password_reset_send_mail');
$routes->get('/password-change[/{resetToken}]', 'Authentication@password_change_form');
$routes->post('/password-change[/{resetToken}]', 'Authentication@password_change_process');
$routes->get('/profile/edit', 'Authentication@edit_profile');
$routes->post('/profile/edit', 'Authentication@edit_profile');

// Usermanagement / Admin Routes
/*
$routes->get('/admin', 'Usermanagement@index');
$routes->get('/admin/new', 'Usermanagement@new');
$routes->post('/admin', 'Usermanagement@create');
$routes->get('/admin/{id:\d+}', 'Usermanagement@show');
$routes->get('/admin/{id:\d+}/delete/{token}', 'Usermanagement@delete');
$routes->post('/admin/{id:\d+}', 'Usermanagement@update');
*/