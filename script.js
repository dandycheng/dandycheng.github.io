let mainScroll, repoListScroll
$(document).ready(async function () {
    mainScroll = Scrollbar.init($('main')[0], { damping: 0.25, renderByPixels: true })
    repoListScroll = Scrollbar.init($('#repo-list')[0], { damping: 0.25, renderByPixels: true, alwaysShowTracks: true })
    Scrollbar.init($('#search-result')[0], { damping: 0.25, renderByPixels: true, alwaysShowTracks: true })

    let navState = navigator.onLine
    let toastDisplayed = false
    setInterval(() => {
        if (!navigator.onLine) {
            if (!toastDisplayed) {
                UIkit.notification("<p class='uk-text-normal uk-text-small uk-text-center p-2 m-0'>No internet connection is detected, please check your device's connection.</p>", { pos: 'bottom-center', timeout: 3000, status: 'danger' })
                navState = false
                toastDisplayed = true
            }
        } else {
            if (!navState) {
                UIkit.notification("<p class='uk-text-normal uk-text-small uk-text-center p-2 m-0'>You're back online!</p>", { pos: 'bottom-center', timeout: 3000, status: 'success' })
                navState = !navState
                toastDisplayed = false
            }
        }
    }, 2000)


    let bioHidden
    let params = getSearchParams()
    if (params) {
        setModalContent(await (await fetch(`https://github.com/dandycheng/`)))
    }

    $(window).resize(function () {
        toggleBioDisplay()
    })

    // @@ Event listeners
    $('#hide').click(function () {
        bioHidden = !bioHidden
        toggleBioDisplay()
    })


    let punctuationRegex = /(\s+|[^\w+|\s+|#]|[_+|#])/g
    $('#repo-search').keyup(async function () {
        $('#search-result .scroll-content > div').remove()

        if ($(this).val().length > 0) {
            $('#search-result').removeClass('d-none').addClass('pr-2 mt-3')
            $('#repo-list').hide()
            let query = $(this).val().replace(punctuationRegex, '')

            if (query.length > 0) {
                let searchRegex = new RegExp(`${ query }`, 'gi')

                for (let repoItem of $('#repo-list .repo-item')) {
                    let repoName = $(repoItem).data('name').replace(punctuationRegex, '')
                    let topicMatch = $(repoItem).data('topics').find(function (x) {
                        return searchRegex.test(x.replace(punctuationRegex, ''))
                    })

                    if ((searchRegex.test(repoName)) || topicMatch) {
                        $('#search-result .scroll-content').append(await COMPONENTS.repoItem($(repoItem).data(), 'secondary'))
                    }
                }
                if (!$('#search-result .scroll-content div').length) {
                    $('#search-result .scroll-content > p').removeClass('d-none').text(`No results found for "${ $('#repo-search').val() }"`)
                } else {
                    $('#search-result .scroll-content > p').addClass('d-none')
                }
            } else {
                $('#search-result .scroll-content > p').removeClass('d-none').text(`No results found for "${ $('#repo-search').val() }"`)
            }
        } else {
            $('#search-result').addClass('d-none').removeClass('pr-2 mt-3')
            $('#repo-list').show()
        }
    })

    $('.uk-modal-close-full').click(function () {
        UIkit.notification.closeAll()
    })

    $('#jump-to-repo-wrap').click(function () {
        mainScroll.scrollIntoView($('#sect-right')[0])
    })

    $('#clone-url').click(function () {
        copyCloneURL()
    })

    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            UIkit.notification.closeAll()
            if (!$('#modal.uk-open').length) {
                document.title = 'Dandy Cheng'
                $('#modal .uk-modal-body').html('')
            }
        }
    })

    $(document.body).click(function () {
        if (!$('#modal.uk-open').length) {
            document.title = 'Dandy Cheng'
            UIkit.modal($('#modal')).hide()
        }
    })

    function toggleBioDisplay() {
        let width = {
            width: bioHidden ? $(document.body).width() : '70%'
        }

        $('#sect-right').css($(document.body).width() > 1000 ? width : { width: '100%' })

        $('#hide').css({
            transform: bioHidden ? 'rotate(180deg)' : 'rotate(0deg)'
        }).attr('uk-tooltip', bioHidden ? 'Expand' : 'Hide')
    }
})

function getSearchParams() {
    if (window.location.search.length > 0) {
        let params = window.location.search.replace(/\?/g, '').split('&')
        let keyVal = {}
        for (let param of params) {
            keyVal[param.match(/.*(?=\=)/g)[0]] = param.match(/(?<=\=).*/g)[0]
        }
        return keyVal
    }
    return null
}

function getCloneUrl(data, tab = null) {
    let url = {
        github_cli: `gh repo clone ${ data.git_url }`,
        ssh: data.ssh_url,
        https: data.clone_url
    }
    let activeTab = (tab || $('.uk-active').text()).toLowerCase().replace(/\s+/g, '_')
    $('#clone-url').text(url[activeTab])
}

function copyCloneURL() {
    document.execCommand('copy')
    UIkit.notification.closeAll()
    UIkit.notification({
        message: '<p class="uk-text-normal uk-text-small uk-text-center p-2 m-0">URL copied to clipboard</p>',
        status: 'success',
        pos: 'bottom-center',
        timeout: 500
    })
}

async function setModalContent(data) {
    $('#modal h2, #modal .uk-modal-header p').text('')
    $('#modal .uk-modal-body').html('<div uk-spinner class="uk-dark" style="align-self:center"></div>')
    let langs = Object.keys((await (await fetch(data.languages_url)).json()))
    let sha = (await (await fetch(`https://api.github.com/repos/dandycheng/${ data.name }/git/refs`)).json())[0].object.sha
    let tree = await (await (await fetch(`https://api.github.com/repos/dandycheng/${ data.name }/contents`)).json())
    console.log(`https://api.github.com/repos/dandycheng/${ data.name }/contents`)

    $('#modal h2').toggleClass('.placeholder').text(data.name)
    let desc = data.description || 'No description'
    let readme = await (await fetch(`https://raw.githubusercontent.com/dandycheng/${ data.name }/${ data.default_branch }/README.md`)).text()
    let walkthrough
    try {
        walkthrough = await (await fetch(`https://raw.githubusercontent.com/dandycheng/${ data.name }/${ data.default_branch }/walkthrough.txt`)).text()
    } catch (e) {
        console.log(e)
    }

    let relativePaths = readme.match(/(?<=\[.*\]\((?!http(s)?)).*(?=\))/g)
    if (relativePaths) {
        relativePaths.forEach(x => readme = readme.replace(x, `https://raw.githubusercontent.com/${ data.full_name }/master/${ x }`))
    }
    setTimeout(() => {
        let hasReadMe = !(readme).includes('404: Not Found')
        let hasWalkthrough = !(walkthrough).includes('404: Not Found')
        let isNotebook = data.homepage && data.homepage.includes('colab.research.google.com')
        $('#modal .uk-modal-body').html('')
        $('#modal .uk-modal-header p').text(desc)
        $('#modal .uk-modal-body').html(`
            ${ langs.length > 0 ? `
                <p class="uk-text-bold p-0 m-0 mb-1">Languages</p>
                <div class="langs d-flex flex-row flex-wrap"></div>
            ` : '' }
            <p class="uk-text-bold m-0 mt-2 mb-2">Directory tree</p>
            <div class="d-tree d-flex flex-column m-0"></div>
            <div class="mt-3">
                <p class="uk-text-bold d-block m-0">Created at:
                    <code class="text-dark uk-text">${ new Date(data.created_at).toDateString().replace(/(?<=\w+)\s/, ', ') }</code>
                </p>
                <p class="uk-text-bold d-block m-0">Forked: <code class="text-dark uk-text">${ data.fork ? 'True' : 'False' }</code></p>
            </div>
            <div id="actions" class="d-flex flex-row flex-wrap">
                <div class="mt-3 uk-button-group uk-text-normal d-flex flex-row flex-wrap">
                    ${ !!data.homepage ? `<button class="uk-button uk-button-primary d-flex flex-row" id="open">Open ${ isNotebook ? '<div class="new-tab ml-3"></div>' : '' }</button>` : '' }
                    <a href="${ data.html_url }/archive/${ data.default_branch }.zip" class="uk-button uk-button-secondary" id="download" download>Download</a>
                    <button class="uk-button" id="clone">Clone</button>
                </div>
                <a href="https://github.com/dandycheng/${ data.name }" class="uk-link pt-3" target="_blank">Open in GitHub</a>
            </div>
            ${ hasReadMe || hasWalkthrough ? '<div class="uk-divider-icon"></div><div id="readme"></div>' : '' }
        `)
        parseMd(hasWalkthrough ? walkthrough : readme, 'readme', data.fork)
        Scrollbar.init($('.d-tree')[0], { damping: 0.25, renderByPixels: true, alwaysShowTracks: true })

        if (data.homepage && !!data.homepage.length) {
            $('#modal .uk-modal-body #open').click(function () {
                if (!isNotebook) {
                    $('#repo-content-open iframe').attr('src', data.homepage)
                    UIkit.notification(`<p class="text-center m-0 p-1 py-0">You are viewing: <strong id="content-name" class="d-inline-block">${ data.name }</strong></p>`,
                        { pos: 'bottom-center', timeout: 5000 })
                    $('#content-name').closest('div.uk-notification-message').toggleClass(['uk-background-secondary', 'uk-light'])
                    UIkit.modal($('#repo-content-open')).show()
                } else {
                    window.open(data.homepage, '_blank')
                }
            })
        }

        getCloneUrl(data)
        $('#modal .uk-modal-body #clone').click(function () {
            UIkit.modal($('#clone-dialog')[0]).show()

            $('#clone-dialog a').click(function () {
                getCloneUrl(data, $(this).text())
            })
        })

        for (let dir of tree) {
            $('#modal .d-tree .scroll-content').append(COMPONENTS.treeNode(dir))
        }


        if (langs.length > 0) {
            $('#modal .uk-modal-body .langs').html(`${ langs.map(lang => COMPONENTS.tag(lang)).join('') } `)
        }

        for (let ol of $('.prettyprint ol')) {
            if ($(ol).children('li').length > 1) {
                Scrollbar.init(ol, { damping: 0.25, renderByPixels: true, alwaysShowTracks: true })
            } else {
                Scrollbar.init($(ol).children('li')[0], { damping: 0.25, renderByPixels: true, alwaysShowTracks: true })
            }
        }
    }, 1000);
}