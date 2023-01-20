<?php

namespace app\controller;
use flundr\mvc\Controller;
use flundr\auth\Auth;

class Matches extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Teams,Matches,Players,Locations,Scores,Leagues');
		if (!Auth::logged_in() && !Auth::valid_ip()) {Auth::loginpage();}
	}

	public function index() {
		$leaguelist = $this->Leagues->list();
		$this->view->matches = $this->Matches->list(DEFAULT_LEAGUE_ID);

		$leagues = [];
		foreach ($leaguelist as $league) {
			if ($league['id'] == DEFAULT_LEAGUE_ID) {
				$this->view->title = $league['name'] . ' ' . $league['season'];
				continue;
			}
			$leagues[$league['name']] = $this->Matches->list($league['id']);
		}

		$this->view->leagues = $leagues;

		//$this->view->title = 'Spiel-Verwaltung';
		$this->view->render('matches/list');
	}

	public function internal_vote($id) {

		$match = $this->Matches->get($id);
		$this->view->players = $this->Players->by_match($id, $match['players']);
		$this->view->match = $match;

		$this->view->render('matches/vote');

	}

	public function cast_internal_vote($matchID, $playerID) {

		$score = $_POST['score'];

		$data = [
			'player_id' => $playerID,
			'match_id' => $matchID,
			'score' => $score,
			'creator' => 'editor',
		];

		$this->Scores->create($data);
		$this->view->redirect('/cms/matches/' . $matchID . '/vote');

	}

	public function create() {
		$this->view->locations = $this->Locations->all();
		$this->view->leagues = $this->Leagues->list();
		$this->view->teams = $this->Teams->all();
		$this->view->title = 'Neues Spiel anlegen';
		$this->view->render('matches/new');
	}

	public function save() {

		$_POST['date'] = $_POST['date'] . ' ' . $_POST['time'];
		unset($_POST['time']);

		if ($_POST['players']) {
			$_POST['players'] = implode(',', $_POST['players']);
		}
		else {$_POST['players'] = null;}

		if ($_POST['home_goals'] == '') {$_POST['home_goals'] = null;}
		if ($_POST['away_goals'] == '') {$_POST['away_goals'] = null;}

		$this->Matches->create($_POST);
		$this->view->redirect('/cms');
	}

	public function edit($id) {
		$this->view->locations = $this->Locations->all();
		$this->view->leagues = $this->Leagues->list();
		$this->view->teams = $this->Teams->all();
		$this->view->match = $this->Matches->get($id);
		$this->view->title = 'Spiel bearbeiten';
		$this->view->render('matches/edit');
	}

	public function update($id) {

		$_POST['date'] = $_POST['date'] . ' ' . $_POST['time'];
		unset($_POST['time']);

		if ($_POST['players']) {
			$_POST['players'] = implode(',', $_POST['players']);
		}
		else {$_POST['players'] = null;}

		if ($_POST['home_goals'] == '') {$_POST['home_goals'] = null;}
		if ($_POST['away_goals'] == '') {$_POST['away_goals'] = null;}

		$this->Matches->update($_POST,$id);
		$this->view->redirect('/cms');
	}

	public function delete($id) {
		$this->Matches->delete($id);
		$this->view->redirect('/cms');
	}

}
