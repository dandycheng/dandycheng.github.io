$(document).ready(async function(){let t={};try{Promise.all([(await fetch("https://api.github.com/users/dandycheng")).json(),(await fetch("https://api.github.com/users/dandycheng/repos",{method:"GET",headers:{Accept:"application/vnd.github.mercy-preview+json"}})).json()]).then(async function(i){let[o,l]=i;$("#avatar").css({backgroundImage:`url(${o.avatar_url})`}),$("#bio").text(o.bio),t.bio=o,t.repos=l,localStorage.setItem(window.location.href,JSON.stringify(t)),t.topics=[],e(l)}).catch(t=>{throw t})}catch(t){await e(JSON.parse(localStorage.getItem(window.location.href)).repos)}async function e(e){let i;for(let o of e){if(o.full_name.includes("dandycheng.github.io"))continue;t.topics.push(o.topics);let e=$("#repo-list .scroll-content > div:last-child");((i=[...e[0].classList].includes("uk-child-width-1-3@xl"))&&2===e.children().length||!i&&1===e.children().length)&&$("#repo-list .scroll-content").append(`\n                    <div class="uk-child-width-1-${i?"2":"3"}@xl uk-child-width-1-1@m uk-child-width-1-1@s uk-grid-match uk-grid-small" uk-grid></div>\n                `),e.append(await COMPONENTS.repoItem(o,"secondary"))}localStorage.topics=JSON.stringify(t.topics.flat()),$("#loading, #repo-list").toggleClass(["d-none"]),$("#repo-list .scroll-content").toggleClass(["d-block","pb-3"]),UIkit.scrollspy($("#repo-list .scroll-content"))}});