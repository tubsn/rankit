<h1><?=$page['title']?></h1>

<form method="post" action="">
	
	<label>Name:
		<input type="text" name="name" placeholder="z.B. Sportplatz am Waldrand">
	</label>

	<label>Stadt:
		<input type="text" name="city" placeholder="z.B. Cottbus">
	</label>

	<label>Kapazität:
		<input type="number" name="seats">
	</label>

	<button type="submit">Anlegen</button>

</form>
