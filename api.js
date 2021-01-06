$(document).ready(async function () {
    let localStore = {}
    try {
        Promise.all([
            (await fetch('https://api.github.com/users/dandycheng')).json(),
            (await fetch("https://api.github.com/users/dandycheng/repos", {
                method: "GET",
                headers: {
                    Accept: "application/vnd.github.mercy-preview+json"
                }
            })).json()
        ]).then(async function (data) {
            let [bio, repos] = data
            $('#avatar').css({ backgroundImage: `url(${ bio.avatar_url })` })
            $('#bio').text(bio.bio)

            localStore.bio = bio
            localStore.repos = repos
            localStorage.setItem(window.location.href, JSON.stringify(localStore))
            localStore.topics = []
            addRepoItem(repos)
        }).catch(error => { throw error })

    } catch (error) {
        // Get repo list from local storage if rate limit has exceeded
        await addRepoItem(JSON.parse(localStorage.getItem(window.location.href)).repos)
    }

    async function addRepoItem(repos) {
        let isEven

        for (let repo of repos) {
            if (repo.full_name.includes('dandycheng.github.io')) {
                continue
            }
            localStore.topics.push(repo.topics)

            let repoItem = $('#repo-list .scroll-content > div:last-child')
            isEven = [...repoItem[0].classList].includes('uk-child-width-1-3@xl')

            if (isEven && repoItem.children().length === 2 || !isEven && repoItem.children().length === 1) {
                $('#repo-list .scroll-content').append(`
                    <div class="uk-child-width-1-${ isEven ? '2' : '3' }@xl uk-child-width-1-1@m uk-child-width-1-1@s uk-grid-match uk-grid-small" uk-grid></div>
                `)
            }

            repoItem.append(await COMPONENTS.repoItem(repo, 'secondary'))
        }
        localStorage.topics = JSON.stringify(localStore.topics.flat())
        $('#loading, #repo-list').toggleClass(['d-none'])
        $('#repo-list .scroll-content').toggleClass(['d-block', 'pb-3'])
        UIkit.scrollspy($('#repo-list .scroll-content'))
    }
})