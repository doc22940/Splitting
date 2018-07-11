/**
 * @type {Record<string, import('./types').ISplittingPlugin>}
 */
var plugins = {};

/**
 * @param by {string}
 * @param parent {string}
 * @param deps {string[]}
 */
function resolvePlugins(by, parent, deps) {
    // skip if already visited this dependency
    var index = deps.indexOf(by);
    if (index == -1) { 
       // if new to dependency array, add to the beginning
       deps.unshift(by);
       
       // lookup the plugin dependencies
       var plugin = plugins[by];
       
       // recursively call this function for all dependencies
       (plugin.depends || []).some(function(p) {
          resolvePlugins(p, by, deps);
       })
    } else {
       // if this dependency was added already move to the left of
       // the parent dependency so it gets loaded in order
       var indexOfParent = deps.indexOf(parent);
       deps.splice(index, 1)
       deps.splice(indexOfParent, 0, by);
    }
    return deps
 }

 /**
  * 
  * @param by {string} 
  * @returns {import('./types').ISplittingPlugin[]}
  */
 export function resolve(by) {
    return resolvePlugins(by, 0, []).map(function(pluginName) {
        return plugins[pluginName];
    });
 }

/**
 * Adds a new plugin to splitting
 * @param opts {import('./types').ISplittingPlugin} 
 */
export function add(opts) {
    plugins[opts.by] = opts;
}