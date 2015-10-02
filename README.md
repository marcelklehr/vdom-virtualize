# vdom-virtualize

**New in v1.0:** vdom-virtualize now supports comments and does now use peerDependencies to depend on virtual-dom.

## API

### virtualize(node:DOMNode)
 * node `{DOMNode}`

 * returns `{VNode}`: A virtual-dom tree

### virtualize.fromHTML(html:String)
 * html `{String}`

 * returns `{VNode}`: A virtual-dom tree

Turn a DOMNode into a [virtual-dom](https://github.com/Matt-Esch/virtual-dom) node.
