$(document).ready(async function(){let t={};try{Promise.all([(await fetch("https://api.github.com/users/dandycheng")).json(),(await fetch("https://api.github.com/users/dandycheng/repos",{method:"GET",headers:{Accept:"application/vnd.github.mercy-preview+json"}})).json()]).then(async function(e){let[o,l]=e;$("#avatar").css({backgroundImage:`url(${o.avatar_url})`}),$("#bio").text(o.bio),t.bio=o,t.repos=l,localStorage.setItem(window.location.href,JSON.stringify(t)),t.topics=[],i(l)}).catch(t=>{throw t})}catch(t){await i(JSON.parse(localStorage.getItem(window.location.href)).repos)}async function i(i){let e;for(let o of i){if(o.full_name.includes("dandycheng.github.io"))continue;t.topics.push(o.topics);let i=$("#repo-list .scroll-content > div:last-child");((e=[...i[0].classList].includes("uk-child-width-1-3@xl"))&&2===i.children().length||!e&&1===i.children().length)&&$("#repo-list .scroll-content").append(`\n                    <div class="uk-child-width-1-${e?"2":"3"}@xl uk-child-width-1-1@m uk-child-width-1-1@s uk-grid-match uk-grid-small" uk-grid></div>\n                `),i.append(await COMPONENTS.repoItem(o,"secondary"))}localStorage.topics=JSON.stringify(t.topics.flat()),$("#loading, #repo-list").toggleClass(["d-none"]),$("#repo-list .scroll-content").toggleClass(["d-block","pb-3"]),UIkit.scrollspy($("#repo-list .scroll-content")),$("#repo-search").css({cursor:"initial"}).attr({disabled:!1})}});
