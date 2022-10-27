<?php

namespace app\controller;
use flundr\mvc\Controller;

class Players extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Players,Teams,Matches');
	}

	public function list($id = 1) {
		$this->view->teams = $this->Teams->all();
		$this->view->players = $this->Players->team($id);
		$this->view->render('player-list');
	}

	public function match($id) {
		//$this->view->matches = $this->Matches->all();
		$this->view->players = $this->Players->match($id);
		$this->view->render('player-list');

	}

	public function get($id) {
		dd($this->Players->get($id));
		//$this->view->render('example');
	}



	public function index() {
		$this->view->teams = $this->Teams->all();
		$this->view->players = $this->Players->all();
		$this->view->render('players/list');
	}


	public function create() {
		$this->view->teams = $this->Teams->all();
		$this->view->title = 'Neues Spieler Profil anlegen';
		$this->view->render('players/new');
	}

	public function save() {
		$this->Players->create($_POST);
		$this->view->redirect('/cms/players');
	}

	public function edit($id) {
		$this->view->teams = $this->Teams->all();
		$this->view->player = $this->Players->get($id);
		$this->view->title = 'Spieler bearbeiten';
		$this->view->render('players/edit');
	}

	public function update($id) {
		if (empty($_POST['team_id'])) {$_POST['team_id'] = null;}
		$this->Players->update($_POST,$id);
		$this->view->redirect('/cms/players');
	}

	public function delete($id) {
		$this->Players->delete($id);
		$this->view->redirect('/cms/players');
	}

}
