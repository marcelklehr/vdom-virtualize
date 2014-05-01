var VNode = require("virtual-dom/vtree/vnode")
  , VText = require("virtual-dom/vtree/vtext")

exports.virtualize =
exports.createVTree = createVNode
function createVNode(domNode, key) {
  key = key || null // XXX: Leave out `key` for now... merely used for (re-)ordering


  if(domNode.nodeType == 1) return createFromElement(domNode, key)
  if(domNode.nodeType == 3) return createFromTextNode(domNode, key)

  return
}

function createFromTextNode(tNode) {
  return new VText(tNode.toString()) // XXX: I'm not sure if toString exists here.
}


function createFromElement(el) {
  var tagName = el.tagName
  , namespace = el.namespaceURI
  , properties = getElementProperties(el)
  , children = []

  for (var i = 0; i < el.chilNodes.length; i++) {
    children.push(createVNode(el.chilNodes[i]/*, i*/))
  }

  return new VNode(tagName, properties, children, null, namespace)
}


function getElementProperties(el) {
  var obj = {}

  props.forEach(function(propName) {
    if(!el[propName]) return

    if("stlye" == propName) {
      var css = {}
      for(var i=0; i<el.style; i++) {
        css[el.style[i]] = el.style.getPropertyValue(el.style[i]) // XXX: add support for "!important" via getPropertyPriority()!
      }

      obj[propName] = css
      return
    }

    if("dataset" == propName) {
      var data = {}
      for(var p in el.dataset) {
        data[p] = el.dataset[p]
      }

      obj[propName] = data
      return
    }

    obj[propName] = el[propName]
    return
  })
}

/**
 * DOMNode property white list
 */
var props =
exports.properties = [
  "id"
, "className"
, "accessKey"
, "contentEditable"
, "dir"
, "lang"
, "spellcheck"
, "style"
, "dataset"
, "title"
, "src"
, "border"
, "alt"

, "checked"
, "value"
, "selected"]
