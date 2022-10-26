<h1><?=$page['title']?></h1>

<form method="post" action="">
	
	<label>Name:
		<input type="text" value="<?=$location['name']?>" name="name">
	</label>

	<label>Stadt:
		<input type="text" value="<?=$location['city']?>" name="city" placeholder="z.B. Cottbus">
	</label>

	<button type="submit">Speichern</button>

</form>
