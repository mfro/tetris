(function(e){function n(n){for(var i,a,l=n[0],u=n[1],c=n[2],d=0,s=[];d<l.length;d++)a=l[d],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&s.push(r[a][0]),r[a]=0;for(i in u)Object.prototype.hasOwnProperty.call(u,i)&&(e[i]=u[i]);f&&f(n);while(s.length)s.shift()();return o.push.apply(o,c||[]),t()}function t(){for(var e,n=0;n<o.length;n++){for(var t=o[n],i=!0,l=1;l<t.length;l++){var u=t[l];0!==r[u]&&(i=!1)}i&&(o.splice(n--,1),e=a(a.s=t[0]))}return e}var i={},r={index:0},o=[];function a(n){if(i[n])return i[n].exports;var t=i[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.m=e,a.c=i,a.d=function(e,n,t){a.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,n){if(1&n&&(e=a(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)a.d(t,i,function(n){return e[n]}.bind(null,i));return t},a.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(n,"a",n),n},a.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},a.p="";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],u=l.push.bind(l);l.push=n,l=l.slice();for(var c=0;c<l.length;c++)n(l[c]);var f=u;o.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("cd49")},"0922":function(e,n,t){"use strict";t("ea56")},"6ee5":function(e,n,t){"use strict";t("aa3c")},aa3c:function(e,n,t){},cbc2:function(e,n,t){"use strict";t("81b1");var i=t("fee1");t.d(n,"a",(function(){return i["a"]})),t.d(n,"b",(function(){return i["b"]})),t.d(n,"c",(function(){return i["c"]})),t.d(n,"d",(function(){return i["d"]})),t.d(n,"e",(function(){return i["e"]})),t.d(n,"f",(function(){return i["f"]})),t.d(n,"g",(function(){return i["g"]})),t.d(n,"h",(function(){return i["h"]})),t.d(n,"i",(function(){return i["i"]})),t.d(n,"j",(function(){return i["j"]})),t.d(n,"k",(function(){return i["k"]})),t.d(n,"l",(function(){return i["l"]})),t.d(n,"m",(function(){return i["m"]})),t.d(n,"n",(function(){return i["n"]})),t.d(n,"o",(function(){return i["o"]})),t.d(n,"p",(function(){return i["p"]})),t.d(n,"q",(function(){return i["q"]})),t.d(n,"r",(function(){return i["r"]})),t.d(n,"s",(function(){return i["s"]})),t.d(n,"t",(function(){return i["t"]})),t.d(n,"u",(function(){return i["u"]})),t.d(n,"v",(function(){return i["v"]})),t.d(n,"w",(function(){return i["w"]})),t.d(n,"x",(function(){return i["x"]})),t.d(n,"y",(function(){return i["y"]})),t.d(n,"z",(function(){return i["z"]})),t.d(n,"A",(function(){return i["A"]}));t("669d")},cd49:function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d");var i=t("cbc2"),r=t("5a0f"),o=Object(i["A"])("data-v-52d46b64");Object(i["o"])("data-v-52d46b64");var a={ref:"canvas"};Object(i["n"])();var l=o((function(e,n,t,r,l,u){var c=Object(i["r"])("v-app");return Object(i["m"])(),Object(i["f"])(c,{"align-center":"",class:"pa-6"},{default:o((function(){return[Object(i["i"])("canvas",a,null,512)]})),_:1})})),u=(t("a623"),t("d81d"),t("fb6a"),t("a434"),t("5530")),c=t("b85c"),f=t("d4ec"),d=t("bee2"),s=function(){function e(n,t){Object(f["a"])(this,e),this.x=n,this.y=t}return Object(d["a"])(e,[{key:"len",get:function(){return Math.sqrt(this.x*this.x+this.y*this.y)}},{key:"dir",get:function(){return Math.atan2(this.y,this.x)}}],[{key:"norm",value:function(n){return e.polar(1,n.dir)}},{key:"scale",value:function(n,t){return new e(n.x*t,n.y*t)}},{key:"add",value:function(n,t){return new e(n.x+t.x,n.y+t.y)}},{key:"dot",value:function(e,n){return e.x*n.x+e.y*n.y}},{key:"eq",value:function(e,n){return e.x==n.x&&e.y==n.y}},{key:"delta",value:function(n,t){var i=e.dot(n,t),r=Math.acos(i/n.len/t.len);return n.y*t.x>n.x*t.y?-r:r}},{key:"polar",value:function(n,t){return new e(Math.cos(t)*n,Math.sin(t)*n)}}]),e}();function v(e,n){if(!e)throw new Error(n)}s.zero=new s(0,0);t("4ec9"),t("d3b7"),t("6062"),t("3ca3"),t("ddb0");var y=32,b=37,p=38,h=16,m=40,g=39,O=65,j=90,w=83,x=88,_=67,k=new Set,T=new Map,S=new Map;function z(e){return k.has(e)}function M(e,n){var t=S.get(e);t||S.set(e,t=[]),t.push(n)}function V(e,n){var t=T.get(e);t||T.set(e,t=[]),t.push(n)}window.addEventListener("keydown",(function(e){if(!k.has(e.keyCode)){k.add(e.keyCode);var n=S.get(e.keyCode);if(n){var t,i=Object(c["a"])(n);try{for(i.s();!(t=i.n()).done;){var r=t.value;r()}}catch(o){i.e(o)}finally{i.f()}}}})),window.addEventListener("keyup",(function(e){k.delete(e.keyCode);var n=T.get(e.keyCode);if(n){var t,i=Object(c["a"])(n);try{for(i.s();!(t=i.n()).done;){var r=t.value;r()}}catch(o){i.e(o)}finally{i.f()}}}));t("99af");var C,D,P=t("2909");function L(e){return{type:"constant",value:e}}function I(e){return{type:"optional",inner:e}}function q(e,n){return{type:"natural",name:e,description:n}}function J(e,n){return{type:"rational",name:e,description:n}}function R(e,n,t){return{type:"select",name:e,description:n,options:t}}function A(e,n,t){return{type:"object",name:e,description:n,inner:t}}(function(e){function n(e,n){for(var t=n.map((function(e){return new s(e[0],e[1])})),i=[t],r=0;r<3;++r)t=t.map((function(n){return new s(e-1-n.y,n.x)})),i.push(t);return{size:e,rotations:i}}e.I=n(4,[[0,1],[1,1],[2,1],[3,1]]),e.O=n(2,[[0,0],[0,1],[1,0],[1,1]]),e.T=n(3,[[1,0],[0,1],[1,1],[2,1]]),e.J=n(3,[[0,0],[0,1],[1,1],[2,1]]),e.L=n(3,[[2,0],[0,1],[1,1],[2,1]]),e.S=n(3,[[1,0],[2,0],[0,1],[1,1]]),e.Z=n(3,[[0,0],[1,0],[1,1],[2,1]]),e.all=[e.I,e.O,e.T,e.J,e.L,e.S,e.Z]})(C||(C={})),function(e){function n(e){return e.map((function(e){return[s.zero].concat(Object(P["a"])(e.map((function(e){return new s(e[0],-e[1])}))))}))}var t=n([[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]],[[0,0]]]),i=n([[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],[[0,0],[1,0],[1,-1],[0,2],[1,2]],[[0,0],[1,0],[1,-1],[0,2],[1,2]],[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],[[0,0],[1,0],[1,1],[0,-2],[1,-2]],[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],[[0,0],[1,0],[1,1],[0,-2],[1,-2]]]),r=n([[[0,0],[-2,0],[1,0],[-2,-1],[1,2]],[[0,0],[2,0],[-1,0],[2,1],[-1,-2]],[[0,0],[-1,0],[2,0],[-1,2],[2,-1]],[[0,0],[1,0],[-2,0],[1,-2],[-2,1]],[[0,0],[2,0],[-1,0],[2,1],[-1,-2]],[[0,0],[-2,0],[1,0],[-2,-1],[1,2]],[[0,0],[1,0],[-2,0],[1,-2],[-2,1]],[[0,0],[-1,0],[2,0],[-1,2],[2,-1]]]),o=n([[[0,0],[-2,0],[1,0],[1,2],[-2,-1]],[[0,0],[2,0],[-1,0],[2,1],[-1,-2]],[[0,0],[-1,0],[2,0],[-1,2],[2,-1]],[[0,0],[-2,0],[1,0],[-2,1],[1,-1]],[[0,0],[2,0],[-1,0],[2,1],[-1,-1]],[[0,0],[1,0],[-2,0],[1,2],[-2,-1]],[[0,0],[-2,0],[1,0],[-2,1],[1,-2]],[[0,0],[2,0],[-1,0],[-1,2],[2,-1]]]);e.standard=new Map([[C.I,r],[C.O,i],[C.T,i],[C.J,i],[C.L,i],[C.S,i],[C.Z,i]]),e.asira=new Map([[C.I,o],[C.O,i],[C.T,i],[C.J,i],[C.L,i],[C.S,i],[C.Z,i]]),e.none=new Map([[C.I,t],[C.O,t],[C.T,t],[C.J,t],[C.L,t],[C.S,t],[C.Z,t]])}(D||(D={}));L(new s(10,40)),J("Drop Delay","Drop delay for falling pieces (frames per tile)"),J("Lock Delay","Lock down delay (frames)"),I(J("Move Reset Limit","Maximum number of times the Lock Delay can be reset by successful shifts or rotates")),R("Wall Kicks","Wall kick data",[["No Kicks",D.none],["Standard",D.standard],["Asira",D.asira]]),q("Preview Size","Number of pieces in the preview"),I(A("Autoshift","Configure repeated shifts while input is held",{delay:J("Delay","Delay between repeated shifts (frames)"),initial_delay:J("Initial Delay","Delay after first shift before repeating (frames)")})),J("Soft Drop Multiplier","Multiplier for Drop Delay while soft dropping"),t("4160"),t("13d5"),t("25f0"),t("159b");var Z,E=t("22a2"),U=(t("4de4"),t("a630"),t("c975"),t("a15b"),t("4d90"),t("5cc6"),t("9a8c"),t("a975"),t("735e"),t("c1ac"),t("d139"),t("3a7b"),t("d5d6"),t("82f8"),t("e91f"),t("60bd"),t("5f96"),t("3280"),t("3fcc"),t("ca91"),t("25a1"),t("cd26"),t("3c5d"),t("2954"),t("649e"),t("219c"),t("170b"),t("b39a"),t("72f7"),{v1:function(e,n,t,i,r){var o=new Map([[C.I,"#31c7ef"],[C.O,"#e39f02"],[C.T,"#af298a"],[C.J,"#2141c6"],[C.L,"#e35b02"],[C.S,"#59b101"],[C.Z,"#d70f37"]]),a=n;if(e.save(),r==Z.ghost)e.fillStyle="white",e.fillRect(a.x,a.y,1,1);else if(r==Z.disabled)e.filter="grayscale(100%)";else{var l=o.get(t);v(null!=l,"no color for piece"),e.fillStyle=l,e.fillRect(a.x,a.y,1,1)}var u=1/8;e.beginPath(),e.lineCap="butt",e.lineWidth=u,e.strokeStyle="#00000040",i[0]&&(e.moveTo(a.x,a.y+u/2),e.lineTo(a.x+u/2,a.y+u/2),e.lineTo(a.x+u/2,a.y)),i[1]&&(e.moveTo(a.x,a.y+u/2),e.lineTo(a.x+1,a.y+u/2)),i[2]&&(e.moveTo(a.x+1-u/2,a.y),e.lineTo(a.x+1-u/2,a.y+u/2),e.lineTo(a.x+1,a.y+u/2)),i[3]&&(e.moveTo(a.x-u/2+1,a.y),e.lineTo(a.x-u/2+1,a.y+1)),i[4]&&(e.moveTo(a.x+1,a.y+1-u/2),e.lineTo(a.x+1-u/2,a.y+1-u/2),e.lineTo(a.x+1-u/2,a.y+1)),i[5]&&(e.moveTo(a.x+1,a.y-u/2+1),e.lineTo(a.x,a.y-u/2+1)),i[6]&&(e.moveTo(a.x+u/2,a.y+1),e.lineTo(a.x+u/2,a.y+1-u/2),e.lineTo(a.x,a.y+1-u/2)),i[7]&&(e.moveTo(a.x+u/2,a.y+1),e.lineTo(a.x+u/2,a.y)),e.strokeStyle="#00000040",e.stroke(),e.filter="none",e.restore()},v2:function(e,n,t,i,r){var o=1/8,a=new Map([[C.I,["#31c7ef","#48e0ff","#20b0e0"]],[C.O,["#f7d308","#ffec1c","#e8c000"]],[C.T,["#ad4d9c","#c658b4","#983888"]],[C.J,["#5a65ad","#6680cc","#4857a0"]],[C.L,["#ef7921","#ff9030","#e06810"]],[C.S,["#42b642","#48d048","#30a030"]],[C.Z,["#ef2029","#ff4848","#d01818"]]]),l=n,u=a.get(t);v(null!=u,"no color for piece"),e.save(),r==Z.ghost?(e.fillStyle="white",e.fillRect(l.x,l.y,1,1),e.globalAlpha=.4):r==Z.disabled&&(e.filter="grayscale(100%)"),e.translate(l.x,l.y);var c=o,f=o/2,d=1-o,s=1-o/2;e.fillStyle=u[0],e.fillRect(c,c,1-2*o,1-2*o),e.lineCap="butt",e.lineWidth=o,e.beginPath(),e.moveTo(f,d),e.lineTo(f,c),e.strokeStyle=i[7]?u[1]:u[0],e.stroke(),e.beginPath(),e.moveTo(c,f),e.lineTo(d,f),e.strokeStyle=i[1]?u[1]:u[0],e.stroke(),e.beginPath(),e.moveTo(0,f),e.lineTo(f,f),e.lineTo(f,0),e.strokeStyle=i[0]||i[7]||i[1]?u[1]:u[0],e.stroke(),e.beginPath(),e.moveTo(s,c),e.lineTo(s,d),e.strokeStyle=i[3]?u[2]:u[0],e.stroke(),e.beginPath(),e.moveTo(d,s),e.lineTo(c,s),e.strokeStyle=i[5]?u[2]:u[0],e.stroke(),e.beginPath(),e.moveTo(1,s),e.lineTo(s,s),e.lineTo(s,1),e.strokeStyle=i[4]||i[3]||i[5]?u[2]:u[0],e.stroke(),e.beginPath(),e.moveTo(s,0),e.lineTo(s,f),e.lineTo(1,f),e.strokeStyle=i[2]&&i[1]&&i[3]?u[0]:i[1]?u[1]:i[3]||i[2]?u[2]:u[0],e.stroke(),e.beginPath(),e.moveTo(f,1),e.lineTo(f,s),e.lineTo(0,s),e.strokeStyle=i[6]&&i[7]&&i[5]?u[0]:i[7]?u[1]:i[5]?u[2]:i[6]?u[1]:u[0],e.stroke(),e.filter="none",e.restore()}});(function(e){e[e["normal"]=0]="normal",e[e["ghost"]=1]="ghost",e[e["disabled"]=2]="disabled"})(Z||(Z={}));var N=256;function W(e,n,t){for(var i=n<<8,r=0;r<8;++r)e[r]&&(i|=1<<r);return s.scale(new s(i%N,Math.floor(i/N)),t)}function F(e,n,t){var i=(new TextEncoder).encode(n.toString());window.crypto.subtle.digest("SHA-256",i).then((function(i){var r=Array.from(new Uint8Array(i)).map((function(e){return e.toString(16).padStart(2,"0")})).join(""),o=localStorage.getItem("mfro:tetris-tilesheet");if(o){var a=JSON.parse(o);if(a.hash==r)return console.log("tilesheet hash match ".concat(r)),void t(a.list);console.log("tilesheet hash match ".concat(a.hash," expected ").concat(r))}var l=[Z.normal,Z.ghost,Z.disabled],u=document.createElement("canvas");u.width=e*N,u.height=e*l.length*(256/N);var f=u.getContext("2d");v(null!=f,"no context"),f.scale(e,e);var d,s=[],y=Object(c["a"])(C.all);try{for(y.s();!(d=y.n()).done;){var b=d.value;f.clearRect(0,0,u.width,u.height);var p,h=Object(c["a"])(l);try{for(h.s();!(p=h.n()).done;)for(var m=p.value,g=0;g<256;++g){for(var O=[],j=0;j<8;++j)O[j]=0!=(g&1<<j);var w=W(O,m,1);n(f,w,b,O,m)}}catch(_){h.e(_)}finally{h.f()}var x=u.toDataURL();s.push(x),s.length==C.all.length&&(localStorage.setItem("mfro:tetris-tilesheet",JSON.stringify({hash:r,list:s})),t(s))}}catch(_){y.e(_)}finally{y.f()}}))}var G=[new s(-1,-1),new s(0,-1),new s(1,-1),new s(1,0),new s(1,1),new s(0,1),new s(-1,1),new s(-1,0)];function K(e,n){var t=32,r=1/t,o=new Map;function a(e){return e.x<0||e.x>=n.rules.field_size.x||e.y<0||e.y>=n.rules.field_size.y?null:n.state.field[e.y][e.x]}function l(e,n,i,r){var a=o.get(n),l=W(i,r,t),u=new E["f"];return u.scale=new E["d"](1/t,1/t),u.texture=new E["g"](a,new E["e"](l.x,l.y,t,t)),u.position=new E["d"](e.x,e.y),u}var v=function(){function e(n){Object(f["a"])(this,e),this.container=n,this.sprites=[]}return Object(d["a"])(e,[{key:"clear",value:function(){var e,n=Object(c["a"])(this.sprites);try{for(n.s();!(e=n.n()).done;){var t=e.value;this.container.removeChild(t)}}catch(i){n.e(i)}finally{n.f()}this.sprites=[]}},{key:"draw_tetronimo",value:function(e,n){var t,i=this,r=e.kind.rotations[e.rotation],o=Object(c["a"])(e.kind.rotations[e.rotation]);try{var a=function(){var o=t.value,a=s.add(e.position,o),u=G.map((function(e){return r.every((function(n){return!s.eq(n,s.add(o,e))}))})),c=l(a,e.kind,u,n);i.sprites.push(c),i.container.addChild(c)};for(o.s();!(t=o.n()).done;)a()}catch(u){o.e(u)}finally{o.f()}}}]),e}();function y(e){var n=e().length,r=new E["b"];r.scale=new E["d"](t,t);var o=new E["c"];r.addChild(o),o.scale=new E["d"](1/32,1/32);var a=s.scale(new s(0,0),t),l=s.scale(new s(4,1+3*n),t),u=2,f=8;o.lineStyle(u,8421504,1,0),o.moveTo(a.x,a.y+f),o.lineTo(a.x,a.y),o.lineTo(a.x+f,a.y),o.moveTo(l.x-f,a.y),o.lineTo(l.x,a.y),o.lineTo(l.x,a.y+f),o.moveTo(l.x,l.y-f),o.lineTo(l.x,l.y),o.lineTo(l.x-f,l.y),o.moveTo(a.x+f,l.y),o.lineTo(a.x,l.y),o.lineTo(a.x,l.y-f);var d=new v(r);return Object(i["w"])(e,(function(e){d.clear();var n,t=new s(2,2),i=Object(c["a"])(e);try{for(i.s();!(n=i.n()).done;){var r=n.value;if(r){var o=H({id:-1,kind:r,position:s.zero,rotation:0}),a=o.reduce((function(e,n){return Math.min(e,n.x)}),1/0)+.5,l=o.reduce((function(e,n){return Math.min(e,n.y)}),1/0)+.5,u=o.reduce((function(e,n){return Math.max(e,n.x)}),-1/0)+.5,f=o.reduce((function(e,n){return Math.max(e,n.y)}),-1/0)+.5,v=new s(-(a+u)/2,-(l+f)/2),y=s.add(t,v);d.draw_tetronimo({id:-1,kind:r,position:y,rotation:0},Z.normal),t=s.add(t,new s(0,3))}}}catch(b){i.e(b)}finally{i.f()}}),{immediate:!0}),r}function b(e){e.beginFill(16777215),e.drawRect(0,0,n.rules.field_size.x,n.rules.field_size.y),e.endFill(),e.lineStyle(r,16053492);for(var t=0;t<n.rules.field_size.x;++t)e.moveTo(t+.5*r,0),e.lineTo(t+.5*r,n.rules.field_size.y),e.moveTo(t+1-.5*r,0),e.lineTo(t+1-.5*r,n.rules.field_size.y);for(var i=0;i<n.rules.field_size.y;++i)e.moveTo(0,i+.5*r),e.lineTo(n.rules.field_size.x,i+.5*r),e.moveTo(0,i+1-.5*r),e.lineTo(n.rules.field_size.x,i+1-.5*r)}var p=new E["a"]({view:e,width:t*(n.rules.field_size.x+12),height:t*(n.rules.field_size.y/2),transparent:!0}),h=performance.now();F(t,U.v2,(function(e){var n=performance.now();console.log(n-h),e.forEach((function(e,n){p.loader.add(n.toString(),e)})),p.loader.load()})),p.loader.onLoad.once((function(){for(var e=0;e<7;++e){var r=p.loader.resources[e].texture.baseTexture;o.set(C.all[e],r)}var c=new E["b"],f=new E["b"];f.scale=new E["d"](t,t),f.position=new E["d"](6*t,t*(-n.rules.field_size.y/2));var d=new E["c"];b(d);var h=y((function(){return[n.state.holding]}));h.position=new E["d"](1*t,1*t);var m=y((function(){return n.state.fall_queue.slice(0,5)}));m.position=new E["d"](t*(7+n.rules.field_size.x),1*t),f.addChild(d),c.addChild(f),c.addChild(m),c.addChild(h),p.stage.addChild(c);for(var g=function(e){for(var t=function(t){var r=new s(e,t),o=null;Object(i["x"])((function(){null!=o&&(f.removeChild(o),o=null);var i=n.state.field[t][e];if(null!=i){var u=G.map((function(e){var n;return(null===(n=a(s.add(r,e)))||void 0===n?void 0:n.id)!=i.id}));o=l(new s(e,t),i.kind,u,Z.normal),f.addChild(o)}}))},r=0;r<n.rules.field_size.y;++r)t(r)},O=0;O<n.rules.field_size.x;++O)g(O);var j=new v(f);Object(i["x"])((function(){if(j.clear(),n.state.falling){var e=n.hard_drop_position(n.state.falling),t=Object(u["a"])(Object(u["a"])({},n.state.falling),{},{position:e});j.draw_tetronimo(t,Z.ghost),j.draw_tetronimo(n.state.falling,Z.normal)}}))}))}function H(e){return e.kind.rotations[e.rotation].map((function(n){return s.add(e.position,n)}))}function B(e){for(var n=[],t=0;t<e.field_size.x;++t)n[t]=null;return n}function Q(e){for(var n=[],t=0;t<e.field_size.y;++t)n[t]=B(e);return n}function X(e){return{field:Q(e),falling:null,fall_queue:[],holding:null,hold_available:!0}}function Y(e){var n=e.falling;return Object(i["p"])({field:e.field.map((function(e){return Object(i["t"])(e)})),falling:Object(i["j"])((function(e,t){return{get:function(){return e(),n},set:function(e){n=e&&Object(i["t"])(e),t()}}})),fall_queue:Object(i["t"])([]),holding:Object(i["u"])(null),hold_available:!0})}function $(e,n,t){var i=new s(0,1),r=0,o=0,a=0,l=!1,f=!1,d=!1,k=0,T=0,S=!1;function D(){var n;if(t.fall_queue.length-1<e.bag_preview){var i=C.all.slice();while(i.length>0){var o=Math.floor(Math.random()*i.length),l=i.splice(o,1)[0];t.fall_queue.push(l)}}var u=t.fall_queue.shift(),c=new s(5-Math.ceil(u.size/2),e.field_size.y/2-2),f=0;t.falling={id:r++,kind:u,position:c,rotation:f},t.hold_available=!0,a=null!==(n=e.move_reset_limit)&&void 0!==n?n:1/0,P(t.falling)?(console.log("collide",t.falling),t.falling=null,S=!0,clearInterval(F)):J()}function P(n){var i,r=Object(c["a"])(H(n));try{for(r.s();!(i=r.n()).done;){var o=i.value;if(o.x<0||o.x>=e.field_size.x||o.y>=e.field_size.y)return!0;if(!(o.y<0)){var a=t.field[o.y][o.x];if(null!=a)return!0}}}catch(l){r.e(l)}finally{r.f()}return!1}function L(e){var n=e.position;while(1){var t=s.add(n,i);if(P(Object(u["a"])(Object(u["a"])({},e),{},{position:t})))break;n=t}return n}function I(){if(null!=t.falling){var e,n=Object(c["a"])(H(t.falling));try{for(n.s();!(e=n.n()).done;){var i=e.value;t.field[i.y][i.x]={id:t.falling.id,kind:t.falling.kind}}}catch(r){n.e(r)}finally{n.f()}D()}}function q(e){var n=s.add(e.position,i);return P(Object(u["a"])(Object(u["a"])({},e),{},{position:n}))}function J(){if(!t.falling)return!1;o=0;var n,r=s.add(t.falling.position,i);return!P(Object(u["a"])(Object(u["a"])({},t.falling),{},{position:r}))&&(t.falling.position=r,a=null!==(n=e.move_reset_limit)&&void 0!==n?n:1/0,!0)}function R(){null!=t.falling&&q(t.falling)&&a>0&&(a-=1,o=0)}function A(){var e,n;if(!S){var i=t.holding;t.holding=null!==(e=null===(n=t.falling)||void 0===n?void 0:n.kind)&&void 0!==e?e:null,i&&t.fall_queue.unshift(i),D(),t.hold_available=!1}}function Z(e){if(!S&&null!=t.falling){var i=s.add(t.falling.position,new s(e,0));P(Object(u["a"])(Object(u["a"])({},t.falling),{},{position:i}))||(t.falling.position=i,n.autoshift&&(T=l?n.autoshift.delay:n.autoshift.initial_delay,l=!0),R())}}function E(n){if(!S&&null!=t.falling){var i=(t.falling.rotation+n)%4;i<0&&(i+=4);var r,o=e.wall_kicks.get(t.falling.kind);v(null!=o,"no kick info for piece"),r=1==n?o[2*t.falling.rotation]:o[2*i+1];var a,l=Object(c["a"])(r);try{for(l.s();!(a=l.n()).done;){var f=a.value,d=s.add(t.falling.position,f);if(!P(Object(u["a"])(Object(u["a"])({},t.falling),{},{position:d,rotation:i})))return t.falling.position=d,t.falling.rotation=i,void R()}}catch(y){l.e(y)}finally{l.f()}}}function U(){S||null==t.falling||(t.falling.position=L(t.falling),I())}function N(e){S||null==t.falling||(l=!1,1==e?d=!0:f=!0,k=e,Z(e))}function W(e){S||null==t.falling||(1==e?d=!1:f=!1,n.autoshift&&k==e&&(T=l?n.autoshift.delay:n.autoshift.initial_delay),k=f?-1:d?1:0)}D(),M(j,(function(){return E(-1)})),M(O,(function(){return E(-1)})),M(x,(function(){return E(1)})),M(w,(function(){return E(1)})),M(p,(function(){return E(1)})),V(b,(function(){return W(-1)})),M(b,(function(){return N(-1)})),V(g,(function(){return W(1)})),M(g,(function(){return N(1)})),M(m,(function(){return J()})),M(y,(function(){return U()})),M(_,(function(){return t.hold_available&&A()})),M(h,(function(){return t.hold_available&&A()}));var F=setInterval(G,1e3/60);function G(){T>0?T-=1:n.autoshift&&0!=k&&Z(k);while(t.falling){var r=void 0;if(r=q(t.falling)?e.lock_delay:z(m)?e.fall_delay/n.soft_drop:e.fall_delay,o<r)break;var l,c=s.add(t.falling.position,i);if(P(Object(u["a"])(Object(u["a"])({},t.falling),{},{position:c})))o=0,I();else t.falling.position=c,a=null!==(l=e.move_reset_limit)&&void 0!==l?l:1/0,o-=r}o+=1;for(var f=0,d=0;d<e.field_size.y;++d)if(t.field[d].every((function(e){return null!=e}))){for(var v=d;v>0;--v)Object.assign(t.field[v],t.field[v-1]);Object.assign(t.field[0],B(e)),f+=1}f>0&&console.log("cleared ".concat(f," lines"))}return{rules:e,state:t,hard_drop_position:L}}function ee(e){var n={field_size:new s(10,40),fall_delay:30,lock_delay:30,move_reset_limit:15,wall_kicks:D.asira,bag_preview:5},t={autoshift:{delay:2,initial_delay:10},soft_drop:10},i=Y(X(n)),r=$(n,t,i);K(e,r)}var ne=Object(i["h"])("Game Rules");function te(e,n,t,r,o,a){var l=Object(i["r"])("v-text"),u=Object(i["r"])("config-rational"),c=Object(i["r"])("v-flex"),f=Object(i["r"])("v-card");return Object(i["m"])(),Object(i["f"])(f,null,{title:Object(i["y"])((function(){return[Object(i["i"])(l,{title:""},{default:Object(i["y"])((function(){return[ne]})),_:1})]})),default:Object(i["y"])((function(){return[Object(i["i"])(c,{column:"",class:"pa-4"},{default:Object(i["y"])((function(){return[Object(i["i"])(u,{name:"Drop Delay",description:"Drop delay for falling pieces (frames per tile)",modelValue:r.rules.fall_delay,"onUpdate:modelValue":n[1]||(n[1]=function(e){return r.rules.fall_delay=e})},null,8,["modelValue"]),Object(i["i"])(u,{name:"Lock Delay",description:"Delay after hitting the floor before a piece locks down (frames)",modelValue:r.rules.lock_delay,"onUpdate:modelValue":n[2]||(n[2]=function(e){return r.rules.lock_delay=e})},null,8,["modelValue"])]})),_:1})]})),_:1})}t("a4d3"),t("e01a"),t("b0c0");var ie=Object(i["h"])(" / ");function re(e,n,t,r,o,a){var l=Object(i["r"])("v-text"),u=Object(i["r"])("v-flex"),c=Object(i["r"])("v-text-field");return Object(i["m"])(),Object(i["f"])(u,{column:"",class:"mt-4"},{default:Object(i["y"])((function(){return[Object(i["i"])(u,{"align-baseline":""},{default:Object(i["y"])((function(){return[Object(i["i"])(l,null,{default:Object(i["y"])((function(){return[Object(i["h"])(Object(i["v"])(t.name),1)]})),_:1}),Object(i["i"])(u,{grow:"",class:"mx-4"}),Object(i["i"])(l,null,{default:Object(i["y"])((function(){return[Object(i["h"])(Object(i["v"])(t.description),1)]})),_:1})]})),_:1}),Object(i["i"])(u,null,{default:Object(i["y"])((function(){return[Object(i["i"])(u,{class:"mt-4",column:"","justify-center":""},{default:Object(i["y"])((function(){return[Object(i["i"])(l,null,{default:Object(i["y"])((function(){return[Object(i["h"])(Object(i["v"])(t.modelValue),1)]})),_:1})]})),_:1}),Object(i["i"])(u,{grow:"",class:"mx-4"}),Object(i["i"])(c,{solo:"",small:"",modelValue:r.top,"onUpdate:modelValue":n[1]||(n[1]=function(e){return r.top=e})},null,8,["modelValue"]),Object(i["i"])(u,{class:"mt-4 mx-2",column:"","justify-center":""},{default:Object(i["y"])((function(){return[Object(i["i"])(l,{title:""},{default:Object(i["y"])((function(){return[ie]})),_:1})]})),_:1}),Object(i["i"])(c,{solo:"",small:"",modelValue:r.bot,"onUpdate:modelValue":n[2]||(n[2]=function(e){return r.bot=e})},null,8,["modelValue"])]})),_:1})]})),_:1})}t("a9e3");var oe={name:"config-rational",emits:["update:modelValue"],props:{name:String,description:String,modelValue:Number},setup:function(e,n){var t=n.emit,r=Object(i["d"])({get:function(){return e.modelValue>1?e.modelValue.toString():"1"},set:function(e){var n=parseInt(e);t("update:modelValue",n)}}),o=Object(i["d"])({get:function(){return e.modelValue<1?(1/e.modelValue).toString():"1"},set:function(e){var n=parseInt(e);t("update:modelValue",1/n)}});return{top:r,bot:o}}};oe.render=re;var ae=oe,le={name:"config-game-rules",components:{configRational:ae},setup:function(){var e=Object(i["t"])({field_size:new s(10,40),fall_delay:30,lock_delay:30,move_reset_limit:15,wall_kicks:D.asira,bag_preview:5});return{rules:e}}};le.render=te;var ue=le,ce={name:"tetris",components:{configGameRules:ue},setup:function(){var e=Object(i["u"])();return Object(i["l"])((function(){ee(e.value)})),{canvas:e}}};t("0922"),t("6ee5");ce.render=l,ce.__scopeId="data-v-52d46b64";var fe=ce;Object(i["e"])(fe).use(r["a"]).mount("#app")},ea56:function(e,n,t){}});
//# sourceMappingURL=index.5015db37.js.map