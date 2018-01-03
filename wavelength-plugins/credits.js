'use strict';

exports.commands = {
	credits: function (target, room, user) {
		let popup = "|html|" + "<font size=5 color=#0066ff><u><b>" + Config.serverName + " Credits</b></u></font><br />" +
			 "<br />" +
			 "<u><b>Server Maintainers:</u></b><br />" +
			 "- " + WL.nameColor('Prince Sky', true) + " (Owner, Sysadmin, Policy Admin, Server Host)<br />" +
			 "- " + WL.nameColor('Anrin N', true) + " (Owner, Sysadmin, Technical Admin, Server Host)<br />" +
			 "<br />" +
			 "<u><b>Major Contributors:</b></u><br />" +
			 "- " + WL.nameColor('shivay', true) + " (Technical Admin, Development)<br/>" +
			 "- " + WL.nameColor('Sparky Heliolisk', true) + " (SSB Leader, Media)<br/>" +
			 "<br />" +
			 "<u><b>Contributors:</b></u><br />" +
			 "- " + WL.nameColor('A Helpful Rayquaza', true) + " (Community Leader, Development, Aura Storm)<br />" +
			 "- " + WL.nameColor('Xirizu', true) + " (Community Admin, Aura Storm)<br/>" +
			 "- " + WL.nameColor('SnorlaxTheRain', true) + " (Community Admin)<br/>" +
			 "<br />" +
			 "<u><b>Base Repository:</b></u><br />" +
			 "- " + WL.nameColor('HoeenHero', true) + " (Wavelength)<br />" +
			 "- " + WL.nameColor('Insist', true) + " (Exiled)<br />" +
			 "<u><b>Special Thanks:</b></u><br />" +
			 "- Our Staff Members<br />" +
			 "- Our Regular Users<br />";
		user.popup(popup);
	},

	usetoken: function (target, room, user, connection, cmd, message) {
		target = target.split(',');
		if (target.length < 2) return this.parse('/help usetoken');
		target[0] = toId(target[0]);
		if (target[0] === 'intro') target[0] = 'disableintroscroll';
		let msg = '';
		if (['avatar', 'declare', 'icon', 'color', 'emote', 'title', 'disableintroscroll'].indexOf(target[0]) === -1) return this.parse('/help usetoken');
		if (!user.tokens || !user.tokens[target[0]]) return this.errorReply('You need to buy this from the shop first.');
		target[1] = target[1].trim();

		switch (target[0]) {
		case 'avatar':
			msg = '/html <center>' + WL.nameColor(user.name, true) + ' has redeemed a avatar token.<br/><img src="' + target[1] + '" alt="avatar"/><br/>';
			msg += '<button class="button" name="send" value="/customavatar set ' + user.userid + ', ' + target[1] + '">Apply Avatar</button></center>';
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'declare':
			msg += '/html <center>' + WL.nameColor(user.name, true) + ' has redeemed a global declare token.<br/> Message: ' + target[1] + "<br/>";
			msg += '<button class="button" name="send" value="/globaldeclare ' + target[1] + '">Globally Declare the Message</button></center>';
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'color':
			msg += '/html <center>' + WL.nameColor(user.name, true) + ' has redeemed a custom color token.<br/> hex color: <span' + target[1] + '<br/>';
			msg += '<button class="button" name="send" value="/customcolor set ' + user.name + ',' + target[1] + '">Set color (<b><font color="' + target[1] + '">' + target[1] + '</font></b>)</button></center>';
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'icon':
			msg += '/html <center>' + WL.nameColor(user.name, true) + ' has redeemed a icon token.<br/><img src="' + target[1] + '" alt="icon"/><br/>';
			msg += '<button class="button" name="send" value="/customicon set ' + user.userid + ', ' + target[1] + '">Apply icon</button></center>';
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'profilebackground':
			msg += '/html <center>' + WL.nameColor(user.name, true) + ' has redeemed a profile background token.<br/>';
			msg += '<button class="button" name="send" value="/pbg set ' + user.userid + ', ' + target[1] + '">Apply Profile Background</button></center>';
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'pmusic':
			if (!target[2]) return this.errorReply('/usetoken pmusic, [link], [title]');
			msg += '/html <center>' + WL.nameColor(user.name, true) + ' has redeem a profile music token.<br/>';
			msg += '<button class="button" name="send" value="/pmusic set ' + user.userid + ', ' + target[1] + ', ' + target[2] + '">Set Profile MUSIC</button></center>';
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'title':
			if (!target[2]) return this.errorReply('/usetoken title, [name], [hex code]');
			msg += '/html <center>' + WL.nameColor(user.name, true) + ' has redeem a title token.<br/> title name: ' + target[1] + '<br/>';
			msg += '<button class="button" name="send" value="/customtitle set ' + user.userid + ', ' + target[1] + ', ' + target[2] + '">Set title (<b><font color="' + target[2] + '">' + target[2] + '</font></b>)</button></center>';
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'emote':
			if (!target[2]) return this.errorReply('/usetoken emote, [name], [img]');
			target[2] = target[2].trim();
			msg += '/html <center>' + WL.nameColor(user.name, true) + ' has redeem a emote token.<br/><img src="' + target[2] + '" alt="' + target[1] + '"/><br/>';
			msg += '<button class="button" name="send" value="/emote add, ' + target[1] + ', ' + target[2] + '">Add emote</button></center>';
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		case 'disableintroscroll':
			if (!target[1]) return this.errorReply('/usetoken disableintroscroll, [room]');
			let roomid = toId(target[1]);
			if (!Rooms(roomid)) return this.errorReply(`${roomid} is not a room.`);
			if (Db.disabledScrolls.has(roomid)) return this.errorReply(`${Rooms(roomid).title} has already roomintro scroll disabled.`);
			msg += '/html <center>' + WL.nameColor(user.name, true) + ' has redeemed roomintro scroll disabler token.<br/>';
			msg += '<button class="button" name="send" value="/disableintroscroll ' + target[1] + '">Disable Intro Scrool for <b>' + Rooms(roomid).title + '</b></button></center>';
			delete user.tokens[target[0]];
			return WL.messageSeniorStaff(msg);
		default:
			return this.errorReply('An error occured in the command.'); // This should never happen.
		}
	},
	usetokenhelp: [
		'/usetoken [token], [argument(s)] - Redeem a token from the shop. Accepts the following arguments: ',
		'/usetoken avatar, [image] | /usetoken declare, [message] | /usetoken color, [hex code]',
		'/usetoken icon [image] | /usetoken title, [name], [hex code] | /usetoken emote, [name], [image]',
		'/usetoken disableintroscroll [room name]',
	],

	transferaccount: 'transferauthority',
	transferauth: 'transferauthority',
	transferauthority: (function () {
		function transferAuth(user1, user2, transfereeAuth) { // bits and pieces taken from /userauth
			let buff = [];
			let ranks = Config.groupsranking;

			// global authority
			let globalGroup = Users.usergroups[user1];
			if (globalGroup) {
				let symbol = globalGroup.charAt(0);
				if (ranks.indexOf(symbol) > ranks.indexOf(transfereeAuth)) return buff;
				Users.setOfflineGroup(user1, Config.groupsranking[0]);
				Users.setOfflineGroup(user2, symbol);
				buff.push(`Global ${symbol}`);
			}
			// room authority
			Rooms.rooms.forEach((curRoom, id) => {
				if (curRoom.founder && curRoom.founder === user1) {
					curRoom.founder = user2;
					buff.push(`${id} [ROOMFOUNDER]`);
				}
				if (!curRoom.auth) return;
				let roomGroup = curRoom.auth[user1];
				if (!roomGroup) return;
				delete curRoom.auth[user1];
				curRoom.auth[user2] = roomGroup;
				buff.push(roomGroup + id);
			});
			if (buff.length >= 2) { // did they have roomauth?
				Rooms.global.writeChatRoomData();
			}

			if (Users(user1)) Users(user1).updateIdentity();
			if (Users(user2)) Users(user2).updateIdentity();

			return buff;
		}
		return function (target, room, user) {
			if (!this.can('declare')) return false;
			if (!target || !target.includes(',')) return this.parse(`/help transferauthority`);
			target = target.split(',');
			let user1 = target[0].trim(), user2 = target[1].trim(), user1ID = toId(user1), user2ID = toId(user2);
			if (user1ID.length < 1 || user2ID.length < 1) return this.errorReply(`One or more of the given usernames are too short to be a valid username (min 1 character).`);
			if (user1ID.length > 17 || user2ID.length > 17) return this.errorReply(`One or more of the given usernames are too long to be a valid username (max 17 characters).`);
			if (user1ID === user2ID) return this.errorReply(`You provided the same accounts for the alt change.`);
			let transferSuccess = transferAuth(user1ID, user2ID, user.group);
			if (transferSuccess.length >= 1) {
				this.addModCommand(`${user1} has had their account (${transferSuccess.join(', ')}) transfered onto new name: ${user2} - by ${user.name}.`);
				this.sendReply(`Note: avatars do not transfer automatically with this command.`);
			} else {
				return this.errorReply(`User '${user1}' has no global or room authority, or they have higher global authority than you.`);
			}
		};
	})(),
	transferauthorityhelp: ["/transferauthority [old alt], [new alt] - Transfers a user's global/room authority onto their new alt. Requires & ~"],
};
