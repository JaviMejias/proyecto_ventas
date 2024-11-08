// forever-agent@0.6.1 downloaded from https://ga.jspm.io/npm:forever-agent@0.6.1/index.js

import e from"util";import t from"http";import o from"net";import r from"tls";import s from"https";var n="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:global;var i={};i=ForeverAgent;ForeverAgent.SSL=ForeverAgentSSL;var c=e,f=t.Agent,p=o,a=r,S=s.Agent;function getConnectionName(e,t){var o="";o="string"===typeof e?e+":"+t:e.host+":"+e.port+":"+(e.localAddress?e.localAddress+":":":");return o}function ForeverAgent(e){var t=this||n;t.options=e||{};t.requests={};t.sockets={};t.freeSockets={};t.maxSockets=t.options.maxSockets||f.defaultMaxSockets;t.minSockets=t.options.minSockets||ForeverAgent.defaultMinSockets;t.on("free",(function(e,o,r){var s=getConnectionName(o,r);if(t.requests[s]&&t.requests[s].length)t.requests[s].shift().onSocket(e);else if(t.sockets[s].length<t.minSockets){t.freeSockets[s]||(t.freeSockets[s]=[]);t.freeSockets[s].push(e);var onIdleError=function(){e.destroy()};e._onIdleError=onIdleError;e.on("error",onIdleError)}else e.destroy()}))}c.inherits(ForeverAgent,f);ForeverAgent.defaultMinSockets=5;ForeverAgent.prototype.createConnection=p.createConnection;ForeverAgent.prototype.addRequestNoreuse=f.prototype.addRequest;ForeverAgent.prototype.addRequest=function(e,t,o){var r=getConnectionName(t,o);if("string"!==typeof t){var s=t;o=s.port;t=s.host}if((this||n).freeSockets[r]&&(this||n).freeSockets[r].length>0&&!e.useChunkedEncodingByDefault){var i=(this||n).freeSockets[r].pop();i.removeListener("error",i._onIdleError);delete i._onIdleError;e._reusedSocket=true;e.onSocket(i)}else this.addRequestNoreuse(e,t,o)};ForeverAgent.prototype.removeSocket=function(e,t,o,r){if((this||n).sockets[t]){var s=(this||n).sockets[t].indexOf(e);-1!==s&&(this||n).sockets[t].splice(s,1)}else if((this||n).sockets[t]&&0===(this||n).sockets[t].length){delete(this||n).sockets[t];delete(this||n).requests[t]}if((this||n).freeSockets[t]){var s=(this||n).freeSockets[t].indexOf(e);if(-1!==s){(this||n).freeSockets[t].splice(s,1);0===(this||n).freeSockets[t].length&&delete(this||n).freeSockets[t]}}(this||n).requests[t]&&(this||n).requests[t].length&&this.createSocket(t,o,r).emit("free")};function ForeverAgentSSL(e){ForeverAgent.call(this||n,e)}c.inherits(ForeverAgentSSL,ForeverAgent);ForeverAgentSSL.prototype.createConnection=createConnectionSSL;ForeverAgentSSL.prototype.addRequestNoreuse=S.prototype.addRequest;function createConnectionSSL(e,t,o){o="object"===typeof e?e:"object"===typeof t?t:"object"===typeof o?o:{};"number"===typeof e&&(o.port=e);"string"===typeof t&&(o.host=t);return a.connect(o)}var l=i;export default l;
