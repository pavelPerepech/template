var jsonResponse = function(response, commonErrorText) {
    var contentType = response.headers.get('Content-Type');
    if (contentType != 'application/json') {
        console.error("%s with http code: %d", commonErrorText, response.status);
        throw new Error(commonErrorText);   
    }

    return response.json().then(payload => ({status: response.status, payload: payload}));
}

var isFethResultOk = function(result) {
    return result.status < 400;
}

var getBusinessErrorText = function(result, nonBusinessError) {
    if (isFethResultOk(result)) {
        return 'No errors';
    }

    const nonBusinessErrorPresent = nonBusinessError !== undefined && nonBusinessError != null;
    const isBusiness = result.payload.business;
    if (nonBusinessErrorPresent && !isBusiness) {
        return nonBusinessError;
    } else {
        return result.payload.message;
    }
 
}

exports.jsonResponse = jsonResponse;
exports.isFethResultOk = isFethResultOk;
exports.getBusinessErrorText = getBusinessErrorText;