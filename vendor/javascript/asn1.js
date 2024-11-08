// asn1@0.2.6 downloaded from https://ga.jspm.io/npm:asn1@0.2.6/lib/index.js

import*as t from"assert";import*as e from"safer-buffer";var r={};r={newInvalidAsn1Error:function(t){var e=new Error;e.name="InvalidAsn1Error";e.message=t||"";return e}};var i=r;var n={};n={EOC:0,Boolean:1,Integer:2,BitString:3,OctetString:4,Null:5,OID:6,ObjectDescriptor:7,External:8,Real:9,Enumeration:10,PDV:11,Utf8String:12,RelativeOID:13,Sequence:16,Set:17,NumericString:18,PrintableString:19,T61String:20,VideotexString:21,IA5String:22,UTCTime:23,GeneralizedTime:24,GraphicString:25,VisibleString:26,GeneralString:28,UniversalString:29,CharacterString:30,BMPString:31,Constructor:32,Context:128};var s=n;var f="default"in t?t.default:t;var o="default"in e?e.default:e;var h="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:global;var u={};var a=f;var l=o.Buffer;var p=s;var _=i;var g=_.newInvalidAsn1Error;function Reader$1(t){if(!t||!l.isBuffer(t))throw new TypeError("data must be a node Buffer");(this||h)._buf=t;(this||h)._size=t.length;(this||h)._len=0;(this||h)._offset=0}Object.defineProperty(Reader$1.prototype,"length",{enumerable:true,get:function(){return(this||h)._len}});Object.defineProperty(Reader$1.prototype,"offset",{enumerable:true,get:function(){return(this||h)._offset}});Object.defineProperty(Reader$1.prototype,"remain",{get:function(){return(this||h)._size-(this||h)._offset}});Object.defineProperty(Reader$1.prototype,"buffer",{get:function(){return(this||h)._buf.slice((this||h)._offset)}});
/**
 * Reads a single byte and advances offset; you can pass in `true` to make this
 * a "peek" operation (i.e., get the byte, but don't advance the offset).
 *
 * @param {Boolean} peek true means don't move offset.
 * @return {Number} the next byte, null if not enough data.
 */Reader$1.prototype.readByte=function(t){if((this||h)._size-(this||h)._offset<1)return null;var e=255&(this||h)._buf[(this||h)._offset];t||((this||h)._offset+=1);return e};Reader$1.prototype.peek=function(){return this.readByte(true)};Reader$1.prototype.readLength=function(t){void 0===t&&(t=(this||h)._offset);if(t>=(this||h)._size)return null;var e=255&(this||h)._buf[t++];if(null===e)return null;if(128===(128&e)){e&=127;if(0===e)throw g("Indefinite length not supported");if(e>4)throw g("encoding too long");if((this||h)._size-t<e)return null;(this||h)._len=0;for(var r=0;r<e;r++)(this||h)._len=((this||h)._len<<8)+(255&(this||h)._buf[t++])}else(this||h)._len=e;return t};Reader$1.prototype.readSequence=function(t){var e=this.peek();if(null===e)return null;if(void 0!==t&&t!==e)throw g("Expected 0x"+t.toString(16)+": got 0x"+e.toString(16));var r=this.readLength((this||h)._offset+1);if(null===r)return null;(this||h)._offset=r;return e};Reader$1.prototype.readInt=function(){return this._readTag(p.Integer)};Reader$1.prototype.readBoolean=function(){return 0!==this._readTag(p.Boolean)};Reader$1.prototype.readEnumeration=function(){return this._readTag(p.Enumeration)};Reader$1.prototype.readString=function(t,e){t||(t=p.OctetString);var r=this.peek();if(null===r)return null;if(r!==t)throw g("Expected 0x"+t.toString(16)+": got 0x"+r.toString(16));var i=this.readLength((this||h)._offset+1);if(null===i)return null;if((this||h).length>(this||h)._size-i)return null;(this||h)._offset=i;if(0===(this||h).length)return e?l.alloc(0):"";var n=(this||h)._buf.slice((this||h)._offset,(this||h)._offset+(this||h).length);(this||h)._offset+=(this||h).length;return e?n:n.toString("utf8")};Reader$1.prototype.readOID=function(t){t||(t=p.OID);var e=this.readString(t,true);if(null===e)return null;var r=[];var i=0;for(var n=0;n<e.length;n++){var s=255&e[n];i<<=7;i+=127&s;if(0===(128&s)){r.push(i);i=0}}i=r.shift();r.unshift(i%40);r.unshift(i/40>>0);return r.join(".")};Reader$1.prototype._readTag=function(t){a.ok(void 0!==t);var e=this.peek();if(null===e)return null;if(e!==t)throw g("Expected 0x"+t.toString(16)+": got 0x"+e.toString(16));var r=this.readLength((this||h)._offset+1);if(null===r)return null;if((this||h).length>4)throw g("Integer too long: "+(this||h).length);if((this||h).length>(this||h)._size-r)return null;(this||h)._offset=r;var i=(this||h)._buf[(this||h)._offset];var n=0;for(var s=0;s<(this||h).length;s++){n<<=8;n|=255&(this||h)._buf[(this||h)._offset++]}128===(128&i)&&4!==s&&(n-=1<<8*s);return n>>0};u=Reader$1;var b=u;var c="default"in t?t.default:t;var y="default"in e?e.default:e;var d="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:global;var v={};var w=c;var m=y.Buffer;var S=s;var $=i;var E=$.newInvalidAsn1Error;var B={size:1024,growthFactor:8};function merge(t,e){w.ok(t);w.equal(typeof t,"object");w.ok(e);w.equal(typeof e,"object");var r=Object.getOwnPropertyNames(t);r.forEach((function(r){if(!e[r]){var i=Object.getOwnPropertyDescriptor(t,r);Object.defineProperty(e,r,i)}}));return e}function Writer$1(t){t=merge(B,t||{});(this||d)._buf=m.alloc(t.size||1024);(this||d)._size=(this||d)._buf.length;(this||d)._offset=0;(this||d)._options=t;(this||d)._seq=[]}Object.defineProperty(Writer$1.prototype,"buffer",{get:function(){if((this||d)._seq.length)throw E((this||d)._seq.length+" unended sequence(s)");return(this||d)._buf.slice(0,(this||d)._offset)}});Writer$1.prototype.writeByte=function(t){if("number"!==typeof t)throw new TypeError("argument must be a Number");this._ensure(1);(this||d)._buf[(this||d)._offset++]=t};Writer$1.prototype.writeInt=function(t,e){if("number"!==typeof t)throw new TypeError("argument must be a Number");"number"!==typeof e&&(e=S.Integer);var r=4;while((0===(4286578688&t)||-8388608===(4286578688&t))&&r>1){r--;t<<=8}if(r>4)throw E("BER ints cannot be > 0xffffffff");this._ensure(2+r);(this||d)._buf[(this||d)._offset++]=e;(this||d)._buf[(this||d)._offset++]=r;while(r-- >0){(this||d)._buf[(this||d)._offset++]=(4278190080&t)>>>24;t<<=8}};Writer$1.prototype.writeNull=function(){this.writeByte(S.Null);this.writeByte(0)};Writer$1.prototype.writeEnumeration=function(t,e){if("number"!==typeof t)throw new TypeError("argument must be a Number");"number"!==typeof e&&(e=S.Enumeration);return this.writeInt(t,e)};Writer$1.prototype.writeBoolean=function(t,e){if("boolean"!==typeof t)throw new TypeError("argument must be a Boolean");"number"!==typeof e&&(e=S.Boolean);this._ensure(3);(this||d)._buf[(this||d)._offset++]=e;(this||d)._buf[(this||d)._offset++]=1;(this||d)._buf[(this||d)._offset++]=t?255:0};Writer$1.prototype.writeString=function(t,e){if("string"!==typeof t)throw new TypeError("argument must be a string (was: "+typeof t+")");"number"!==typeof e&&(e=S.OctetString);var r=m.byteLength(t);this.writeByte(e);this.writeLength(r);if(r){this._ensure(r);(this||d)._buf.write(t,(this||d)._offset);(this||d)._offset+=r}};Writer$1.prototype.writeBuffer=function(t,e){if("number"!==typeof e)throw new TypeError("tag must be a number");if(!m.isBuffer(t))throw new TypeError("argument must be a buffer");this.writeByte(e);this.writeLength(t.length);this._ensure(t.length);t.copy((this||d)._buf,(this||d)._offset,0,t.length);(this||d)._offset+=t.length};Writer$1.prototype.writeStringArray=function(t){if(!t instanceof Array)throw new TypeError("argument must be an Array[String]");var e=this||d;t.forEach((function(t){e.writeString(t)}))};Writer$1.prototype.writeOID=function(t,e){if("string"!==typeof t)throw new TypeError("argument must be a string");"number"!==typeof e&&(e=S.OID);if(!/^([0-9]+\.){3,}[0-9]+$/.test(t))throw new Error("argument is not a valid OID string");function encodeOctet(t,e){if(e<128)t.push(e);else if(e<16384){t.push(e>>>7|128);t.push(127&e)}else if(e<2097152){t.push(e>>>14|128);t.push(255&(e>>>7|128));t.push(127&e)}else if(e<268435456){t.push(e>>>21|128);t.push(255&(e>>>14|128));t.push(255&(e>>>7|128));t.push(127&e)}else{t.push(255&(e>>>28|128));t.push(255&(e>>>21|128));t.push(255&(e>>>14|128));t.push(255&(e>>>7|128));t.push(127&e)}}var r=t.split(".");var i=[];i.push(40*parseInt(r[0],10)+parseInt(r[1],10));r.slice(2).forEach((function(t){encodeOctet(i,parseInt(t,10))}));var n=this||d;this._ensure(2+i.length);this.writeByte(e);this.writeLength(i.length);i.forEach((function(t){n.writeByte(t)}))};Writer$1.prototype.writeLength=function(t){if("number"!==typeof t)throw new TypeError("argument must be a Number");this._ensure(4);if(t<=127)(this||d)._buf[(this||d)._offset++]=t;else if(t<=255){(this||d)._buf[(this||d)._offset++]=129;(this||d)._buf[(this||d)._offset++]=t}else if(t<=65535){(this||d)._buf[(this||d)._offset++]=130;(this||d)._buf[(this||d)._offset++]=t>>8;(this||d)._buf[(this||d)._offset++]=t}else{if(!(t<=16777215))throw E("Length too long (> 4 bytes)");(this||d)._buf[(this||d)._offset++]=131;(this||d)._buf[(this||d)._offset++]=t>>16;(this||d)._buf[(this||d)._offset++]=t>>8;(this||d)._buf[(this||d)._offset++]=t}};Writer$1.prototype.startSequence=function(t){"number"!==typeof t&&(t=S.Sequence|S.Constructor);this.writeByte(t);(this||d)._seq.push((this||d)._offset);this._ensure(3);(this||d)._offset+=3};Writer$1.prototype.endSequence=function(){var t=(this||d)._seq.pop();var e=t+3;var r=(this||d)._offset-e;if(r<=127){this._shift(e,r,-2);(this||d)._buf[t]=r}else if(r<=255){this._shift(e,r,-1);(this||d)._buf[t]=129;(this||d)._buf[t+1]=r}else if(r<=65535){(this||d)._buf[t]=130;(this||d)._buf[t+1]=r>>8;(this||d)._buf[t+2]=r}else{if(!(r<=16777215))throw E("Sequence too long");this._shift(e,r,1);(this||d)._buf[t]=131;(this||d)._buf[t+1]=r>>16;(this||d)._buf[t+2]=r>>8;(this||d)._buf[t+3]=r}};Writer$1.prototype._shift=function(t,e,r){w.ok(void 0!==t);w.ok(void 0!==e);w.ok(r);(this||d)._buf.copy((this||d)._buf,t+r,t,t+e);(this||d)._offset+=r};Writer$1.prototype._ensure=function(t){w.ok(t);if((this||d)._size-(this||d)._offset<t){var e=(this||d)._size*(this||d)._options.growthFactor;e-(this||d)._offset<t&&(e+=t);var r=m.alloc(e);(this||d)._buf.copy(r,0,0,(this||d)._offset);(this||d)._buf=r;(this||d)._size=e}};v=Writer$1;var O=v;var I={};var R=i;var T=s;var W=b;var q=O;I={Reader:W,Writer:q};for(var x in T)T.hasOwnProperty(x)&&(I[x]=T[x]);for(var z in R)R.hasOwnProperty(z)&&(I[z]=R[z]);var P=I;var j={};var k=P;j={Ber:k,BerReader:k.Reader,BerWriter:k.Writer};var D=j;const L=j.BerReader;const N=j.Ber;export{N as Ber,L as BerReader,D as default};
