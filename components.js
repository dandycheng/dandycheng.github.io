const COMPONENTS = {
    repoItem: async function (data, color) {
        let topics = ''
        if (data.topics.length > 0) {
            topics += data.topics.map(x => `<span class="topic badge badge-secondary m-1 px-2 uk-text-bold">#${ x }</span>`)
        }
        let html = $(`
            <div>
                <div id="${ data.name }" class="repo-item uk-card uk-card-default uk-card-body uk-border-rounded uk-card-${ color } shadow">
                    <div class="d-flex flex-row">
                        <h5 class="p-0">${ data.name.replace(/_/g, '-') }</h5>
                        <i class="link ml-2 rounded rounded-circle" uk-tooltip="Copy repository URL"></i>
                    </div>
                    ${ data.description === null ? 'No description' : `<p class="uk-text-truncate">${ data.description }</p>` }
                    ${ data.topics.length > 0 ? `<div>${ topics.replace(/,/g, '') }</div>` : '' }
                </div>
            </div>
        `)
        html.find('.repo-item').data(data)
        html.find('.link').click(function (e) {
            e.stopPropagation();
            let copy = $('#copy-placeholder')
            copy.val(data.html_url)
            copy[0].focus()
            copy[0].select()
            copy[0].setSelectionRange(0, 99999)
            document.execCommand('copy')
            copy[0].blur()
            UIkit.notification("<p class='uk-text-normal uk-text-small uk-text-center p-2 m-0'>Link copied</p>", { pos: 'bottom-center', timeout: 1000, status: 'success' })
        })

        html.click(function () {
            setModalContent(data)
            UIkit.modal($('#modal')).show()
            document.title = `Dandy Cheng - ${ data.name }`
        })

        return html
    },
    tag: function (tag) {
        return `<span class="uk-label uk-label-warning text-dark uk-text-capitalize uk-text-normal mr-2 mt-1">${ tag }</span>`
    },
    treeNode: function (dir, parent = undefined) {
        let fileExtRegex = /\.\w+$/
        function getIcon(ext) {
            if (fileExtRegex.test(ext)) {
                ext = ext.match(fileExtRegex)[0]
            }
            let icons = {
                'image.svg': ['png', 'jpg', 'jpeg', 'svg'],
                'file.svg': ['file']
            }

            for (let svg in icons) {
                if (icons[svg].includes(ext)) {
                    return svg
                }
            }
            return fileExtRegex.test(ext) ? 'file.svg' : 'folder.svg'
        }

        let node = $(`
            <div id="${ dir.sha }" class="d-node d-flex flex-column ${ dir.type === 'tree' ? 'folder' : '' }">
                <div class="d-flex flex-row">
                    ${ parent ? '<i class="d-icon" draggable="false"></i>' : '' }
                    <i class="path-type mr-2" style="background-image:url(assets/svg/${ getIcon(dir.type) })" draggable="false"></i>
                    ${ dir.type === 'file' ? `<a class="tree-node" href="${ dir.download_url }" target="_blank" uk-tooltip="title: Click to open; delay: 500">${ dir.name }</a>` : `<span class="tree-node">${ dir.name }</span>` }
                </div>
            </div>
        `)

        node.data({ url: dir.url, type: dir.type, parent: parent })
        node.find('.tree-node').click(async function () {
            if (node.data('type') === 'dir') {
                if (!node.find('ul').length) {
                    console.log(node.data('url'));
                    let children = await ((await fetch(node.data('url'))).json())
                    node.append(`<ul class="m-0"></ul>`)
                    for (let dir of children) {
                        node.find('ul').append('<li></li>')
                        node.find(`ul li:last-child`).append(COMPONENTS.treeNode(dir, dir.sha))
                    }
                } else {
                    node.find('ul').toggleClass('d-none')
                }
            }
        })
        return node
    }
}