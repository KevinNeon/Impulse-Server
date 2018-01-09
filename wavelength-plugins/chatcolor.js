'use strict';

exports.commands = {
	chatcolor: 'cc',
	cc: {
		give: function (target, room, user) {
			if (!this.can('ban')) return false;
			if (!target) return this.errorReply('USAGE: /chatcolor give [USER]');
			Db.chatcolors.set(target, 1);
			this.sendReply(target + ' has been given the ability to use chat colors.');
			Users(target).popup('You have been given the ability to use chat color.');
		},
		take: function (target, room, user) {
			if (!this.can('ban')) return false;
			if (!target) return this.errorReply('USAGE: /chatcolor take [USER]');
			if (!Db.chatcolors.has(user)) return this.errorReply('This user does not have the ability to use chat colors.');
			Db.chatcolors.remove(user);
			this.sendReply('this user has had their ability to use chat colors is taken from them.');
		},
		u: 'use',
		use: function (target, room, user) {
			let group = user.getIdentity().charAt(0);
			if (room.auth) group = room.auth[user.userid] || group;
			if (user.hiding) group = ' ';
			let targets = target.split(',');
			if (targets.length < 2) return this.parse('/chatcolor help');
			if (!Db.chatcolors.has(user.userid)) return this.errorReply('You dont have ability to use chat colors.');
			if (!this.canTalk()) return this.errorReply("You may not use this command while unable to speak.");
			this.add('|raw|' + "<small>" + group + "</small>" + "<button name='parseCommand' value='/user " + user.name + "' style='background: none ; border: 0 ; padding: 0 5px 0 0 ; font-family: &quot;verdana&quot; , &quot;helvetica&quot; , &quot;arial&quot; , sans-serif ; font-size: 9pt ; cursor: pointer'>" + WL.nameColor(user.name, true) + ":</button>" + '<b><font color="' + targets[0].toLowerCase().replace(/[^#a-z0-9]+/g, '') + '">' + Chat.escapeHTML(targets.slice(1).join(",")) + '</font></b>');
		},
		'': 'help',
		help: function (target, user, room) {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				'<center><u><b>Chat Color By Prince Sky</b></u></center><br>' +
                'All commands is nestled under namespace <code>chatcolor</code>' +
                '<hr width="80%">' +
                '<code>give [user] </code>- Give user ability to use chat color. Requires @ or higher.<br>' +
                '<code>take [user] </code>- Take user\'s ability of using chat color. Requires @ or higher.<br>' +
                '<code>use [color], [msg] </code>- Post colored msg in chat.<br>' +
                '<code>help</code> - Displays this command.'
			);
		},
	},
};
