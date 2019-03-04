(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"), require("d3"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery", "d3"], pivotModule);
    } else {
      return pivotModule(jQuery, d3);
    }
  };

  callWithJQuery(function($, d3) {
    return $.pivotUtilities.d3_renderers = {
      Treemap: function(pivotData, opts) {
        var addToTree, color, d3tree, defaults, height, i, len, ref, result, root, rowKey, tree, treemap, value, width;
        defaults = {
          localeStrings: {},
          d3: {
            width: function() {
              return $(window).width() / 1.4;
            },
            height: function() {
              return $(window).height() / 1.4;
            }
          }
        };
        opts = $.extend(true, {}, defaults, opts);
        result = $("<div>").css({
          width: "100%",
          height: "100%"
        });
        tree = {
          name: "All",
          children: []
        };
        addToTree = function(tree, path, value) {
          var child, i, len, newChild, ref, x;
          if (path.length === 0) {
            tree.value = value;
            return;
          }
          if (tree.children == null) {
            tree.children = [];
          }
          x = path.shift();
          ref = tree.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (!(child.name === x)) {
              continue;
            }
            addToTree(child, path, value);
            return;
          }
          newChild = {
            name: x
          };
          addToTree(newChild, path, value);
          return tree.children.push(newChild);
        };
        ref = pivotData.getRowKeys();
        for (i = 0, len = ref.length; i < len; i++) {
          rowKey = ref[i];
          value = pivotData.getAggregator(rowKey, []).value();
          if (value != null) {
            addToTree(tree, rowKey, value);
          }
        }
        color = d3.scaleOrdinal(d3.schemeCategory10);
        width = opts.d3.width();
        height = opts.d3.height();
        treemap = d3.treemap().size([width, height]).tile(d3.treemapResquarify);
        root = d3.hierarchy(tree, (function(_this) {
          return function(d) {
            return d.children;
          };
        })(this)).sum((function(_this) {
          return function(d) {
            return d.value;
          };
        })(this));
        d3tree = treemap(root);
        d3.select(result[0]).append("div").style("position", "relative").style("width", width + "px").style("height", height + "px").selectAll(".node").data(d3tree.leaves()).enter().append("div").attr("class", "node").style("left", (function(_this) {
          return function(d) {
            return d.x0 + "px";
          };
        })(this)).style("top", (function(_this) {
          return function(d) {
            return d.y0 + "px";
          };
        })(this)).style("width", (function(_this) {
          return function(d) {
            return Math.max(0, d.x1 - d.x0 - 1) + "px";
          };
        })(this)).style("height", (function(_this) {
          return function(d) {
            return Math.max(0, d.y1 - d.y0 - 1) + "px";
          };
        })(this)).style("background", function(d) {
          if (d.children != null) {
            return "lightgrey";
          } else {
            return color(d.data.name);
          }
        }).text(function(d) {
          return d.data.name;
        });
        return result;
      }
    };
  });

}).call(this);

//# sourceMappingURL=d3_renderers.js.map
