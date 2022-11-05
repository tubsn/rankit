class RankItApp {

	constructor(container, matchID) {
		this.matchID = matchID || null;
		this.apiPath = 'http://app3.localhost';
		this.container = container;
		this.scrollContainer = null;
		this.header = null;
		this.main = null;
		this.footer = null;
		this.matchdata = [];
		this.matches = [];
		this.dateParser = new FlundrDateParser();
		this.prefix = 'ri-';

		this.init();
	}

	async init() {

		this.prepareContainer();

		await this.loadMatches();
		await this.loadMatchData(this.matchID);

		this.fillContainer();
		this.refreshMain();

	}

	fillContainer() {

		this.header = this.createHeader();
		this.main = this.createMain();
		this.footer = this.createFooter();

		this.header.appendChild(this.matchlist());

		this.container.appendChild(this.header);
		this.container.appendChild(this.main);
		this.container.appendChild(this.footer);

	}

	prepareContainer() {
		this.container.classList.add(this.prefix + 'app');
		if (this.matchID) {this.container.id = this.prefix + 'match-' + this.matchID;}
	}


	refreshMain() {

		let scrollPosition = 0;
		if (this.scrollContainer) {scrollPosition = this.scrollContainer.scrollTop;}

		this.main.innerHTML = '';
		this.main.appendChild(this.matchDetail());

		if (this.scrollContainer) {this.scrollContainer.scrollTop = scrollPosition;}

	}

	matchlist() {

		let el = document.createElement('ul');
		el.classList.add(this.prefix + 'match-list-container');

		this.matches.forEach((match) => {
			let entryElement = document.createElement('li');
			entryElement.classList.add(this.prefix + 'match-list-entry');
			entryElement.dataset.id = match.id;
			entryElement.innerHTML = `
			<span class="${this.prefix}match-date">${this.gsd(match.date)}</span>
			<span class="${this.prefix}match-teams">${match.home_team} vs. ${match.away_team}</span>
			`;

			entryElement.addEventListener('click', () => {
				if (entryElement.dataset.id == this.matchID) {return;}
				this.loadMatchData(entryElement.dataset.id).then(() => { this.refreshMain()	})
			})

			el.appendChild(entryElement);
		});

		return el;

	}

	matchDetail() {

		let match = this.matchdata;
		let el = document.createElement('article');
		el.classList.add(this.prefix + 'match-detail');

		el.innerHTML = `
		<div class="${this.prefix}match-header">
			<h1>${match.home_team} Vs. ${match.away_team}</h1>
			<p>${match.location || 'Spielort offen'} | ${this.gd(match.date)} ${this.time(match.date)} Uhr</p>
		</div>`;

		el.appendChild(this.playerList());

		this.scrollContainer = el;
		return el;

	}


	playerList() {

		let players = this.matchdata.players;
		let el = document.createElement('div');
		el.classList.add(this.prefix + 'player-list');

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

		let el = document.createElement('div');
		el.classList.add(this.prefix + 'player-box');
		el.innerHTML = `

		<figure class="${this.prefix}player-image"><img src="${player.thumbnail || '/frontend/default.png'}"></figure>
		<div class="${this.prefix}player-info">
			<div class="${this.prefix}player-name">${player.firstname} ${player.lastname} <small>(${player.number || '-'})</small></div>
			<div class="${this.prefix}player-stats">Position: <span class="${this.prefix}player-position">${player.position || 'keine'}</span> | Alter: 23</div>
			<div class="${this.prefix}player-verein">Verein: ${player.team}</div>
		</div>

		<div class="${this.prefix}player-score">
			<div class="${this.prefix}player-score-number">${player.score || '-'}</div>
			<div>Leserwertung</div>
			<div class="${this.prefix}player-score-votes">Stimmen: ${player.votes || 'keine'}</div>
		</div>

		<div class="${this.prefix}player-score ${this.prefix}player-score-editor">
			<div class="${this.prefix}player-score-number">${player.score || '-'}</div>
			<div>Redaktion</div>
		</div>

		`;

		el.appendChild(this.voteTPL(player.id));
		return el;

	}


	voteTPL(playerID) {

		let el = document.createElement('div');
		el.classList.add(this.prefix + 'vote-container');
		el.title = 'Schulnoten: 1 super - 6 schlecht'
		let voteOptions = [1,2,3,4,5,6];

		voteOptions.forEach((value) => {
			let button = document.createElement('button');
			button.classList.add(this.prefix + 'vote-button');
			button.innerText = value;
			button.dataset.playerId = playerID;
			button.dataset.value = value;

			button.addEventListener('click', () => {
				this.castVote(playerID, value);
			})

			el.appendChild(button);
		});

		return el;

	}


	async castVote(playerID, value) {

		let requestURL = this.apiPath + '/vote/' + playerID;

		let postData = new FormData();
		postData.append('match_id', this.matchID);
		postData.append('score', value);

		await axios.post(requestURL,postData)
		.then(function (response) {response.data; })

		this.loadMatchData(this.matchID).then(() => {
			this.refreshMain()
		 })

	}


	async loadMatches() {

		let matches;

		await axios.get(this.apiPath + '/matches/')
		.then(function (response) {matches = response.data;})
		this.matches = matches;

	}


	async loadMatchData(id) {

		let matchdata;

		let requestURL = this.apiPath + '/match';
		if (id) {requestURL = this.apiPath + '/match/' + id;}

		await axios.get(requestURL)
		.then(function (response) {matchdata = response.data;})

		this.matchID = matchdata.id;
		this.matchdata = matchdata;

	}

	createHeader() {
		let el = document.createElement('header');
		el.classList.add(this.prefix + 'header')

		el.innerHTML = `<h1>RankIT!</h1>`;
		return el;
	}
	createMain() {
		let el = document.createElement('main');
		el.classList.add(this.prefix + 'main')
		return el;
	}
	createFooter() {
		let el = document.createElement('footer');
		el.classList.add(this.prefix + 'footer')
		return el;
	}

	gd(date) {return this.dateParser.gdate(date);}
	gsd(date) {return this.dateParser.gsdate(date);}
	ed(date) {return this.dateParser.edate(date);}
	time(date) {return this.dateParser.time(date);}


	/*
	alpineStuff() {

        Alpine.data('overview', () => ({ match: this.matchdata }))
		this.container.innerHTML = this.template();

	}

	template() {
		return `<div x-data="overview">
		    <h1 x-text="match.home_team + ' - ' + match.away_team"></h1>

		</div>`
	}
	*/


}



class FlundrDateParser {

	format(datestring, format) {
		let date = new Date(datestring);
		let day = date.getDate();
		let month = date.getMonth()+1;
		let year = date.getFullYear();

		switch (format) {
			case 'de':
				return `${day}.${month}.${year}`; break;
			case 'de-no-year':
				return `${day}.${month}`; break;
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

class RankItLoader {

	constructor(matchID) {
		this.app;
		this.matchID = matchID;
		this.container = this.createContainerNode();
		this.init();
	}

	init() {

		this.loadCSS('/styles/css/rankit.css');
		this.requirePackages()
			.then(() => {
				this.app = new RankItApp(this.container, this.matchID);
			})
			.catch(err => {
				console.error('RankIT - Error while loading Dependencies: ' + err.message);
			})
	}

	async requirePackages() {

		let packages = [];
		if (window.Alpine === undefined) {
			packages.push(this.loadScript('https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js'));
		}

		if (window.axios === undefined) {
			packages.push(this.loadScript('https://unpkg.com/axios/dist/axios.min.js'));
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
