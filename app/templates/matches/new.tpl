<h1><?=$page['title']?></h1>

<form method="post" action="">

	<fieldset style="display:flex; gap:2em;">
	<label>Datum:
		<input type="date" value="" name="date">
	</label>
	<label>Uhrzeit:
		<input type="time" value="" name="time">
	</label>
	</fieldset>

	<fieldset style="display:flex; gap:2em;">

	<label>Heimteam:
		<select name="home_team_id">
		<option value="0">offen</option>
		<?php foreach ($teams as $team): ?>
		<option value="<?=$team['id']?>"><?=$team['name']?></option>
		<?php endforeach; ?>
		</select>
	</label>

	<label>Auswärtsteam:
		<select name="away_team_id">
		<option value="0">offen</option>
		<?php foreach ($teams as $team): ?>
		<option value="<?=$team['id']?>"><?=$team['name']?></option>
		<?php endforeach; ?>
		</select>
	</label>

	</fieldset>


	<label>Stadion:
	<select name="location_id">
		<option value="0">offen</option>
		<?php foreach ($locations as $location): ?>
		<option value="<?=$location['id']?>"><?=$location['name']?> | <?=$location['city']?></option>
		<?php endforeach ?>
	</select>
	</label>


	<fieldset class="box mb">
	<label>aktive Spieler:</label><br/>

	<ul class="player-list">
	<?php foreach ($players as $player): ?>
	<li>
	<label>
		<input type="checkbox" name="players[]" value="<?=$player['id']?>">
		<?=$player['lastname']?>, <?=$player['firstname']?>  (<?=$player['position']?>)
	</label>
	</li>
	<?php endforeach; ?>
	</ul>

	</fieldset>

<style>
.player-list {list-style-type: none; display:flex; flex-wrap: wrap; gap:1em; background-color: #f0f0f0; padding:1em;}
.player-list li {margin:0; padding:0; }
.player-list li label {cursor:pointer; padding:1em; display:inline-block; background-color:white;}
</style>

	<label>Notizen zum Spiel
	<textarea name="info" placeholder="z.B. Spieler XY außer Wertung weil eingewechselt..."></textarea>
	</label>


	<button type="submit">Spiel anlegen</button>
	&ensp;
	<a class="button light" href="/cms/matches">abbrechen und zurück</a>

</form>
