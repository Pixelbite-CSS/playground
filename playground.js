let codeTextarea = document.getElementById('code-textarea')
let customLines = document.getElementById('custom-lines')

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
    customLines.innerHTML = Array(numberOfLines)
      .fill('<span></span>')
      .join('')
})

codeTextarea.addEventListener('keyup', event => {
    const numberOfLines = event.target.value.split('\n').length
    customLines.innerHTML = Array(numberOfLines)
      .fill('<span></span>')
      .join('')
})

document.getElementById("updateButton").onclick = () => {
    document.getElementById('preview-window-inside').innerHTML = codeTextarea.value
    pb_classGenerator()
}