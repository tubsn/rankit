<main>
<h1><?=$page['title']?></h1>

<form method="post" action="">
	
	<label>Name:
		<input type="text" value="<?=$location['name']?>" name="name">
	</label>

	<label>Stadt:
		<input type="text" value="<?=$location['city']?>" name="city" placeholder="z.B. Cottbus">
	</label>

	<label>Kapazität:
		<input type="number" value="<?=$location['seats']?>" name="seats">
	</label>

	<button type="submit">Speichern</button>
	&ensp;
	<a class="button light" href="/cms/locations">abbrechen und zurück</a>

</form>
</main>