<main>
<h1><?=$page['title']?></h1>

<form method="post" action="">
	<input type="hidden" name="highlight" value="0">

	<label>Name:
		<input type="text" value="<?=$team['name']?>" name="name">
	</label>

	<label>Kurzform:
		<input type="text" value="<?=$team['short']?>" name="short">
	</label>

	<fieldset>
		<label>
			<input type="checkbox" <?php if ($team['highlight']): ?>checked<?php endif ?> value="1" name="highlight"> Team in Auswahlboxen hervorheben?
		</label>
	</fieldset>

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

	<button type="submit">Speichern</button>

</form>
</main>