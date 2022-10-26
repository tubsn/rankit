<h1><?=$page['title']?></h1>

<form method="post" action="">

	<label>Name:
		<input type="text" value="<?=$team['name']?>" name="name">
	</label>

	<label>Stadion:
	<select name="location_id">
		<option value="0">offen</option>
		<?php if ($team['location_id']): ?>
		<option selected value="<?=$team['location_id']?>"><?=$team['location']?></option>
		<?php endif ?>
		<?php foreach ($locations as $location): ?>
		<?php if ($team['location_id'] == $location['id']) {continue;} ?>
		<option value="<?=$location['id']?>"><?=$location['name']?> | <?=$location['city']?></option>
		<?php endforeach ?>
	</select>
	</label>

	<label>Spieler Bewertbar?:
		<input type="checked" value="<?=$team['rankable']?>" name="rankable">
	</label>

	<button type="submit">Speichern</button>

</form>
