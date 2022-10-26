<?php
/*
Complete Documentation on: https://github.com/nikic/FastRoute
Example Routes:
$routes->get('/urlpath[/{optionalparameter}]', 'Controller@Action');
$routes->post('/article/{id:\d+}', 'Controller@Action'); With ID-Parameter (Numeric)
*/

$routes->get('/', 'Players@list');
$routes->get('/team/{id:\d+}', 'Players@list');
$routes->get('/match/{id:\d+}', 'Players@match');
$routes->get('/player/{id:\d+}', 'Players@get');


$routes->get('/vote', 'Vote@index');
$routes->post('/vote/{playerID:\d+}', 'Vote@cast');

$routes->get('/cms', 'CMS@index');

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
$routes->get('/admin', 'Usermanagement@index');
$routes->get('/admin/new', 'Usermanagement@new');
$routes->post('/admin', 'Usermanagement@create');
$routes->get('/admin/{id:\d+}', 'Usermanagement@show');
$routes->get('/admin/{id:\d+}/delete/{token}', 'Usermanagement@delete');
$routes->post('/admin/{id:\d+}', 'Usermanagement@update');
