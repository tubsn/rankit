<main>
<h1><?=$page['title']?></h1>

<form method="post" action="">

	<label>Name:
		<input type="text" name="name">
	</label>

	<label>Kurzform:
		<input type="text" name="short">
	</label>

	<fieldset>
		<label>
			<input type="checkbox" value="1" name="highlight"> Team in Auswahlboxen hervorheben?
		</label>
	</fieldset>

	<label>Stadion:
	<select name="location_id">
			<option value="">offen</option>
		<?php foreach ($locations as $location): ?>
			<option value="<?=$location['id']?>"><?=$location['name']?> | <?=$location['city']?></option>
		<?php endforeach ?>
	</select>
	</label>

	<button type="submit">Anlegen</button>

</form>
</main>