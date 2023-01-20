<main>

<a class="button fright" href="/cms/teams/create">Neues Team anlegen</a>

<h1><?=$page['title']?></h1>

<table class="fancy wide">
<tr>
	<th>ID</th>
	<th>Teamname</th>
	<th>Kurzform</th>
	<th>Hervorgehoben</th>
	<th style="text-align: right;">Löschen</th>
</tr>
<?php foreach ($teams as $team): ?>
	<tr>
		<td><?=$team['id']?></td>
		<td><a href="/cms/teams/<?=$team['id']?>"><?=$team['name']?></a></td>
		<td><?=$team['short']?></a></td>
		<td><?=$team['highlight'] ? 'Ja' : '-' ?></a></td>
		<td style="text-align: right;">
			<a id="del-team-<?=$team['id']?>" class="noline pointer"><img class="icon-delete" src="/styles/flundr/img/icon-delete-black.svg"></a>
			<fl-dialog selector="#del-team-<?=$team['id']?>" href="/cms/teams/<?=$team['id']?>/delete">
				<h1><?=$team['name']?> - löschen?</h1>
				<p>Möchten Sie das Team wirklich löschen?</p>
			</fl-dialog>
		</td>
	</tr>
<?php endforeach ?>
</table>

</main>