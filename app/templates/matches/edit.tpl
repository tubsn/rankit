<h1><?=$page['title']?></h1>

<form method="post" action="">

	<fieldset style="display:flex; gap:2em;">
	<label>Datum:
		<input type="date" value="<?=formatDate($match['date'], 'Y-m-d')?>" name="date">
	</label>
	<label>Uhrzeit:
		<input type="time" value="<?=formatDate($match['date'], 'H:i')?>" name="time">
	</label>
	</fieldset>

	<fieldset style="display:flex; gap:2em;">

	<label>Heimteam:
		<select name="home_team_id">
		<option value="0">offen</option>
		<?php if ($match['home_team_id']): ?>
		<option selected value="<?=$match['home_team_id']?>"><?=$match['home_team']?></option>
		<?php endif ?>
		<?php foreach ($teams as $team): ?>
		<?php if ($match['home_team_id'] == $team['id']) {continue;} ?>
		<option value="<?=$team['id']?>"><?=$team['name']?></option>
		<?php endforeach; ?>
		</select>
	</label>

	<label>Auswärtsteam:
		<select name="away_team_id">
		<option value="0">offen</option>
		<?php if ($match['away_team_id']): ?>
		<option selected value="<?=$match['away_team_id']?>"><?=$match['away_team']?></option>
		<?php endif ?>
		<?php foreach ($teams as $team): ?>
		<?php if ($match['away_team_id'] == $team['id']) {continue;} ?>
		<option value="<?=$team['id']?>"><?=$team['name']?></option>
		<?php endforeach; ?>
		</select>
	</label>

	</fieldset>


	<label>Stadion:
	<select name="location_id">
		<option value="0">offen</option>
		<?php if ($match['location_id']): ?>
		<option selected value="<?=$match['location_id']?>"><?=$match['location']?></option>
		<?php endif ?>
		<?php foreach ($locations as $location): ?>
		<?php if ($match['location_id'] == $location['id']) {continue;} ?>
		<option value="<?=$location['id']?>"><?=$location['name']?> | <?=$location['city']?></option>
		<?php endforeach ?>
	</select>
	</label>


	<?php
	if ($match['players'] ) {
		$match['players'] = explode(',', $match['players']);
	} else {$match['players'] = [];}
	?>

	<fieldset class="box mb">
	<label>aktive Spieler:</label><br/>

	<ul class="player-list">
	<?php foreach ($players as $player): ?>
	<li>
	<label>
		<?php if (in_array($player['id'], $match['players'])): ?>
		<input type="checkbox" name="players[]" checked value="<?=$player['id']?>">
		<?php else: ?>
		<input type="checkbox" name="players[]" value="<?=$player['id']?>">
		<?php endif; ?>
		<?=$player['lastname']?>, <?=$player['firstname']?>  (<?=$player['position']?>)
	</label>
	</li>
	<?php endforeach; ?>
	</ul>

	</fieldset>

<style>
.player-list {list-style-type: none; display:flex; gap:1em; max-width:900px; background-color: #f0f0f0; padding:1em;}
.player-list li {margin:0; padding:0; }
.player-list li label {cursor:pointer; padding:1em; display:inline-block; background-color:white;}
</style>


	<button type="submit">Speichern</button>
	&ensp;
	<a class="button light" href="/cms/matches">abbrechen und zurück</a>	

</form>
