!function(e){var t={};function o(i){if(t[i])return t[i].exports;var a=t[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=e,o.c=t,o.d=function(e,t,i){o.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},o.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=4)}([function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var mobile=!1,viewportWidth=window.innerWidth,isMobile=viewportWidth<700,allData=null,keyObjectJobName={},keyObjectJobNumber={},keyObjectJobAuto={},keyObjectJobWage={},keyObjectSkillName={},selectedJobSkills=[0,0,0,0,0],skills=[];function numberWithCommas(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function selectJobData(e,t){return e.filter(function(e){return e.id_selected===t})}function setupXScale(e){return d3.scaleLinear().domain(d3.extent(e,function(e){return e.similarity})).range([0,800])}function compare(e,t){return e.imp<t.imp?1:e.imp>t.imp?-1:0}function resize(){}function init(){var _d,MAX_AUTO=1,MIN_AUTO=0,pathData="assets/data/",fileNames=["crosswalk_jobs","similarity","crosswalk_skills","skills"],files=[];fileNames.forEach(function(e){files.push(pathData+e+".csv")}),(_d=d3).loadData.apply(_d,files.concat([function(err,response){var crosswalk=response[0],similarity=response[1],crosswalkSkills=response[2];skills=response[3],crosswalk.forEach(function(e){e.id=+e.id,e.auto=+e.auto,e.wage=+e.wage,e.number=+e.number}),similarity.forEach(function(e){e.similarity=+e.similarity,e.id_compared=+e.id_compared,e.id_selected=+e.id_selected}),skills.forEach(function(e){e.id_selected=+e.id_selected,e.imp=+e.imp,e.skill_id=+e.skill_id,e.rank=+e.rank}),crosswalkSkills.forEach(function(e){e.skill_id=+e.skill_id}),allData=similarity;var jobSelector=d3.select("body").append("div.job-selector"),currentJobName=d3.select("body").append("div.job-selected-name"),jobSelectedNumber=d3.select("body").append("div.job-selected-number"),chartSvg=d3.select("body").append("div.svg-container").append("svg.scatter");chartSvg.at("height",600).at("width",800).st("fill","#00000");var selectedJobData=selectJobData(similarity,415),yScale=d3.scaleLinear().domain([MIN_AUTO,MAX_AUTO]).range([0,600]),xScale=setupXScale(selectedJobData),colorScale=d3.scaleLinear().domain([5,2,1.25,1.1,.9,.75,.5,.2]).range(["#a50026","#d73027","#f46d43","#fee090","#e0f3f8","#74add1","#4575b4","#313695"]),radiusScale=d3.scaleSqrt().domain([0,d3.max(crosswalk,function(e){return e.wage})]).range([0,6]);crosswalk.forEach(function(e){keyObjectJobName[e.id]=e.job_name}),crosswalk.forEach(function(e){keyObjectJobNumber[e.id]=e.number}),crosswalk.forEach(function(e){keyObjectJobAuto[e.id]=e.auto}),crosswalk.forEach(function(e){keyObjectJobWage[e.id]=e.wage}),crosswalkSkills.forEach(function(e){return keyObjectSkillName[e.skill_id]=e.skill});var jobDropdownMenu=d3.select("div.job-selector").append("select.scatter-dropdown-menu"),jobButtons=jobDropdownMenu.selectAll("option.job-button").data(crosswalk).enter().append("option.job-button").at("value",function(e){return e.id});jobButtons.text(function(e){return e.job_name}),jobDropdownMenu.on("change",function(d,i,n){var selectedJobID=eval(d3.select(n[i]).property("value"));console.log(selectedJobID);var updatedData=selectJobData(allData,selectedJobID),xScale=setupXScale(updatedData);d3.selectAll("circle.job").remove();var jobCircles=d3.select("svg.scatter").selectAll("circle.job").data(updatedData).enter().append("circle.job");jobCircles.at("cx",function(e){return xScale(e.similarity)}).at("cy",function(e){return yScale(keyObjectJobAuto[e.id_compared])}).st("fill",function(e){var t=keyObjectJobWage[e.id_selected],o=keyObjectJobWage[e.id_compared];return colorScale(t/o)}).at("r",function(e){var t=keyObjectJobNumber[e.id_compared];return radiusScale(t)}).st("stroke","black"),jobCircles.on("mouseenter",function(e,t,o){var i=d3.select("div.jobTooltip");i.st("visibility","visible");var a=d3.select(o[t]).at("cx"),r=d3.select(o[t]).at("cy");i.st("left",a+"px").st("top",r+"px"),selectedJobSkills=(selectedJobSkills=selectJobData(skills,e.id_compared)).sort(compare),d3.select("div.job-selected-name").text("Main job: "+keyObjectJobName[e.id_selected]),d3.select("div.job-compared-name").text("Compared job: "+keyObjectJobName[e.id_compared]),d3.select("div.job-selected-number").text("Main job quantity: "+numberWithCommas(keyObjectJobNumber[e.id_selected])),d3.select("div.job-compared-number").text("Compared job quantity: "+numberWithCommas(keyObjectJobNumber[e.id_compared]));var n=i.select("div.job-skills-container"),l=(n.selectAll("div.bar-container"),n.selectAll("div.job-bar-name").data(selectedJobSkills)),c=n.selectAll("div.job-bar").data(selectedJobSkills),s=n.selectAll("div.job-bar-value").data(selectedJobSkills);console.log(selectedJobSkills),c.st("height","20px").st("width",function(e){return e.imp+"px"}).st("background","black"),l.text(function(e){return keyObjectSkillName[e.skill_id]}),s.text(function(e){return e.imp})}).on("mouseleave",function(){jobTooltip.st("visibility","hidden")})});var jobCircles=chartSvg.selectAll("circle.job").data(selectedJobData).enter().append("circle.job");jobCircles.at("cx",function(e){return xScale(e.similarity)}).at("cy",function(e){return yScale(keyObjectJobAuto[e.id_compared])}).at("r",function(e){var t=keyObjectJobNumber[e.id_compared];return radiusScale(t)}).st("stroke","black").st("fill",function(e){var t=keyObjectJobWage[e.id_selected],o=keyObjectJobWage[e.id_compared];return colorScale(t/o)});var jobTooltip=d3.select("div.svg-container").append("div.jobTooltip"),jobSelectedName=d3.select("div.job-selected-name"),jobComparedName=jobTooltip.append("div.job-compared-name"),jobComparedNumber=jobTooltip.append("div.job-compared-number"),jobSkillsContainer=jobTooltip.append("div.job-skills-container"),jobSkillsBarRow=jobSkillsContainer.selectAll("div.job-bar-container").data(selectedJobSkills).enter().append("div.bar-container"),jobSkillsNames=jobSkillsBarRow.append("div.job-bar-name").data(selectedJobSkills).enter(),jobSkillsBars=jobSkillsBarRow.append("div.job-bar").data(selectedJobSkills).enter(),jobSkillsValues=jobSkillsBarRow.append("div.job-bar-value").data(selectedJobSkills).enter();jobCircles.on("mouseenter",function(e,t,o){selectedJobSkills=(selectedJobSkills=selectJobData(skills,e.id_compared)).sort(compare);var i=d3.select("div.jobTooltip");i.st("visibility","visible");var a=d3.select(o[t]).at("cx"),r=d3.select(o[t]).at("cy");i.st("left",a+"px").st("top",r+"px"),d3.select("div.job-selected-name").text("Main job: "+keyObjectJobName[e.id_selected]),d3.select("div.job-compared-name").text("Compared job: "+keyObjectJobName[e.id_compared]),d3.select("div.job-selected-number").text("Main job quantity: "+numberWithCommas(keyObjectJobNumber[e.id_selected])),d3.select("div.job-compared-number").text("Compared job quantity: "+numberWithCommas(keyObjectJobNumber[e.id_compared]));var n=i.select("div.job-skills-container"),l=(n.selectAll("div.bar-container"),n.selectAll("div.job-bar-name").data(selectedJobSkills)),c=n.selectAll("div.job-bar").data(selectedJobSkills),s=n.selectAll("div.job-bar-value").data(selectedJobSkills);console.log(selectedJobSkills),c.st("height","20px").st("width",function(e){return e.imp+"px"}).st("background","black"),l.text(function(e){return keyObjectSkillName[e.skill_id]}),s.text(function(e){return e.imp})}).on("mouseleave",function(){jobTooltip.st("visibility","hidden")})}]))}exports.default={init:init,resize:resize}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={android:function(){return navigator.userAgent.match(/Android/i)},blackberry:function(){return navigator.userAgent.match(/BlackBerry/i)},ios:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},opera:function(){return navigator.userAgent.match(/Opera Mini/i)},windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return i.android()||i.blackberry()||i.ios()||i.opera()||i.windows()}};t.default=i},function(e,t){var o;o=function(){return this}();try{o=o||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(o=window)}e.exports=o},function(e,t,o){(function(t){var o=NaN,i="[object Symbol]",a=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,n=/^0b[01]+$/i,l=/^0o[0-7]+$/i,c=parseInt,s="object"==typeof t&&t&&t.Object===Object&&t,d="object"==typeof self&&self&&self.Object===Object&&self,b=s||d||Function("return this")(),u=Object.prototype.toString,p=Math.max,f=Math.min,m=function(){return b.Date.now()};function j(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function v(e){if("number"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&u.call(e)==i}(e))return o;if(j(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=j(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(a,"");var s=n.test(e);return s||l.test(e)?c(e.slice(2),s?2:8):r.test(e)?o:+e}e.exports=function(e,t,o){var i,a,r,n,l,c,s=0,d=!1,b=!1,u=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function k(t){var o=i,r=a;return i=a=void 0,s=t,n=e.apply(r,o)}function y(e){var o=e-c;return void 0===c||o>=t||o<0||b&&e-s>=r}function S(){var e=m();if(y(e))return _(e);l=setTimeout(S,function(e){var o=t-(e-c);return b?f(o,r-(e-s)):o}(e))}function _(e){return l=void 0,u&&i?k(e):(i=a=void 0,n)}function h(){var e=m(),o=y(e);if(i=arguments,a=this,c=e,o){if(void 0===l)return function(e){return s=e,l=setTimeout(S,t),d?k(e):n}(c);if(b)return l=setTimeout(S,t),k(c)}return void 0===l&&(l=setTimeout(S,t)),n}return t=v(t)||0,j(o)&&(d=!!o.leading,r=(b="maxWait"in o)?p(v(o.maxWait)||0,t):r,u="trailing"in o?!!o.trailing:u),h.cancel=function(){void 0!==l&&clearTimeout(l),s=0,i=c=a=l=void 0},h.flush=function(){return void 0===l?n:_(m())},h}}).call(this,o(2))},function(e,t,o){"use strict";var i=n(o(3)),a=n(o(1)),r=n(o(0));function n(e){return e&&e.__esModule?e:{default:e}}var l=d3.select("body"),c=0;l.classed("is-mobile",a.default.any()),window.addEventListener("resize",(0,i.default)(function(){var e=l.node().offsetWidth;c!==e&&(c=e,r.default.resize())},150)),r.default.init()}]);