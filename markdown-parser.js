function parseMd(e,a,t=!1){t||(console.log(e),e=e.replace(/\[math\]/g,"\\\\[").replace(/\[\/math\]/g,"\\\\]").replace(/-{1,}>/g,"\\\\(\\rightarrow\\\\)").replace(/-{1,}</g,"\\\\(\\lefttarrow\\\\)").replace(/(?<=\s+)\$\$(?=.*\$\$)/g,"\\\\(").replace(/\$\$/g,"\\\\) ").replace(/(?<!http(s).*)\%/g,"\\%").replace(/(?<!.*`+)~(?!.*`+)/g,"\\approx").replace(/\\\\/g,"\\\\").replace(/(?<!((http(s)?|\[\/?math\]|\$\$)).*)_(?!(http(s)?|\[\/?math\]|\$\$))/g,"\\_")),editormd.markdownToHTML(a,{markdown:e,htmlDecode:!0}),MathJax.typeset()}window.MathJax.options.enableMenu=!1;