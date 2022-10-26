<?php

namespace app\controller;
use flundr\mvc\Controller;

class Teams extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Teams,Locations');
	}

	public function index() {
		$this->view->teams = $this->Teams->all();
		$this->view->title = 'Team Übersicht';
		$this->view->render('teams/list');
	}

	public function create() {

		$this->view->locations = $this->Locations->all();
		$this->view->title = 'Neues Team anlegen';
		$this->view->render('teams/new');
	}

	public function save() {
		if (empty($_POST['name'])) {
			throw new \Exception("Bitte Teamnamen angeben!", 1);
		}		
		$this->Teams->create($_POST);
		$this->view->redirect('/cms/teams');
	}

	public function edit($id) {
		$this->view->locations = $this->Locations->all();
		$this->view->team = $this->Teams->get($id);
		$this->view->title = 'Team bearbeiten';
		$this->view->render('teams/edit');
	}

	public function update($id) {
		$this->Teams->update($_POST,$id);
		$this->view->redirect('/cms/teams');
	}

	public function delete($id) {
		$this->Teams->delete($id);
		$this->view->redirect('/cms/teams');
	}

}
