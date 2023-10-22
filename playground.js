let codeTextarea = document.getElementById('code-textarea')
let customLines = document.getElementById('custom-lines')
let editorArea = document.getElementById('editor-window-inside')
let preview = document.getElementById('preview-window-inside')

codeTextarea.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const start = codeTextarea.selectionStart
      const end = codeTextarea.selectionEnd
  
      codeTextarea.value = codeTextarea.value.substring(0, start) + '\t' + codeTextarea.value.substring(end)
      codeTextarea.focus()
      codeTextarea.selectionEnd = end + 1
  
      event.preventDefault()
    }
})

window.addEventListener("load", async () => {
    const numberOfLines = codeTextarea.value.split('\n').length
    codeTextarea.style.height = (numberOfLines * 17.5) + "px"
    customLines.innerHTML = Array(numberOfLines)
      .fill('<span></span>')
      .join('')
    generateEditor()
})

codeTextarea.addEventListener('keyup', event => {
    const numberOfLines = event.target.value.split('\n').length
    codeTextarea.style.height = (numberOfLines * 17.5) + "px"
    customLines.innerHTML = Array(numberOfLines)
      .fill('<span></span>')
      .join('')
    generateEditor()
})

document.getElementById("updateButton").onclick = () => {
    document.getElementById('preview-window-inside').innerHTML = codeTextarea.value
    pb_classGenerator()
}

const getElements = () => {
  let code = codeTextarea.value;
  let parser = new DOMParser();
  let doc = parser.parseFromString(code, "text/html");
  return doc.getElementsByTagName('*')
}

const generateEditor = () => {
  let elements = getElements()
  editorArea.innerHTML = ''
  for (let i = 3; i < elements.length; i++) {
    let element = elements[i]
    let elementId = element.tagName + "[" + (i - 2) + "]"
    let classes = ''
    for (let j = 0; j < element.classList.length; j++) {
      classes += element.classList[j] + " "
    }
    editorArea.innerHTML +=   '<div class="w-100% noselect flexRow flexSpaceBetween p-6px-10px fs-12px pointer b-1px-solid-black7 bg-black5" onclick="toggleElement(\'' + elementId + '\')">' +
                                '<div>' + elementId + '</div>' +
                                '<i class="fa-solid fa-chevron-down ' + elementId + ' hidden"></i>' +
                                '<i class="fa-solid fa-chevron-up ' + elementId + '"></i>' +
                              '</div>' +
                              '<div class="flexColumn ' + elementId + ' hidden w-100% ta-left flexLeft p-8px-12px">' +
                                '<div class="flexRow w-100%">' +
                                  '<input class="w-100%" placeholder="Classes" type="text" value="' + classes + '"></input>' +
                                '</div>' +
                              '</div>'
  }
  pb_classGenerator()
}