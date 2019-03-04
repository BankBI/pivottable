callWithJQuery = (pivotModule) ->
    if typeof exports is "object" and typeof module is "object" # CommonJS
        pivotModule require("jquery"), require("d3")
    else if typeof define is "function" and define.amd # AMD
        define ["jquery", "d3"], pivotModule
    # Plain browser env
    else
        pivotModule jQuery, d3

callWithJQuery ($, d3) ->

    $.pivotUtilities.d3_renderers = Treemap: (pivotData, opts) ->
        defaults =
            localeStrings: {}
            d3:
                width: -> $(window).width() / 1.4
                height: -> $(window).height() / 1.4

        opts = $.extend(true, {}, defaults, opts)


        result = $("<div>").css(width: "100%", height: "100%")

        tree = name: "All", children: []
        addToTree = (tree, path, value) ->
            if path.length == 0
                tree.value = value
                return
            tree.children ?= []
            x = path.shift()
            for child in tree.children when child.name == x
                addToTree(child, path, value)
                return
            newChild = name: x
            addToTree(newChild, path, value)
            tree.children.push newChild

        for rowKey in pivotData.getRowKeys()
            value = pivotData.getAggregator(rowKey, []).value()
            if value?
                addToTree(tree, rowKey, value)

        color = d3.scaleOrdinal(d3.schemeCategory10)
        width = opts.d3.width()
        height = opts.d3.height()

        treemap = d3.treemap()
            .size([width, height])
            .tile(d3.treemapResquarify)

        root = d3.hierarchy(tree, (d) => d.children)
            .sum((d) => d.value)

        d3tree = treemap(root)

        d3.select(result[0])
            .append("div")
                .style("position", "relative")
                .style("width", width + "px")
                .style("height", height + "px")
            .selectAll(".node")
            .data(d3tree.leaves())
            .enter().append("div")
                .attr("class", "node")
                .style("left", (d) => d.x0 + "px")
                .style("top", (d) => d.y0 + "px")
                .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
                .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
                .style("background", (d) -> if d.children? then "lightgrey" else color(d.data.name) )
                .text( (d) -> d.data.name )

        return result



