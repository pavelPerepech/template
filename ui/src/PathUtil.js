var pathToString = function(path) {
    return '/' + path.join('/');
}

var stringToPath = function(pathString) {
    let formated;
    if (pathString.startsWith('/')) {
        formated = pathString.slice(1);
    } else {
        formated = pathString;
    }
    return formated.split('/');
}

var pathToUrlSubPath = function(path) {
    var prefix = path.length == 0 ? '': '/';
    return prefix + path.join('/');
}


var getParentPath = function(path) {
    if (path == null || path.length <= 1) {
        return [];
    }
    return path.slice(0, path.length - 1);
}

var concatPaths = function(p1, p2) {
    var result = p1.slice();
    return result.concat(p2);
}

var extractPathFromUrl = function(href) {
    if (href == undefined || href == null || href.length == 0) {
        return [];
    }

    let anchorPos = href.indexOf("#");
    if (anchorPos < 0) {
        return [];
    }

    let zooPath = href.slice(anchorPos + 1);
    if (zooPath.startsWith("/")) {
        zooPath = zooPath.slice(1);
    }

    if (zooPath.length == 0) {
        return [];
    }

    return zooPath.split('/');
}

var isValidPathString = function(path) {
    return path.match(/^(\/([A-Za-z\d-_])+)+$/)
}

exports.pathToString = pathToString;
exports.getParentPath = getParentPath; 
exports.pathToUrlSubPath = pathToUrlSubPath;
exports.stringToPath = stringToPath;
exports.extractPathFromUrl = extractPathFromUrl;
exports.isValidPathString = isValidPathString;
exports.concatPaths = concatPaths;
