window.MathJax.options.enableMenu = false
function parseMd(text, elemId, fork = false) {
    if (!fork) {
        text = text
            .replace(/\[math\]/g, '\\\\[')
            .replace(/\[\/math\]/g, '\\\\]')
            .replace(/-{1,}>/g, '\\\\(\\rightarrow\\\\)')
            .replace(/-{1,}</g, '\\\\(\\lefttarrow\\\\)')
            .replace(/(?<=\s+)\$\$(?=.*\$\$)/g, '\\\\(')
            .replace(/\$\$/g, '\\\\) ')
            .replace(/(?<!http(s).*)\%/g, '\\%')
            .replace(/~/g, '\\approx')
            .replace(/\\\\/g, '\\\\')
            .replace(/(?<!((http(s)?|\[\/?math\]|\$\$)).*)_(?!(http(s)?|\[\/?math\]|\$\$))/g, '\\_')
    }

    editormd.markdownToHTML(elemId, { markdown: text, htmlDecode: true })
    MathJax.typeset()
}