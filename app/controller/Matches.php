<?php

namespace app\controller;
use flundr\mvc\Controller;

class Matches extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Teams,Matches,Players,Locations');
	}

	public function index() {
		$this->view->matches = $this->Matches->list();
		$this->view->title = 'Spiel Übersicht';
		$this->view->render('matches/list');
	}

	public function detail($id) {
		$match = $this->Matches->get($id);
		$match['players'] = $this->Players->by_match($id, $match['players']);
		header('Access-Control-Allow-Origin: *');
		$this->view->json($match);
	}

	public function latest() {
		$match = $this->Matches->latest();
		$match['players'] = $this->Players->by_match($match['id'], $match['players']);
		header('Access-Control-Allow-Origin: *');
		$this->view->json($match);
	}

	public function list() {
		$matches = $this->Matches->list(5);
		header('Access-Control-Allow-Origin: *');
		$this->view->json($matches);
	}

	public function vote($id) {

		$match = $this->Matches->get($id);
	
		$this->view->players = $this->Players->by_match($id, $match['players']);
		$this->view->match = $match;

		$this->view->render('matches/vote');

	}



	public function create() {
		$this->view->locations = $this->Locations->all();
		$this->view->players = $this->Players->only_rankable();
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

		$this->Matches->create($_POST);
		$this->view->redirect('/cms');
	}

	public function edit($id) {
		$this->view->locations = $this->Locations->all();
		$this->view->players = $this->Players->only_rankable();
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

		$this->Matches->update($_POST,$id);
		$this->view->redirect('/cms');
	}

	public function delete($id) {
		$this->Matches->delete($id);
		$this->view->redirect('/cms');
	}

}
