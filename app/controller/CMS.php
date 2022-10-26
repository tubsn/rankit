<?php

namespace app\controller;
use flundr\mvc\Controller;

class CMS extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('');
	}

	public function index() {
		$this->view->title = 'RankIT CMS';
		$this->view->render('cms');
	}

}
