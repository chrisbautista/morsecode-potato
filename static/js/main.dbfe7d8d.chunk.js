(this.webpackJsonpmorsecode=this.webpackJsonpmorsecode||[]).push([[0],{12:function(e,n,t){e.exports=t(21)},17:function(e,n,t){},18:function(e,n,t){},21:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t.n(r),o=t(8),i=t.n(o),c=(t(17),t(1)),l=(t(18),t(2)),u=t(3);var d={".-":"A","-...":"B","-.-.":"C","-..":"D",".":"E","..-.":"F","--.":"G","....":"H","..":"I",".---":"J","-.-":"K",".-..":"L","--":"M","-.":"N","---":"O",".--.":"P","--.-":"Q",".-.":"R","...":"S","-":"T","..-":"U","...-":"V",".--":"W","-..-":"X","-.--":"Y","--..":"Z","-----":"0",".----":"1","..---":"2","...--":"3","....-":"4",".....":"5","-....":"6","--...":"7","---..":"8","----.":"9","..--..":".","._.--":",","-.- . .":":","-..-.":"?","..-. .-..":"'","... .-..":"-","..- -":"/","..... -.":"(","..... .. ..":")","..-. -.":'"',". ...":"&","---.":"!","... ..":";"},s={HELP:"SOS","I SAY AGAIN":"II",CONFIRM:"CFM",REPORT:"RPT","REPEAT PLEASE":"RPT","I REPEAT AS FOLLOWS":"RPT","YES; CORRECT":"C",FROM:"FM","THIS IS":"DE",DISTANCE:"DX","INVITATION TO TRANSMIT":"K"},p=Object.values(d),f=Object.keys(d),m=Object.keys(s).sort((function(e,n){return n.length-e.length}));function h(e){if(" "===e)return"/";var n=p.indexOf(e.toUpperCase());return-1===n&&" "!==e?"":f[n]}function b(e){if("string"!==typeof e)return"invalid msg";var n=e.split("").map(h);return"".concat(n.join(" "))}function g(e){if(!e||"string"!==typeof e)return"";var n=e.toUpperCase();return m.forEach((function(e){-1!==n.indexOf(e)&&(n=n.replace(e,s[e]))})),n}function v(){var e=Object(c.a)(["\n  th {\n    background-color: #ddd;\n  }\n  td,\n  th {\n    text-align: left;\n    border: 1px solid #ddd;\n    padding: 4px;\n  }\n"]);return v=function(){return e},e}function E(){var e=Object(c.a)(["\n  font-size: 0.75rem;\n  margin-top: 2rem;\n  width: auto;\n  height: 200px;\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  display: inline-block;\n  padding: 5px 8px;\n"]);return E=function(){return e},e}function x(){var e=Object(c.a)(["\n  margin-top: 1.2rem;\n  display: block;\n"]);return x=function(){return e},e}function w(){var e=Object(c.a)(["\n  display: inline-block;\n  padding: 0 8px;\n  font-size: 0.875rem;\n"]);return w=function(){return e},e}function O(){var e=Object(c.a)(["\n  border: 1px solid #ddd;\n  font-weight: bolder;\n  background-color: #ededed;\n"]);return O=function(){return e},e}function k(){var e=Object(c.a)(["\n  border: 1px solid red;\n  font-size: 0.875rem;\n"]);return k=function(){return e},e}function j(){var e=Object(c.a)(["\n  border: 1px solid #ddd;\n  padding: 1rem;\n  width: 100%;\n  margin: 8px 0 0;\n  border-radius: 3px;\n  height: 160px;\n"]);return j=function(){return e},e}var y=l.a.textarea(j()),S=Object(l.a)(y)(k()),A=Object(l.a)(y)(O()),C=l.a.span(w()),R=l.a.label(x()),T=l.a.div(E()),M=l.a.table(v()),I="Message",P="Morse code",N="Nothing like potatoes.",W="Replace with abbreviations.(see list at the bottom)",F="Phrase",L="Abbreviation",U=function(){var e=Object(r.useState)(!1),n=Object(u.a)(e,2),t=n[0],o=n[1],i=function(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],t=Object(r.useState)(e),a=Object(u.a)(t,2),o=a[0],i=a[1],c=Object(r.useState)(""),l=Object(u.a)(c,2),d=l[0],s=l[1];function p(e){return e?e.toUpperCase().trim():""}return Object(r.useEffect)((function(){var e=p(o),t=n?g(e):e;t!==e&&i(t),s(b(t))}),[o,n]),{message:o,translated:d,setMessage:i}}(N,t),c=i.message,l=i.translated,d=i.setMessage;return a.a.createElement("div",null,a.a.createElement("label",{htmlFor:"mpMessageBox"},I),a.a.createElement(S,{id:"mpMessageBox",value:c,onChange:function(e){return d(e.target.value)}}),a.a.createElement("div",null,a.a.createElement("label",null,a.a.createElement("input",{type:"checkbox",value:1,checked:t,onChange:function(e){o(e.target.checked)}}),a.a.createElement(C,null,W))),a.a.createElement(R,{htmlFor:"mpMorsecodeBox"},P),a.a.createElement(A,{id:"mpMorsecodeBox",value:l,readOnly:!0}),a.a.createElement("div",null,function(){var e=Object.keys(s).map((function(e){var n=e.toLowerCase();return n=n.charAt(0).toUpperCase()+n.slice(1),a.a.createElement("tr",{key:"abbrev"+e},a.a.createElement("td",null,s[e]),a.a.createElement("td",null,n))}));return a.a.createElement(T,null,a.a.createElement(M,null,a.a.createElement("thead",null,a.a.createElement("tr",null,a.a.createElement("th",null,L),a.a.createElement("th",null,F))),a.a.createElement("tbody",null,e)))}()))};function B(){var e=Object(c.a)(["\n  display: inline-block;\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 1rem;\n  background-color: yellow;\n  border: 1px solid #ddd;\n  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.3);\n\n  @media screen and (max-width: 840px) {\n    width: 80px;\n    font-size: 0.75rem;\n    padding: 5px;\n    text-align: right;\n    transform: rotate(45deg);\n    top: 25px;\n  }\n"]);return B=function(){return e},e}function z(){var e=Object(c.a)(["\n  padding: 4rem;\n  margin: 0 auto;\n  max-width: 1200px;\n  @media screen and (max-width: 840px) {\n    padding: 1rem;\n  }\n"]);return z=function(){return e},e}var D=l.a.div(z()),H=l.a.a(B());function J(){return a.a.createElement(H,{href:"https://github.com/chrisbautista/morsecode-potato"},"codespud @ github")}var Y=function(){return a.a.createElement(D,null,a.a.createElement("h1",null,"Morsecode-Potato"),a.a.createElement(U,null),a.a.createElement(J,null))},G=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function K(e,n){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var t=e.installing;null!=t&&(t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),n&&n.onUpdate&&n.onUpdate(e)):(console.log("Content is cached for offline use."),n&&n.onSuccess&&n.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}i.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(Y,null)),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/morsecode-potato",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var n="".concat("/morsecode-potato","/service-worker.js");G?(!function(e,n){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(t){var r=t.headers.get("content-type");404===t.status||null!=r&&-1===r.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):K(e,n)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(n,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):K(n,e)}))}}()}},[[12,1,2]]]);
//# sourceMappingURL=main.dbfe7d8d.chunk.js.map