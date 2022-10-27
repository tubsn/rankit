<h1><?=$page['title']?></h1>

<form method="post" action="">
	
	<label>Vorname:
		<input type="text" name="firstname">
	</label>

	<label>Nachname:
		<input type="text" name="lastname">
	</label>

	<label>Trikotnummer:
		<input type="number" min="1" max="99" name="number">
	</label>

	<label>Geburtstag:
		<input type="date" name="birthday">
	</label>


	<label>Verein:
	<select name="team_id">
			<option value="">offen</option>
		<?php foreach ($teams as $team): ?>
			<option value="<?=$team['id']?>"><?=$team['name']?></option>
		<?php endforeach ?>
	</select>
	</label>

	<button type="submit">Anlegen</button>

</form>
