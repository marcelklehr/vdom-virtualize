var VNode = require("virtual-dom/vtree/vnode")
  , VText = require("virtual-dom/vtree/vtext")

exports.virtualize = createVNode

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

    // Special case: style
    // .style is a DOMStyleDeclaration, thus we need to iterate over all
    // rules to create a hash of applied css properties.
    //
    // You can directly set a specific .style[prop] = value so patching with vdom
    // is possible.
    if("style" == propName) {
      var css = {}
        , styleProp
      for(var i=0; i<el.style; i++) {
        styleProp = el.style[i]
        css[styleProp] = el.style.getPropertyValue(styleProp) // XXX: add support for "!important" via getPropertyPriority()!
      }

      obj[propName] = css
      return
    }

    // Special case: dataset
    // we can iterate over .dataset with a simple for..in loop.
    // The all-time foo with data-* attribs is the dash-snake to camelCase
    // conversion.
    // However, I'm not sure if this is compatible with h()
    //
    // .dataset properties are directly accessible as transparent getters/setters, so
    // patching with vdom is possible.
    if("dataset" == propName) {
      var data = {}
      for(var p in el.dataset) {
        data[p] = el.dataset[p]
      }

      obj[propName] = data
      return
    }

    // default: just copy the property
    obj[propName] = el[propName]
    return
  })
}

/**
 * DOMNode property white list
 */
var props =
exports.properties = [
, "accept"
, "accessKey"
, "action"
, "allowFullScreen"
, "allowTransparency"
, "alt"
, "async"
, "autoComplete"
, "autoPlay"
, "cellPadding"
, "cellSpacing"
, "charSet"
, "checked"
, "className"
, "cols"
, "colSpan"
, "content"
, "contentEditable"
, "contextMenu"
, "controls"
, "crossOrigin"
, "data"
, "dateTime"
, "defer"
, "dir"
, "disabled"
, "download"
, "draggable"
, "encType"
, "form"
, "formNoValidate"
, "frameBorder"
, "height"
, "hidden"
, "href"
, "hrefLang"
, "htmlFor"
, "httpEquiv"
, "icon"
, "id"
, "label"
, "lang"
, "list"
, "loop"
, "max"
, "maxLength"
, "mediaGroup"
, "method"
, "min"
, "multiple"
, "muted"
, "name"
, "noValidate"
, "pattern"
, "placeholder"
, "poster"
, "preload"
, "radioGroup"
, "readOnly"
, "rel"
, "required"
, "role"
, "rows"
, "rowSpan"
, "sandbox"
, "scope"
, "scrollLeft"
, "scrolling"
, "scrollTop"
, "seamless"
, "selected"
, "size"
, "span"
, "spellCheck"
, "src"
, "srcDoc"
, "srcSet"
, "start"
, "step"
, "style"
, "tabIndex"
, "target"
, "title"
, "type"
, "value"
, "width"
, "wmode"
]
