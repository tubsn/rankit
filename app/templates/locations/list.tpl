<main>

<a class="button fright" href="/cms/locations/create">Neues Stadion anlegen</a>

<h1><?=$page['title']?></h1>


<table class="fancy wide">
<tr>
	<th>ID</th>
	<th>Stadienname</th>
	<th>Ort</th>
	<th>Sitze</th>
	<th style="text-align: right;">Löschen</th>
</tr>
<?php foreach ($locations as $location): ?>
	<tr>
		<td><?=$location['id']?></td>
		<td><a href="/cms/locations/<?=$location['id']?>"><?=$location['name']?></a> </td>
		<td><?=$location['city']?></a></td>
		<td><?=gnum($location['seats'])?></a></td>
		<td style="text-align: right;">
			<a id="del-location-<?=$location['id']?>" class="noline pointer"><img class="icon-delete" src="/styles/flundr/img/icon-delete-black.svg"></a>
			<fl-dialog selector="#del-location-<?=$location['id']?>" href="/cms/locations/<?=$location['id']?>/delete">
				<h1><?=$location['name']?> - löschen?</h1>
				<p>Möchten Sie die Location wirklich löschen?</p>
			</fl-dialog>
		</td>
	</tr>
<?php endforeach ?>
</table>


</main>