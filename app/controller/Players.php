<?php

namespace app\controller;
use flundr\mvc\Controller;
use flundr\auth\Auth;

class Players extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Players,Teams');
		if (!Auth::logged_in() && !Auth::valid_ip()) {Auth::loginpage();}
	}

	public function index() {
		$this->view->players = $this->Players->list();
		$this->view->title = 'Spieler-Verwaltung';
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
