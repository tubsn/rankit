<?php

namespace app\models;
use \flundr\database\SQLdb;
use \flundr\mvc\Model;

class Matches extends Model
{

	public function __construct() {

		$this->db = new SQLdb(DB_SETTINGS);
		$this->db->table = 'matches';

	}


}
