function showMore(id) {
  document.getElementById(id + 'Overflow').className = ''
  document.getElementById(id + 'MoreLink').className = 'hidden'
  document.getElementById(id + 'LessLink').className = ''
}

function showLess(id) {
  document.getElementById(id + 'Overflow').className = 'hidden'
  document.getElementById(id + 'MoreLink').className = ''
  document.getElementById(id + 'LessLink').className = 'hidden'
}

let len = 300
let shrinkables = document.getElementsByClassName('shrinkable')
if (shrinkables.length > 0) {
  for (let i = 0; i < shrinkables.length; i++) {
    let fullText = shrinkables[i].innerHTML
    if (fullText.length > len) {
      let trunc = fullText.substring(0, len).replace(/\w+$/, '')
      let remainder = ''
      let id = shrinkables[i].id
      remainder = fullText.substring(len, fullText.length)
      shrinkables[i].innerHTML =
        '<span>' +
        trunc +
        '<span class="hidden" id="' +
        id +
        'Overflow">' +
        remainder +
        '</span></span>&nbsp;<a href="#!" id="' +
        id +
        'MoreLink" onclick="showMore(\'' +
        id +
        '\');">Развернуть</a><a href="#!" class="hidden" id="' +
        id +
        'LessLink" onclick="showLess(\'' +
        id +
        '\');">Свернуть</a>'
    }
  }
}
