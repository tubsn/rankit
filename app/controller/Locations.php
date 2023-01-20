<?php

namespace app\controller;
use flundr\mvc\Controller;
use flundr\auth\Auth;

class Locations extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Locations');
		if (!Auth::logged_in() && !Auth::valid_ip()) {Auth::loginpage();}
	}

	public function index() {
		$this->view->locations = $this->Locations->all();
		$this->view->title = 'Stadien-Veraltung';
		$this->view->render('locations/list');
	}

	public function create() {

		$this->view->title = 'Neues Stadion anlegen';
		$this->view->render('locations/new');
	}

	public function save() {
		if (empty($_POST['name'])) {
			throw new \Exception("Bitte Namen angeben!", 1);
		}		
		$this->Locations->create($_POST);
		$this->view->redirect('/cms/locations');
	}

	public function edit($id) {
		$this->view->location = $this->Locations->get($id);
		$this->view->title = 'Stadion bearbeiten';
		$this->view->render('locations/edit');
	}

	public function update($id) {
		$this->Locations->update($_POST,$id);
		$this->view->redirect('/cms/locations');
	}

	public function delete($id) {
		$this->Locations->delete($id);
		$this->view->redirect('/cms/locations');
	}

}
