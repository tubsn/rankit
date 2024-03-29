class RankItApp {

	constructor(container, leagueID) {
		this.matchID = null;
		this.leagueID = leagueID || null;
		this.apiPath = 'https://rankit.lr-digital.de';
		this.container = container;
		this.location = 'home';
		this.scrollContainer = null;
		this.latestMatchesContainer = null
		this.header = null;
		this.main = null;
		this.footer = null;
		this.matchdata = [];
		this.matches = [];
		this.playerdata = [];
		this.dateParser = new FlundrDateParser();
		this.prefix = 'ri-';
		this.castVotes = [];
		this.voteCookie = null;
		this.voteCookieName = 'rankit';
		this.voteCookieDuration = 7;
		this.userHash = null;

		this.init();
	}

	async init() {

		this.prepareContainer();
		this.checkCookie();

		await this.loadMatches();
		this.fillContainer();

		this.initStateNavigation();

	}


	initStateNavigation() {

		window.addEventListener('popstate', (event) => {
			let target = event.state;
			this.navigateTo(target);
		});

		this.checkForDeeplink();

	}

	checkForDeeplink() {
		return this.navigateTo(this.splittHash(location.hash));
	}

	history(action, id) {
		let url = '#' + this.prefix + action + '=' + id;
		if (action == 'home') {url = window.location.href.split('#')[0];}
		history.pushState({action: action, id: id}, null, url);
	}


	async navigateTo(target) {

		if (!target || target.action == 'home') {
			await this.loadMatchData(this.matchID);
			this.refreshMain();
			return true;
		}
		
		if (target.action == 'player') {
			this.playerStatsTPL(target.id);	
			return true;
		}

		if (target.action == 'match') {
			this.loadMatchData(target.id).then(() => { this.refreshMain() })
			return true;
		}

		return false

	}



	fillContainer() {

		this.header = this.createHeader();
		this.main = this.createMain();
		this.footer = this.createFooter();

		this.container.appendChild(this.header);
		this.container.appendChild(this.main);
		this.container.appendChild(this.footer);

	}

	prepareContainer() {
		
		this.container.classList.add(this.prefix + 'app');

		// If the Element is embeded into an articleDetail Element It should be wider
		if (this.container.closest('.articleDetail')) {
			this.container.classList.add(this.prefix + 'wider');
		}

		if (this.matchID) {this.container.id = this.prefix + 'match-' + this.matchID;}
	}

	refreshMain(animate = true) {

		let scrollPosition = 0;
		if (this.scrollContainer) {scrollPosition = this.scrollContainer.scrollTop;}

		this.main.innerHTML = '';
		this.main.appendChild(this.matchDetail(animate));

		if (this.scrollContainer) {this.scrollContainer.scrollTop = scrollPosition;}
		this.highlightActiveMatch();

		this.location = 'matchdetail';

	}


	highlightActiveMatch() {
		this.latestMatchesContainer.childNodes.forEach((child) => { 
			child.classList.remove(this.prefix + 'match-active')
			if (child.dataset.id == this.matchID) {
				child.classList.add(this.prefix + 'match-active');				
			}
		});
	}


	latestMatches(amount = 4) {

		let el = document.createElement('ul');
		el.classList.add(this.prefix + 'latest-matches-container');

		if (!Array.isArray(this.matches)) {el.innerHTML = 'Zur Zeit keine Spiele'; return el;}
		this.matches.slice(0, amount).forEach((match) => {

			let entryElement = document.createElement('li');
			entryElement.classList.add(this.prefix + 'latest-matches-entry');
			if (this.matchID == match.id) {entryElement.classList.add(this.prefix + 'match-active');}

			entryElement.dataset.id = match.id;
			entryElement.innerHTML = `
			<span class="${this.prefix}match-date">${this.gsd(match.date)}</span>
			<span class="${this.prefix}match-teams" title="${match.home_team} vs. ${match.away_team}">${match.home_team_short || match.home_team} vs. ${match.away_team_short || match.away_team}</span>
			`;

			entryElement.addEventListener('click', () => {

				this.history('match', entryElement.dataset.id);
				if (entryElement.dataset.id == this.matchID) {
					this.refreshMain(false);
					return;
				}
				this.loadMatchData(entryElement.dataset.id).then(() => {
					this.refreshMain();
				})

			})

			el.appendChild(entryElement);
		});

		this.latestMatchesContainer = el;

		return el;

	}


	matchList() {

		let ul = document.createElement('ul');
		ul.classList.add(this.prefix + 'match-list');

		ul.innerHTML = `<h1>Spiele der ${this.matches[0].league || 'Saison'}:</h1>`;

		this.matches.forEach((match) => {

			let li = document.createElement('li');
			li.classList.add(this.prefix + 'match-list-entry');
			li.dataset.id = match.id;

			li.innerHTML = `
				<h3>${match.home_team_short || match.home_team} <span class="${this.prefix}versus">vs.</span> ${match.away_team_short || match.away_team} ${match.home_goals || '-'}:${match.away_goals || '-'}</h3>
				<p><span class="${this.prefix}kicker">${match.location || 'Spielort offen'}</span> 
				<span class="${this.prefix}bar">|</span> 
				${this.gd(match.date)} ${this.time(match.date)} Uhr
				<span class="${this.prefix}bar">|</span> ${match.city || ''}</p>
			`;

			li.addEventListener('click', () => {
				this.history('match', match.id);
				if (li.dataset.id == this.matchID) {this.refreshMain();	return;}
				this.loadMatchData(li.dataset.id).then(() => { this.refreshMain() })
			})

			ul.appendChild(li);

		});

		return ul

	}

	matchDetail(animate = true) {

		let info = '';
		let match = this.matchdata;
		let el = document.createElement('article');
		el.classList.add(this.prefix + 'match-detail');

		if (animate) {
			el.classList.add(this.prefix + 'animation-slide-bottom');
		}

		if (match.info != null && match.info != '') {
			info = `<p class="${this.prefix}match-info">${match.info}</p>`;
		}

		el.innerHTML = `
		<div class="${this.prefix}match-header">
			<h1>${match.home_team_short || match.home_team} <span class="${this.prefix}versus">vs.</span> ${match.away_team_short || match.away_team} ${match.home_goals || '-'}:${match.away_goals || '-'}</h1>
			<p>${match.location || 'Spielort offen'} <span class="${this.prefix}bar">|</span> ${this.gd(match.date)} ${this.time(match.date)} Uhr</p>
			${info}
		</div>`;

		el.prepend(this.sortButtonTPL());
		el.appendChild(this.playerList());

		this.scrollContainer = el;
		return el;

	}

	sortButtonTPL() {

		let sortBtn = document.createElement('div');
		sortBtn.classList.add(this.prefix + 'sort-btn');
		sortBtn.innerHTML = `<img src="${this.apiPath}/assets/sort.svg">`;

		let sortNameASC = document.createElement('div');
		sortNameASC.classList.add(this.prefix + 'sort-menu-entry');
		sortNameASC.innerText = '⇡ Nachname (a-z)';

		let sortNameDESC = document.createElement('div');
		sortNameDESC.classList.add(this.prefix + 'sort-menu-entry');
		sortNameDESC.innerText = '⇣ Nachname (z-a)';

		let sortVoteASC = document.createElement('div');
		sortVoteASC.classList.add(this.prefix + 'sort-menu-entry');
		sortVoteASC.innerText = '⇡ Wertung (1-6)';

		let sortVoteDESC = document.createElement('div');
		sortVoteDESC.classList.add(this.prefix + 'sort-menu-entry');
		sortVoteDESC.innerText = '⇣ Wertung (6-1)';

		let sortAgeASC = document.createElement('div');
		sortAgeASC.classList.add(this.prefix + 'sort-menu-entry');
		sortAgeASC.innerText = '⇡ Alter (0-99)';

		let sortAgeDESC = document.createElement('div');
		sortAgeDESC.classList.add(this.prefix + 'sort-menu-entry');
		sortAgeDESC.innerText = '⇣ Alter (99-0)';

		let sortNumberASC = document.createElement('div');
		sortNumberASC.classList.add(this.prefix + 'sort-menu-entry');
		sortNumberASC.innerText = '⇡ Spielernummer (0-99)';

		let sortNumberDESC = document.createElement('div');
		sortNumberDESC.classList.add(this.prefix + 'sort-menu-entry');
		sortNumberDESC.innerText = '⇣ Spielernummer (99-0)';

		sortNameASC.addEventListener('click', (e) => {
			this.matchdata.players.sort((a,b) => (a.lastname > b.lastname ? 1 : -1)); this.refreshMain(false);
		})

		sortNameDESC.addEventListener('click', (e) => {
			this.matchdata.players.sort((a,b) => (a.lastname < b.lastname ? 1 : -1)); this.refreshMain(false);
		})

		sortVoteASC.addEventListener('click', (e) => {
			this.matchdata.players.sort((a,b) => (a.score > b.score ? 1 : -1)); this.refreshMain(false);
		})

		sortVoteDESC.addEventListener('click', (e) => {
			this.matchdata.players.sort((a,b) => (a.score < b.score ? 1 : -1)); this.refreshMain(false);
		})

		sortAgeASC.addEventListener('click', (e) => {
			this.matchdata.players.sort((a,b) => (a.age > b.age ? 1 : -1)); this.refreshMain(false);
		})

		sortAgeDESC.addEventListener('click', (e) => {
			this.matchdata.players.sort((a,b) => (a.age < b.age ? 1 : -1)); this.refreshMain(false);
		})

		sortNumberASC.addEventListener('click', (e) => {
			this.matchdata.players.sort((a,b) => (parseInt(a.number) > parseInt(b.number) ? 1 : -1)); this.refreshMain(false);
		})

		sortNumberDESC.addEventListener('click', (e) => {
			this.matchdata.players.sort((a,b) => (parseInt(a.number) < parseInt(b.number) ? 1 : -1)); this.refreshMain(false);
		})

		sortBtn.appendChild(sortNameASC);
		sortBtn.appendChild(sortNameDESC);
		sortBtn.appendChild(sortVoteASC);
		sortBtn.appendChild(sortVoteDESC);
		sortBtn.appendChild(sortNumberASC);
		sortBtn.appendChild(sortNumberDESC);
		//sortBtn.appendChild(sortAgeASC);
		//sortBtn.appendChild(sortAgeDESC);


		return sortBtn;

	}


	playerList() {

		let players = this.matchdata.players;
		let el = document.createElement('div');
		el.classList.add(this.prefix + 'player-list');

		if (players.length == 0) {
			el.innerHTML = `<p class="${this.prefix}player-list-entry" style="text-align:center; padding:1em">Die Spielerbewertung wird nach Spielende aktiviert.</p>`;
			return el;
		}

		players.forEach((player) => {
			let entryElement = document.createElement('div');
			entryElement.classList.add(this.prefix + 'player-list-entry');
			entryElement.dataset.id = player.id;
			entryElement.appendChild(this.playerTPL(player));
			el.appendChild(entryElement);
		});

		return el;

	}

	playerTPL(player, voting) {

		let number;
		if (player.number == 0) { number = '';}
		else {number = `#${player.number}`}

		if (!player.thumbnail) {player.thumbnail = this.apiPath + '/assets/default.svg';}

		let el = document.createElement('div');
		el.classList.add(this.prefix + 'player-box');
		el.innerHTML = `

		<figure class="${this.prefix}player-image"><img class="${this.prefix}player-image-element" src="${player.thumbnail}"></figure>
		<div class="${this.prefix}player-info">
			<div class="${this.prefix}player-name">${player.firstname} ${player.lastname}&nbsp;<small class="${this.prefix}player-number">${number}</small></div>
			<div class="${this.prefix}player-stats">Position: <span class="${this.prefix}player-position">${player.position || 'keine'}</span> Alter:&nbsp;${player.age}</div>
			<div class="${this.prefix}player-verein">Verein: ${player.team}</div>
		</div>

		<div class="${this.prefix}player-score">
			<div class="${this.prefix}player-score-number ${this.scoreClass(player.score)}">${player.score || '-'}</div>
			<div>Lesernote</div>
			<div class="${this.prefix}player-score-votes">Stimmen: ${player.votes || '-'}</div>
		</div>

		<div class="${this.prefix}player-score ${this.prefix}player-score-editor">
			<div class="${this.prefix}player-score-number ${this.scoreClass(player.score_internal)}">${player.score_internal || '-'}</div>
			<div>Redaktion</div>
		</div>

		`;

		el.addEventListener('click', (e) => {
			if (e.target.classList.contains(`${this.prefix}player-name`) || 
				e.target.classList.contains(`${this.prefix}player-stats`) || 
				e.target.classList.contains(`${this.prefix}player-verein`) || 
				e.target.classList.contains(`${this.prefix}player-position`) || 
				e.target.classList.contains(`${this.prefix}player-image-element`)) {
				this.history('player', player.id);
				this.playerStatsTPL(player.id);
			}
		})

		el.appendChild(this.voteTPL(player.id));
		return el;

	}


	async playerStatsTPL(id) {

		await this.loadPlayerData(id)
		let player = this.playerdata;
		if (!player) {return;}

		let number;
		if (player.number == 0) { number = '';}
		else {number = `#${player.number}`}

		if (!player.thumbnail) {player.thumbnail = this.apiPath + '/assets/default.svg';}

		let playerContainer = document.createElement('div');
		playerContainer.classList.add(this.prefix + 'player-detail');

		let backButton = document.createElement('div');
		backButton.classList.add(this.prefix + 'btn');
		backButton.classList.add(this.prefix + 'player-back-btn-top');
		backButton.innerText = '⇠ zur Übersicht';

		backButton.addEventListener('click', (e) => {
			this.history('home');
			this.main.innerHTML = '';

			if (this.matchdata.length === 0) { // This happens if you enter the wigdet in Playerdetail
				this.loadMatchData(this.matchID).then(() => {
					this.main.appendChild(this.matchDetail());
				})
				return;
			}

			this.main.appendChild(this.matchDetail());
		})

		if (player.info) {player.info = `<div class="${this.prefix}player-note">${player.info}</div>`;}

		let tpl = `<h3>Spieler-Profil und Entwicklung</h3>
		<div class="${this.prefix}player-box">
			<figure class="${this.prefix}player-image"><img src="${player.thumbnail}"></figure>
			<div class="${this.prefix}player-info">
				<div class="${this.prefix}player-name">${player.firstname} ${player.lastname}&nbsp;<small class="${this.prefix}player-number">${number}</small></div>
				<div class="${this.prefix}player-stats">Position: <span class="${this.prefix}player-position">${player.position || 'keine'}</span> Alter: ${player.age}</div>
				<div class="${this.prefix}player-verein">Verein: ${player.team}</div>
			</div>


			<div class="${this.prefix}player-score">
				<div class="${this.prefix}player-score-number ${this.scoreClass(player.score)}">${player.score || '-'}</div>
				<div>Ø-Lesernote</div>
				<div class="${this.prefix}player-score-votes">Stimmen: ${player.votes || '-'}</div>
			</div>

			<div class="${this.prefix}player-score ${this.prefix}player-score-editor">
				<div class="${this.prefix}player-score-number ${this.scoreClass(player.score_internal)}">${player.score_internal || '-'}</div>
				<div>Ø-Redaktion</div>
			</div>
		</div>

		${player.info || ''}

		`;

		playerContainer.innerHTML = tpl;
		playerContainer.prepend(backButton);

		// Chart Container has to be placed in DOM before rendering
		let chartContainer = document.createElement('div');
		chartContainer.classList.add(this.prefix + 'player-chart');
		playerContainer.appendChild(chartContainer);

		this.main.innerHTML = null;
		this.main.appendChild(playerContainer);

		//chart Rendering
		this.initPlayerDevelopmentChart(chartContainer);


	}

	scoreClassWithBackground(score) {return this.scoreClass(score,true);}

	scoreClass(score, bg = false) {

		let color = `${this.prefix}score-`;
		if (bg) {color += 'bg-';}

		if (score > 0 && score < 1.5) {color += 'best';}
		else if (score >= 1.5 && score <= 2.5) {color += 'good';}
		else if (score > 2.5 && score <= 3.5) {color += 'neutral';}
		else if (score > 3.5 && score < 4.5) {color += 'bad';}
		else if (score >= 4.5 && score <= 5.5) {color += 'worse';}
		else if (score >= 5.5 && score <= 10) {color += 'worst';}
		else {color = '';}

		return color;

	}

	voteNotAvailable() {

		let matchDate = new Date(this.matchdata.date);
		let now = new Date();

		if (matchDate > now) {return true;}
		return false;

	}

	voteTimePassed() {

		let matchDate = new Date(this.matchdata.date);
		let date = new Date();
		date.setDate(date.getDate() - 3);

		if (matchDate < date) {return true;}
		return false;

	}

	voteAlreadyCast(playerID) {
		if (this.castVotes[this.matchID] && this.castVotes[this.matchID].includes(playerID)) {return true;}
		return false;
	}

	voteTPL(playerID) {

		let voteContainer = document.createElement('div');
		voteContainer.classList.add(this.prefix + 'vote-container');

		if (!navigator.cookieEnabled) {
			voteContainer.innerHTML = `<div class="${this.prefix}vote-denied">Abstimmung mit deaktivierten Cookies nicht möglich</div>`;
			return voteContainer;	
		};

		switch (this.matchdata.status) {
			case 'pending':
				voteContainer.innerHTML = `<div class="${this.prefix}vote-denied">Wertung noch nicht möglich</div>`;
				return voteContainer;
				break;

			case 'running':
				voteContainer.innerHTML = `<div class="${this.prefix}vote-denied">Spiel läuft noch</div>`;
				return voteContainer;
				break;

			case 'passed':
				voteContainer.innerHTML = `<div class="${this.prefix}vote-denied">Zeitraum abgelaufen</div>`;
				return voteContainer;
				break;
		}

		if (this.voteAlreadyCast(playerID)) {
			voteContainer.innerHTML = `<div class="${this.prefix}vote-is-cast">Bewertung gespeichert</div>`;
			return voteContainer;
		}

		voteContainer.title = 'Schulnoten: 1 super - 6 schlecht'
		let voteOptions = [1,2,3,4,5,6];

		voteOptions.forEach((value) => {
			let button = document.createElement('button');
			button.classList.add(this.prefix + 'vote-button');
			button.classList.add(this.scoreClassWithBackground(value));
			button.innerText = value;
			button.dataset.playerId = playerID;
			button.dataset.value = value;

			button.addEventListener('click', () => {
				this.castVote(playerID, value, voteContainer);
			})

			voteContainer.appendChild(button);
		});

		return voteContainer;

	}

	async castVote(playerID, value, voteContainer) {

		voteContainer.innerHTML = '';
		let loader = new FlundrLoadIndicator(voteContainer,'white',1);

		let voteFailed = false;
		let requestURL = this.apiPath + '/vote/' + playerID;

		let postData = new FormData();
		postData.append('match_id', this.matchID);
		postData.append('hash', this.userHash);
		postData.append('score', value);

		let voteHash;
		await axios.post(requestURL,postData)
		.then(function (response) {
			voteHash = response.data.voteHash || null;
		}).catch(err => {
			console.log('RankIT - Vote already Cast: ' + err.message);
			voteContainer.innerHTML = `<div class="${this.prefix}vote-error">Sie haben bereits abgestimmt</div>`;
			voteFailed = true;
		})

		if (voteFailed) {return false;}

		if (!this.userHash && voteHash) {
			this.voteCookie.content = voteHash;
			this.userHash = voteHash;
		}

		if (!this.castVotes[this.matchID]) {this.castVotes[this.matchID] = [];}
		this.castVotes[this.matchID].push(playerID);

		this.loadMatchData(this.matchID).then(() => {this.refreshMain(false)})

	}

	checkCookie() {

		if (this.voteCookie == null) {
			this.voteCookie = new FlundrCookieManager(this.voteCookieName, this.voteCookieDuration);
		}

		if (this.voteCookie.exists) {
			this.userHash = this.voteCookie.content;
		}

	}


	track(eventname = 'load') {

		// May be obsolete :/
		let data = new FormData();
		let artID = parseInt(location.pathname.substr(-13, 8));

		data.append('event', eventname);
		data.append('domain', location.hostname || null);
		data.append('url', location.href || null);

		if (artID) {data.append('article_id', artID);}
		if (this.playerdata.id) {data.append('player_id', this.playerdata.id);}
		if (this.matchID) {data.append('match_id', this.matchID);}

		return data

	}

	async loadMatches() {

		let matches = [];
		let leagueSuffix = '';
		if (this.leagueID) {leagueSuffix = '/' + this.leagueID;}

		await axios.get(this.apiPath + '/matches' + leagueSuffix)
		.then(function (response) {
			matches = response.data;
		})
		.catch(err => {console.error('RankIT - Error: Matches konnten nicht geladen werden (' + err.message +')');})

		this.matches = matches;

	}
	async loadMatchData(id) {

		let matchdata;
		let failed = false;

		let leagueSuffix = '';
		if (this.leagueID) {leagueSuffix = '/' + this.leagueID;}

		let requestURL = this.apiPath + '/match/latest' + leagueSuffix;
		if (id) {requestURL = this.apiPath + '/match/' + id;}

		await axios.get(requestURL)
		.then(function (response) {matchdata = response.data;})
		.catch(err => {
			console.log('RankIT - Match not Found: ' + err.message);
			this.main.innerHTML = `404 Fehler Seite nicht gefunden`;
			failed = true;
		})

		if (failed) {return}

		this.matchID = matchdata.id;
		this.matchdata = matchdata;

	}
	async loadPlayerData(id) {

		let playerdata;

		let requestURL = this.apiPath + '/player';
		if (id) {requestURL = this.apiPath + '/player/' + id;}

		await axios.get(requestURL)
		.then(function (response) {playerdata = response.data;})
		.catch(err => {
			console.log('RankIT - Player not Found: ' + err.message);
			this.main.innerHTML = `404 Fehler Seite nicht gefunden`;
			return false;
		})


		this.playerdata = playerdata;

	}

	createHeader() {
		let header = document.createElement('header');
		header.classList.add(this.prefix + 'header')

		let mainMenu = document.createElement('nav');

		mainMenu.classList.add(this.prefix + 'header-menu');
		mainMenu.title = 'Zur Spielübersicht';
		mainMenu.innerHTML = `<img src="${this.apiPath}/assets/menu.svg">`;
		mainMenu.addEventListener('click', () => {

			if (this.location == 'matchlist') {
				this.refreshMain();
				return;
			}
			this.location = 'matchlist';
			this.main.innerHTML = '';
			this.main.appendChild(this.matchList());
			return;

		})

		let headline = document.createElement('h1');
		headline.innerHTML = `<img src="${this.apiPath}/frontend/rankit_logo.svg">
		<span>Rankit</span>`;

		header.appendChild(mainMenu);
		header.appendChild(headline);
		header.appendChild(this.latestMatches());

		return header;
	}
	createMain() {
		let el = document.createElement('main');
		el.classList.add(this.prefix + 'main')
		return el;
	}
	createFooter() {
		let el = document.createElement('footer');
		el.classList.add(this.prefix + 'footer')

		el.innerHTML = `<footer class="${this.prefix}footer">powered by flundr and lr.de</footer>`

		el.addEventListener('click', () => {
			let main = document.querySelector(`.${this.prefix}match-detail`);
			main.style.maxHeight = 'inherit';
		})

		return el;
	}

	gd(date) {return this.dateParser.gdate(date);}
	gsd(date) {return this.dateParser.gsdate(date);}
	ed(date) {return this.dateParser.edate(date);}
	time(date) {return this.dateParser.time(date);}

	splittHash(hash) {

		if (hash == '' || !hash) {return null;}
		if (!hash.includes(this.prefix)) {return null;}

		hash = hash.substr(4);
		hash = hash.split('=');

		let nav = {};
		nav.action = hash[0];
		nav.id = hash[1];

		return nav;

	}

	async initPlayerDevelopmentChart(chartContainer) {

		let leagueSuffix = '';
		if (this.leagueID) {leagueSuffix = '/' + this.leagueID;}

		let requestURL = this.apiPath + '/player/' + this.playerdata.id + '/development' + leagueSuffix;
		let chart;

		await axios.get(requestURL)
		.then(function (response) {chart = response.data;})

		// No need to show Chart with less then 2 Matches
		if (chart.enemy.length && chart.enemy.length < 2) {return;}

		let chartMetrics = [
			{name: 'Leser', color: '#9bb6db',
			data: chart.fanscore },

			{name: 'Redaktion', color: '#f58fae',
			data: chart.editorscore },
		];

		let chartDimensions = chart.enemy;
		let chartOptions = {height:250, type: 'line'};

		return new FlundrToAphexChartInterface(chartContainer, chartMetrics, chartDimensions, chartOptions);

	}

}


class FlundrToAphexChartInterface {

	constructor(container, metrics, dimensions, userOptions = null) {

		this.container = container
		this.metrics = metrics;
		this.dimensions = dimensions;
		this.options = this.defaultOptions();
		this.userOptions = userOptions;
		this.init();

	}

	init() {

		this.applyUserOptions();

		let chart = new ApexCharts(this.container, this.options);
		chart.render();

		return this.container;
	}

	applyUserOptions() {

		if (!this.userOptions) {return;}
		let user = this.userOptions;

		if (user.height) {this.options.chart.height = user.height};
		if (user.type) {this.options.chart.type = user.type};

		if (user.type == 'line' || user.type == 'area') {this.options.dataLabels.style.colors = ['#1a1d26']};
		if (user.type == 'bar') {
			this.options.dataLabels.style.colors = ['#ffffff']
			this.options.stroke.width = 0
		};

		if (user.labelColor) {this.options.dataLabels.style.colors = [user.labelColor]}

	}

	defaultOptions() {

		let options = {

			series: this.metrics,

			title: {
				text: 'letzte Saisonspiele:',
				align: 'left',
				margin: 0,
				offsetX: -10,
				offsetY: 3,
				floating: true,
				style: {
					fontSize:  '18px',
					fontWeight:  'bold',
					color:  '#b0c5d9'
				},
			},

			chart: {
				height: 350,
				type: 'bar',
				toolbar: {show:false},
				zoom: {enabled:false},
				animations: {enabled: true},
				sparkline: {enabled: false},
				stacked: false,
			},

			stroke: {
				width: 3,
				curve: 'straight',
				//dashArray: [4,4]
			},

			//forecastDataPoints: {count: 2},

			markers: {
				size: 6,
				colors: undefined,
				strokeColors: '#fff',
				strokeWidth: 2,
				strokeOpacity: 0.9,
				fillOpacity: 0.1,
				shape: "circle",
				showNullDataPoints: true,
				hover: {sizeOffset: 3}
			},

			plotOptions: {
				bar: {dataLabels: {position: 'center',}}
			},

			tooltip: {
				enabled: true,
				theme: 'dark',
				shared: true,
				intersect: false,
				x: {show: true},
			},

			legend: {
				show:true,
				position: 'top',
				floating: true,
				horizontalAlign: 'right',
				labels: {colors: ['#ffffff']},
				onItemHover: {
					highlightDataSeries: false
				},
			},

			dataLabels: {
				enabled: false,
				style: {colors: '#b0c5d9'},
				background: {
					foreColor: '#b0c5d9',
					padding: 8,
					borderRadius: 2,
					borderWidth: 0,
					borderColor: '#fff',
					opacity: 0.9,
				},
				formatter: function(value) {
					if (value > 0) {
						value = Math.abs(3.5 - value)
						return Math.round(value*10) / 10;
					}
					value = Math.abs(value - 3.5)
					return Math.round(value*10) / 10;
				}
			},

			xaxis: {
				categories: this.dimensions,
				tooltip: {enabled: false},
				crosshairs: {show: false},
				axisBorder: {show: false},
				axisTicks: {show: false},
				labels: {
					show: true,
					style: {
						colors: '#b0c5d9',
						fontSize: '13px',
					},
					rotate: -90,
					//rotateAlways: true,
				},
			},

			yaxis: {
				//tickAmount: 4,
				show: true,
				labels: {
					show: true,
					style: {
						colors: '#b0c5d9',
						fontSize: '13px',
						cssClass: 'ri-yaxis-title',
					},

					formatter: function(value) {
						if (value > 0) {
							value = Math.abs(3.5 - value)
							return Math.round(value*10) / 10;
						}
						value = Math.abs(value - 3.5)
						return Math.round(value*10) / 10;
					},
				},
			},

			grid: {
				show: true,
				borderColor: '#3f506a',
				strokeDashArray: 2,
				position: 'back',
				xaxis: {lines: {show: false}},
				yaxis: {lines: {show: false}},

				row: {
					//colors: ['#b0c5d9','transparent'],
					opacity: 0.1
				},
				column: {
					//colors: ['#b0c5d9', 'transparent'],
					opacity: 0.1
				},
			}

		}

		return options;

	}

}

class FlundrDateParser {

	format(datestring, format) {
		let date = new Date(datestring);
		let day = date.getDate();
		let month = date.getMonth()+1;
		let year = date.getFullYear();

		day = day.toString().padStart(2,0);
		month = month.toString().padStart(2,0);

		switch (format) {
			case 'de':
				return `${day}.${month}.${year}`; break;
			case 'de-no-year':
				return `${day}.${month}.`; break;
			default:
				return `${year}-${month}-${day}`;
		}

	}

	time(datestring) {

		let date = new Date(datestring);
		let minutes = date.getMinutes().toString().padEnd(2,0);
		let hours = date.getHours().toString().padStart(2,0);

		return `${hours}:${minutes}`;

	}

	gdate(datestring) {
		return this.format(datestring, 'de');
	}

	gsdate(datestring) {
		return this.format(datestring, 'de-no-year');
	}

	edate(datestring) {
		return this.format(datestring);
	}

}

class FlundrLoadIndicator {

	constructor(holder, color=null, prepend=true) {
		this.holder = holder;
		this.color = color;
		this.loader = this.createLoaderElement();
		this.holder.appendChild(this.loader);
	}

	createLoaderElement(){
		const indicatorDiv = document.createElement('div');
		indicatorDiv.className = 'loadIndicator';
		indicatorDiv.classList.add(this.color);
		indicatorDiv.innerHTML = '<div></div><div></div><div></div>';
		return indicatorDiv;
	}

	hide() {
		this.loader.remove();
	}

}


class FlundrCookieManager {

	// Usage: create new Instance e.g. myCookie = new FlundrCookieManager('cookiename', '30');
	// First parameter is the Cookies name, second is the Expiretime in Days
	// get Cookie data with: myCookie.content;
	// set Cookie data with: myCookie.content = 'Value';

	constructor(cookieName = 'fl-default-cookie', expireDays = 365) {
		this.cookieName = cookieName;
		this.expireDays = expireDays;
	}

	get content() {return this.get_content();}
	set content(data) {this.set_content(data);}

	get expire() {return this.expireDays;}
	set expire(days) {this.expireDays = days;}

	get name() {return this.expireDays;}
	set name(cookieName) {this.cookieName = cookieName;}

	get isset() {return this.is_active();}
	get exists() {return this.is_active();}

	get_content() {
		let content = document.cookie.split('; ');

		content = content.find(row => row.startsWith(this.cookieName+'='));

		if (!content) {return;}
		content = content.split('=')[1];

		if (content.startsWith('{')) {content = JSON.parse(content);}
		return content;
	}

	set_content(data) {

		if (typeof(data) === 'object') {
			data = JSON.stringify(data);
		}

		let expire = '';
		if (this.expireDays) {
			expire = this.expire_from_now(this.expireDays);
			expire = new Date(expire).toUTCString();
			expire = ` expires=${expire};`;
		}

		let cookieString = `${this.cookieName}=${data}; SameSite=Lax; ${expire} ${this.secure()};path=/`;
		document.cookie = cookieString;
	}

	is_active() {
		if (document.cookie.split(';').some((item) => item.trim().startsWith(this.cookieName + '='))) {
			return true;
		}
		return false;
	}

	secure() {
		if (location.protocol === 'https:') { return 'Secure';}
		return '';
	}

	check_value(cookieName, cookieValue) {
		return document.cookie.split(';').some((item) => item.includes(cookieName+'='+cookieValue));
	}

	min_to_ms(minutes) {return minutes*60*1000;}
	days_to_ms(days) {return days*24*60*60*1000;}

	expire_from_now(amountOfTime, timeFrame = 'days') {
		let date = new Date();
		let expireTime = this.days_to_ms(amountOfTime);

	    date.setTime(date.getTime() + expireTime);
		return date.toLocaleString("en-US", {timeZone: "Europe/Berlin"})
		//return date.toUTCString();
	}

	delete() {
		let cookieString = `${this.cookieName}=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${this.secure()}`;
		document.cookie = cookieString;
	}

}

class RankItLoader {

	constructor(leagueID) {
		this.app;
		this.leagueID = leagueID;
		this.container = this.createContainerNode();

		try {this.lazyLoad();}
		catch (error) {console.error(error);}

	}

	lazyLoad() {

		let observer = new IntersectionObserver( (elements) => {
			let visible = elements[0].isIntersecting;
			if (visible) {
				this.init()
				observer.disconnect();
			}

		}, { rootMargin: "500px 0px 500px 0px" });
		observer.observe(this.container);

	}

	init() {

		this.loadCSS('https://rankit.lr-digital.de/styles/css/rankit.css');
		this.requirePackages()
			.then(() => {
				this.app = new RankItApp(this.container, this.leagueID);
			})
			.catch(err => {
				console.error('RankIT - Error: ' + err.message);
			})
	}

	async requirePackages() {

		let packages = [];
		
		/*
		if (window.Alpine === undefined) {
			packages.push(this.loadScript('https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js'));
		}
		*/

		if (window.axios === undefined) {
			packages.push(this.loadScript('https://unpkg.com/axios/dist/axios.min.js'));
		}


		if (window.ApexCharts === undefined) {
			packages.push(this.loadScript('https://cdn.jsdelivr.net/npm/apexcharts'));
		}

		await Promise.all(packages)
	}

	createContainerNode() {

		const currentScript = document.currentScript;
		const container = document.createElement('div');
		currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
		return container;

	}

	loadCSS(src) {

		const el = document.createElement('link')
		const container = document.head || document.body

		el.type = 'text/css';
		el.rel = 'stylesheet';
		el.media = 'all';
		el.href = src;

		container.appendChild(el)

	}


	loadScript(src, async = true, type = 'text/javascript') {

		// By https://attacomsian.com/blog/javascript-load-script-async
		return new Promise((resolve, reject) => {

			try {

				const el = document.createElement('script')
				const container = document.head || document.body

				el.type = type
				el.async = async
				el.src = src

				el.addEventListener('load', () => { resolve({ status: true }) })
				el.addEventListener('error', () => {
					reject({ status: false, message: `Failed to load ${src}` })
				})

				container.appendChild(el)

			}

			catch (err) {reject(err)}

		})

	}


}
