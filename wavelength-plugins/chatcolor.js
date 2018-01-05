/***********************
 * Icons.js Credits:   *
 * panpawn & Lord Haji *
 * Chat Color Rewrite: *
 * Prince Sky          *
 * ********************/

'use strict';

let cc = {};
const fs = require('fs');

function load() {
	fs.readFile('config/chatcolors.json', 'utf8', function (err, file) {
		if (err) return;
		cc = JSON.parse(file);
	});
}
load();

function updateCC() {
	fs.writeFileSync('config/chatcolors.json', JSON.stringify(cc));

	let newCss = '/* Chat Colors START */\n';

	for (let name in cc) {
		newCss += generateCSS(name, icons[name]);
	}
	newCss += '/* Chat Colors END */\n';

	let file = fs.readFileSync('config/custom.css', 'utf8').split('\n');
	if (~file.indexOf('/* Chat Colors START */')) file.splice(file.indexOf('/* Chat Colors START */'), (file.indexOf('/* Chat Colors END */') - file.indexOf('/* Chat Colors START */')) + 1);
	fs.writeFileSync('config/custom.css', file.join('\n') + newCss);
	WL.reloadCSS();
}

function generateCSS(name, cc) {
	let css = '';
	name = toId(name);
	css = '[id$="-chat.chatmessage-' + name + '"] {\ncolor: ' + cc + ' !important;\n}\n';
	return css;
}

exports.commands = {
	cc: 'chatcolor',
	chatcolor: {
		set: function (target, room, user) {
			if (!this.can('roomowner')) return false;
			target = target.split(',');
			for (let u in target) target[u] = target[u].trim();
			if (target.length !== 2) return this.parse('/help cc');
			if (toId(target[0]).length > 19) return this.errorReply("Usernames are not this long...");
			if (cc[toId(target[0])]) return this.errorReply("This user already has a custom chat color.  Do /cc delete [user] and then set their new chat color.");
			this.sendReply("|raw|You have given " + WL.nameColor(target[0], true) + " an chat color.");
			Monitor.adminlog(target[0] + " has received an chat color from " + user.name + ".");
			this.privateModCommand("|raw|(" + target[0] + " has recieved chat color. from " + user.name + ".)");
			if (Users(target[0]) && Users(target[0]).connected) Users(target[0]).popup("|html|" + WL.nameColor(user.name, true) + " has set your chat color.<br><center>Refresh, If you don't see it.</center>");
			cc[toId(target[0])] = target[1];
			updateCC();
		},
		remove: 'delete',
		delete: function (target, room, user) {
			if (!this.can('roomowner')) return false;
			target = toId(target);
			if (!cc[toId(target)]) return this.errorReply('/cc - ' + target + ' does not have an chat color.');
			delete cc.constructor[toId(target)];
			updateCC();
			this.sendReply("You removed " + target + "'s chat color.");
			Monitor.adminlog(user.name + " removed " + target + "'s chat color.");
			this.privateModCommand("(" + target + "'s chat color was removed by " + user.name + ".)");
			if (Users(target) && Users(target).connected) Users(target).popup("|html|" + WL.nameColor(user.name, true) + " has removed your chat color.");
		},
	},
	cchelp: [
		"Commands Include:",
		"/cc set [user], [hex color] - Gives [user] an chat color of [hex color]",
		"/cc delete [user] - Deletes a user's chat color.",
	],
};
