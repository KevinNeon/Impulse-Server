'use strict';

const http = require('http');

// Cache
let udCache = {};
let defCache = {};

exports.commands = {
	def: 'define',
	define: function (target, room, user) {
		if (!target) return this.parse('/help define');
		target = toId(target);
		if (target > 50) return this.sendReply('/define <word> - word can not be longer than 50 characters.');
		if (!this.runBroadcast()) return;

		if (toId(target) !== 'constructor' && defCache[toId(target)]) {
			this.sendReplyBox(defCache[toId(target)]);
			if (room) room.update();
			return;
		}

		let options = {
			host: 'api.wordnik.com',
			port: 80,
			path: '/v4/word.json/' + target + '/definitions?limit=3&sourceDictionaries=all' +
			'&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
			method: 'GET',
		};

		http.get(options, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			}).on('end', () => {
				if (data.charAt(1) !== '{') {
					this.sendReplyBox('Error retrieving definition for <strong>"' + Chat.escapeHTML(target) + '"</strong>.');
					if (room) room.update();
					return;
				}
				data = JSON.parse(data);
				let output = '<font color=#24678d><strong>Definitions for ' + target + ':</strong></font><br />';
				if (!data[0] || !data) {
					this.sendReplyBox('No results for <strong>"' + target + '"</strong>.');
					if (room) room.update();
					return;
				} else {
					let count = 1;
					for (let u in data) {
						if (count > 3) break;
						output += '(<strong>' + count + '</strong>) ' + Chat.escapeHTML(data[u]['text']) + '<br />';
						count++;
					}
					this.sendReplyBox(output);
					defCache[target] = output;
					if (room) room.update();
					return;
				}
			});
		});
	},
	definehelp: ["/define [word] - Gives the definition to a word."],

	u: 'ud',
	ud: function (target, room, user) {
		if (this.runBroadcast() && room.id === 'lobby') return this.sendReply("Minors use Pokemon Showdown so it is probably a bad idea to broadcast this command.");
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help urbandefine');
		if (target.toString() > 50) return this.sendReply('Phrase can not be longer than 50 characters.');

		if (toId(target) !== 'constructor' && udCache[toId(target)]) {
			this.sendReplyBox(udCache[toId(target)]);
			if (room) room.update();
			return;
		}

		let options = {
			host: 'api.urbandictionary.com',
			port: 80,
			path: '/v0/define?term=' + encodeURIComponent(target),
			term: target,
		};

		http.get(options, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			}).on('end', () => {
				if (data.charAt(0) !== '{') {
					this.sendReplyBox('Error retrieving definition for <strong>"' + Chat.escapeHTML(target) + '"</strong>.');
					if (room) room.update();
					return;
				}
				data = JSON.parse(data);
				let definitions = data['list'];
				if (data['result_type'] === 'no_results' || !data) {
					this.sendReplyBox('No results for <strong>"' + Chat.escapeHTML(target) + '"</strong>.');
					if (room) room.update();
					return;
				} else {
					if (!definitions[0]['word'] || !definitions[0]['definition']) {
						this.sendReplyBox('No results for <strong>"' + Chat.escapeHTML(target) + '"</strong>.');
						if (room) room.update();
						return;
					}
					let output = '<strong>' + Chat.escapeHTML(definitions[0]['word']) + ':</strong> ' + Chat.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
					if (output.length > 400) output = output.slice(0, 400) + '...';
					this.sendReplyBox(output);
					udCache[toId(target)] = output;
					if (room) room.update();
					return;
				}
			});
		});
	},
	urbandefinehelp: ["/u [word] - Gives the Urban Definition for a word."],
};
