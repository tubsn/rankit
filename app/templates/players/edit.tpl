<main>
<h1><?=$page['title']?></h1>

<form method="post" action="">

	<label>Vorname:
		<input type="text" value="<?=$player['firstname']?>" name="firstname">
	</label>

	<label>Nachname:
		<input type="text" value="<?=$player['lastname']?>" name="lastname">
	</label>

	<label>Infotext (optional):
	<textarea name="info" placeholder=""><?=$player['info']?></textarea>
	</label>

	<label>Trikotnummer:
		<input type="number" value="<?=$player['number']?>" min="1" max="99" name="number">
	</label>

	<label>Position:
		<input type="text" value="<?=$player['position']?>" name="position">
	</label>

	<label>Geburtstag:
		<input type="date" value="<?=$player['birthday']?>" name="birthday">
	</label>

	<label>Thumbnail:
		<input type="text" value="<?=$player['thumbnail']?>" name="thumbnail">
	</label>

	<label>Verein:
	<select name="team_id">
			<option value="">offen</option>
		<?php if ($player['team_id']): ?>
		<option selected value="<?=$player['team_id']?>"><?=$player['team']?></option>
		<?php endif ?>
		<?php foreach ($teams as $team): ?>
			<?php if ($player['team_id'] == $team['id']) {continue;} ?>
			<option value="<?=$team['id']?>"><?=$team['name']?></option>
		<?php endforeach ?>
	</select>
	</label>

	<button type="submit">Speichern</button>

</form>
</main>