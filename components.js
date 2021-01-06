const COMPONENTS={repoItem:async function(e,t){let n="";e.topics.length>0&&(n+=e.topics.map(e=>`<span class="topic badge badge-secondary mr-1 mt-1 px-2 uk-text-bold">#${e}</span>`));let l=$(`\n            <div>\n                <div id="${e.name}" class="repo-item uk-card uk-card-default uk-card-body uk-border-rounded uk-card-${t} shadow">\n                    <div class="d-flex flex-row">\n                        <h5 class="p-0">${e.name.replace(/_/g,"-")}</h5>\n                        <i class="link ml-2 rounded rounded-circle" uk-tooltip="Copy repository URL"></i>\n                    </div>\n                    ${null===e.description?"No description":`<p class="uk-text-truncate">${e.description}</p>`}\n                    ${e.topics.length>0?`<div class="mt-2 p-0">${n.replace(/,/g,"")}</div>`:""}\n                </div>\n            </div>\n        `);return l.find(".repo-item").data(e),l.find(".link").click(function(t){t.stopPropagation();let n=$("#copy-placeholder");n.val(e.html_url),n[0].focus(),n[0].select(),n[0].setSelectionRange(0,99999),document.execCommand("copy"),n[0].blur(),UIkit.notification("<p class='uk-text-normal uk-text-small uk-text-center p-2 m-0'>Link copied</p>",{pos:"bottom-center",timeout:1e3,status:"success"})}),l.click(function(){setModalContent(e),UIkit.modal($("#modal")).show(),document.title=`Dandy Cheng - ${e.name}`}),l},tag:function(e){return`<span class="uk-label uk-label-warning text-dark uk-text-capitalize uk-text-normal mr-2 mt-1">${e}</span>`},treeNode:function(e,t){let n=/\.\w+$/;let l=$(`\n            <div id="${e.sha}" class="d-node d-flex flex-column ${"tree"===e.type?"folder":""}">\n                <div class="d-flex flex-row">\n                    ${t?'<i class="d-icon" draggable="false"></i>':""}\n                    <i class="path-type mr-2" style="background-image:url(assets/svg/${function(e){n.test(e)&&(e=e.match(n)[0]);let t={"image.svg":["png","jpg","jpeg","svg"],"file.svg":["file"]};for(let n in t)if(t[n].includes(e))return n;return n.test(e)?"file.svg":"folder.svg"}(e.type)})" draggable="false"></i>\n                    ${"file"===e.type?`<a class="tree-node" href="${e.download_url}" target="_blank" uk-tooltip="title: Click to open; delay: 500">${e.name}</a>`:`<span class="tree-node">${e.name}</span>`}\n                </div>\n            </div>\n        `);return l.data({url:e.url,type:e.type,parent:t}),l.find(".tree-node").click(async function(){if("dir"===l.data("type"))if(l.find("ul").length)l.find("ul").toggleClass("d-none");else{let e=await(await fetch(l.data("url"))).json();l.append('<ul class="m-0"></ul>');for(let t of e)l.find("ul").append("<li></li>"),l.find("ul li:last-child").append(COMPONENTS.treeNode(t,t.sha))}}),l}};