let constraints = {
    title: {
        presence: { message: "is required" },
        length: {
            minimum: 2,
            message: "must be at least 2 characters"
        }
    },
    sn: {
        presence: { message: "is required" },
        format: {
            pattern: "^#.*",
            flags: "i",
            message: "should starts with #"
          }
    },
    year: {
        presence: { message: "is required" },
        length: {
            minimum: 4,
            message: "must be at least 4 characters"
        }
    }
};

function displayActionSuccess(msg) {
    msg = typeof msg != 'undefined' ? "Success: " + msg : "Success";
    document.querySelector('#msg').innerHTML = '<span class="action-success">' + msg + '</span>';
}

function displayActionFailure(msg) {

    msg = typeof msg != 'undefined' ? "Failure: " + msg : "Failure";
    document.querySelector('#msg').innerHTML = '<span class="action-failure">' + msg + '</span>';
}

function resetActionStatus() {
    document.querySelector('#msg').innerHTML = '';
}

function validateBookData(data)
{
    
    let errors = validate(data, constraints);
    if (typeof(errors) === 'object')
    {
        const errorsArr = [];
        for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
                errorsArr.push(...errors[key]);
            }
        }
        displayActionFailure(errorsArr.join('\n '));
    }
    return errors;
}