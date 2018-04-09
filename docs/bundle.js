!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),window.innerWidth;var r=null,i={},o={},a={},c={};function u(e,t){return e.filter(function(e){return e.id_selected===t})}function d(e){return d3.scaleLinear().domain(d3.extent(e,function(e){return e.similarity})).range([0,800])}t.default={init:function(){var e,t=[];["crosswalk","similarity"].forEach(function(e){t.push("assets/data/"+e+".csv")}),(e=d3).loadData.apply(e,t.concat([function(e,t){var n=t[0],f=t[1];n.forEach(function(e){e.id=+e.id,e.auto=+e.auto,e.wage=+e.wage,e.number=+e.number}),f.forEach(function(e){e.similarity=+e.similarity,e.id_compared=+e.id_compared,e.id_selected=+e.id_selected}),r=f;var l=d3.select("body").append("svg.scatter");l.at("height",600).at("width",800).st("fill","#00000");var s=u(f.filter(function(e){return e.id_selected<5}),3),p=d3.scaleLinear().domain([0,1]).range([0,600]),b=d(s);n.forEach(function(e){i[e.id]=e.job_name}),n.forEach(function(e){o[e.id]=e.number}),n.forEach(function(e){a[e.id]=e.auto}),n.forEach(function(e){c[e.id]=e.wage}),d3.selectAll("div.job-button").data(n).enter().append("div.job-button").st("height",20).st("width",500).text(function(e){return e.job_name}).on("click",function(e){var t=e.id,n=u(r,t),i=d(n);d3.selectAll("circle.job").remove();var o=d3.select("svg.scatter").selectAll("circle.job").data(n).enter().append("circle.job");console.log(n),o.at("cx",function(e){return i(e.similarity)}).at("cy",function(e){return p(a[e.id_compared])}).at("r",function(e){return 5}).st("stroke","black").st("fill","white")});var v=l.selectAll("circle.job").data(s).enter().append("circle.job");v.at("cx",function(e){return b(e.similarity)}).at("cy",function(e){return p(a[e.id_compared])}).at("r",function(e){return 5}).st("stroke","black").st("fill","white"),d3.select("body").append("div.job-selected-name"),d3.select("body").append("div.job-compared-name"),d3.select("body").append("div.job-selected-number"),d3.select("body").append("div.job-compared-number"),v.on("mouseenter",function(e){d3.select("div.job-selected-name").text("Main job: "+i[e.id_selected]),d3.select("div.job-compared-name").text("Compared job: "+i[e.id_compared]),d3.select("div.job-selected-number").text("Main job quantity: "+o[e.id_selected]),d3.select("div.job-compared-number").text("Compared job quantity: "+o[e.id_compared])})}]))},resize:function(){}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={android:function(){return navigator.userAgent.match(/Android/i)},blackberry:function(){return navigator.userAgent.match(/BlackBerry/i)},ios:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},opera:function(){return navigator.userAgent.match(/Opera Mini/i)},windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return r.android()||r.blackberry()||r.ios()||r.opera()||r.windows()}};t.default=r},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){(function(t){var n=NaN,r="[object Symbol]",i=/^\s+|\s+$/g,o=/^[-+]0x[0-9a-f]+$/i,a=/^0b[01]+$/i,c=/^0o[0-7]+$/i,u=parseInt,d="object"==typeof t&&t&&t.Object===Object&&t,f="object"==typeof self&&self&&self.Object===Object&&self,l=d||f||Function("return this")(),s=Object.prototype.toString,p=Math.max,b=Math.min,v=function(){return l.Date.now()};function m(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function y(e){if("number"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&s.call(e)==r}(e))return n;if(m(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=m(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(i,"");var d=a.test(e);return d||c.test(e)?u(e.slice(2),d?2:8):o.test(e)?n:+e}e.exports=function(e,t,n){var r,i,o,a,c,u,d=0,f=!1,l=!1,s=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function j(t){var n=r,o=i;return r=i=void 0,d=t,a=e.apply(o,n)}function h(e){var n=e-u;return void 0===u||n>=t||n<0||l&&e-d>=o}function g(){var e=v();if(h(e))return w(e);c=setTimeout(g,function(e){var n=t-(e-u);return l?b(n,o-(e-d)):n}(e))}function w(e){return c=void 0,s&&r?j(e):(r=i=void 0,a)}function _(){var e=v(),n=h(e);if(r=arguments,i=this,u=e,n){if(void 0===c)return function(e){return d=e,c=setTimeout(g,t),f?j(e):a}(u);if(l)return c=setTimeout(g,t),j(u)}return void 0===c&&(c=setTimeout(g,t)),a}return t=y(t)||0,m(n)&&(f=!!n.leading,o=(l="maxWait"in n)?p(y(n.maxWait)||0,t):o,s="trailing"in n?!!n.trailing:s),_.cancel=function(){void 0!==c&&clearTimeout(c),d=0,r=u=i=c=void 0},_.flush=function(){return void 0===c?a:w(v())},_}}).call(this,n(2))},function(e,t,n){"use strict";var r=a(n(3)),i=a(n(1)),o=a(n(0));function a(e){return e&&e.__esModule?e:{default:e}}var c=d3.select("body"),u=0;c.classed("is-mobile",i.default.any()),window.addEventListener("resize",(0,r.default)(function(){var e=c.node().offsetWidth;u!==e&&(u=e,o.default.resize())},150)),o.default.init()}]);