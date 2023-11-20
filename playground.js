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
  // let elements = getElements()
  // editorArea.innerHTML = ''
  // for (let i = 3; i < elements.length; i++) {
  //   let element = elements[i]
  //   let elementId = element.tagName + "[" + (i - 2) + "]"
  //   let classes = ''
  //   for (let j = 0; j < element.classList.length; j++) {
  //     classes += element.classList[j] + " "
  //   }
  //   editorArea.innerHTML +=   '<div class="w-100% noselect flexRow flexSpaceBetween p-6px-10px fs-12px pointer b-1px-solid-black7 bg-black5" onclick="toggleElement(\'' + elementId + '\')">' +
  //                               '<div>' + elementId + '</div>' +
  //                               '<i class="fa-solid fa-chevron-down ' + elementId + ' hidden"></i>' +
  //                               '<i class="fa-solid fa-chevron-up ' + elementId + '"></i>' +
  //                             '</div>' +
  //                             '<div class="flexColumn ' + elementId + ' hidden w-100% ta-left flexLeft p-8px-12px">' +
  //                               '<div class="flexRow w-100%">' +
  //                                 '<input class="w-100%" placeholder="Classes" type="text" value="' + classes + '"></input>' +
  //                               '</div>' +
  //                             '</div>'
  // }
  const treeObject = htmlToTree();
  pb_classGenerator()
  // console.log(JSON.stringify(treeObject, null, 2));
  treeChild(treeObject, treeObject.children)
}

const generateBlock = (object, parents) => {
  let elementId = object.tag + "_" + pb_randomString(24)
  let contentEdit = ''
  if (object.tag === "textContent") {
    contentEdit = '<div class="fs-12px">Value</div><input class="w-100% inputs" placeholder="Value" type="text" value="' + object.value + '"></input>'
  } else {
    contentEdit = '<div class="fs-12px">Class list</div>' +
    '<input class="w-100% inputs" placeholder="Classes" type="text" value="' + object.classList + '"></input>' +
    '<div class="fs-12px">Value</div>' +
    '<input class="w-100% inputs" placeholder="Value" type="text" value="' + object.value + '"></input>' +
    '<div class="fs-12px">Type</div>' +
    '<input class="w-100% inputs" placeholder="Type" type="text" value="' + object.type + '"></input>' +
    '<div class="fs-12px">Onclick action</div>' +
    '<input class="w-100% inputs" placeholder="Onclick" type="text" value="' + object.onclick + '"></input>'
  }
  editorArea.innerHTML +=   '<div class="w-100% noselect flexRow flexSpaceBetween p-6px-10px fs-12px pointer b-1px-solid-black7 bg-black5" onclick="toggleElement(\'' + elementId + '\')">' +
                              '<div class="ff-fontMonospace fs-10px o-.7">' + parents + object.tag + '</div>' +
                              '<i class="fa-solid fa-chevron-down ' + elementId + ' hidden"></i>' +
                              '<i class="fa-solid fa-chevron-up ' + elementId + '"></i>' +
                            '</div>' +
                            '<div class="flexColumn ' + elementId + ' hidden w-100% ta-left flexLeft p-8px-12px">' +
                              '<div class="flexColumn flexLeft g-4px w-100%">' +
                                contentEdit
                              '</div>' +
                            '</div>'
}

const treeChild = async (object, children, parents) => {
  if (children) {
    if (!parents) {
      parents = ""
    }    
    for (let i = 0; i < children.length; i++) {
      let newParents = parents + object.tag + " > " + "[" + i + "]"
      generateBlock(children[i], newParents)
      await treeChild(children[i], children[i].children, newParents)
    }
  }
}

const htmlToTree = () => {
  editorArea.innerHTML = ''
  let code = codeTextarea.value;
  let parser = new DOMParser();
  let doc = parser.parseFromString(code, "text/html");

  function buildTree(node) {
    const treeObject = {
      tag: node.tagName ? node.tagName.toLowerCase() : undefined,
      classList: node.classList ? Array.from(node.classList) : [],
      value: node.value ? node.value : [],
      onclick: node.onclick ? node.onclick : [],
      type: node.type ? node.type : [],
      children: []
    };

    for (const childNode of node.childNodes) {
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        treeObject.children.push(buildTree(childNode));
      } else if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent.trim() !== '') {
        treeObject.children.push({
          tag: 'textContent',
          value: childNode.textContent.trim()
        });
      }
    }

    return treeObject;
  }

  return buildTree(doc.body);
}