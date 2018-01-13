/***********************************************
* Filters                                      *
* Manually sets filters for chatting and names.*
* In this, we also handle proxy connections    *
* with a blacklist feature.                    *
* Credits: jd, panpawn                         *
* @license MIT license                         *
***********************************************/
'use strict';

const fs = require('fs');

let adWhitelist = Config.adWhitelist ? Config.adWhitelist : [];
let adRegex = new RegExp("(play.pokemonshowdown.com\\/~~)(?!(" + adWhitelist.join('|') + "))", "g");
let bannedMessages = Config.bannedMessages ? Config.bannedMessages : [];
let proxyWhitelist = Config.proxyWhitelist || false;

/**************
* Chat Filter *
**************/

