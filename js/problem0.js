window.onload = function() {
    var users = new UsersData();
    var country = gel('country');
    loadCountries(country);
    var userForm = document.getElementById('userDetailForm');
    userForm.addEventListener('submit', function(e){
            e.preventDefault();
            var userDetail = {};
            if (validateForm(userDetail)) {
                users.addUser(userDetail);
                var formContainer = gel('formContainer');
                formContainer.innerHTML = "<div class='thank_you'>Thank You :)</div><div class='navigation_other' style='text-align: center;'><h4><a href='problem1.html'>All Users List</a></h4></div>";
                console.log(users.getUsers());
            }
        
    }, false);

};

function loadCountries(list) {
    for (var country in countriesList) {
        var option = document.createElement("option");
        option.textContent = countriesList[country];
        option.value = country;
        list.appendChild(option);
    }
}

function validateForm(details) {
    hideAllErrors();
    var isFormValid = true;

    //validating first name
    var firstName = gel('firstName');
    if (isNotEmpty(firstName.value) && isLessThanMaxLength(firstName.value, 256))
        details['firstName'] = firstName.value;
    else if (!isNotEmpty(firstName.value)) {
        showError(firstName, "This field can't be empty");
        isFormValid = false;
    } else if (!isLessThanMaxLength(firstName.value, 256)){
        showError(firstName, "First name should be less than 256 characters");
        isFormValid = false;
    }

    //validating last name
    var lastName = gel('lastName');
    if (isNotEmpty(lastName.value) && isLessThanMaxLength(lastName.value, 256))
        details['lastName'] = lastName.value;
    else if (!isNotEmpty(lastName.value)){
        showError(lastName, "This field can't be empty");
        isFormValid = false;
    } else if (!isLessThanMaxLength(lastName.value, 256)) {
        showError(firstName, "Last name should be less than 256 characters");
        isFormValid = false;
    }

    //setting gender
    var gender = gel('gender');
    details['gender'] = gender.value;

    //validating dob
    var dob = gel('dob');
    if (isNotEmpty(dob.value) && isAdult(dob.value))
        details['dob'] = dob.value;
    else if (!isNotEmpty(dob.value)){
        showError(dob, "This field can't be empty");
        isFormValid = false;
    } else if (!isAdult(dob.value)) {
        showError(dob, "You must be 18+ to join");
        isFormValid = false;
    }

    //setting country
    var country = gel('country');
    details['country'] = country.value;

    //validating phone number
    var countryCode = gel('country-phone-code');
    var phone = gel('phone');
    if (isNotEmpty(phone.value) && isValidCountryCode(countryCode.value) && isValidPhone(phone.value))
        details['phone'] = countryCode.value + phone.value;
    else if (!isNotEmpty(phone.value)){
        showError(phone.parentNode, "This field can't be empty");
        isFormValid = false;
    } else if (!isValidCountryCode(countryCode.value)){
        showError(countryCode.parentNode, "Please provide a valid country code");
        isFormValid = false;
    } else if (!isValidPhone(phone.value)){
        showError(phone.parentNode, "Please provide a valid phone number");
        isFormValid = false;
    }

    //validating email
    var email = gel('email');
    if (isNotEmpty(email.value) && isValidEmail(email.value))
        details['email'] = email.value;
    else if (!isNotEmpty(email.value)){
        showError(email, "This field can't be empty");
        isFormValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, "Please provide a valid email");
        isFormValid = false;
    }

    //validating username
    var username = gel('username');
    if (isNotEmpty(username.value) && isValidUsername(username.value))
        details['username'] = username.value;
    else if (!isNotEmpty(username.value)){
        showError(username, "This field can't be empty");
        isFormValid = false;
    } else if (!isValidUsername(username.value)) {
        showError(username, "Username should be 6-15 character long and can contain only dot (.), hyphen (-) and underscore (_) as special characters");
        isFormValid = false;
    }

    //validating password
    var password = gel('password');
    var repassword = gel('repassword');
    if (isNotEmpty(password.value) && isValidPassword(password.value) && isNotEmpty(repassword.value) && areSame(password.value, repassword.value))
        details['password'] = password.value;
    else if (!isNotEmpty(password.value)){
        showError(password, "This field can't be empty");
        isFormValid = false;
    } else if (!isValidPassword(password.value)) {
        showError(password, "Password should be min 8 characters long with atleast one alphabet, one number and one special character");
        isFormValid = false;
    } else if (!isNotEmpty(repassword.value)){
        showError(repassword, "This field can't be empty");
        isFormValid = false;
    } else if (!areSame(password.value, repassword.value)) {
        showError(repassword, "Password didn't match");
        isFormValid = false;
    }

    return isFormValid;

}

function isLessThanMaxLength(value, max) {
    return (value.length <= max)
}

function isNotEmpty(value) {
	return !!value; 
}

function isAdult(value) {
    var dob = new Date(value);
    var today = Date.now();
    var age = Math.abs((new Date(today - dob.getTime())).getUTCFullYear() - 1970);
    return (age >= 18);
}

function isValidCountryCode(value) {
    // 1-3 digit long with + as optional
   	var pattern = /^(?:\(\+?\d{1,3}\)|\+?\d{1,3})$/;
    return pattern.test(value);
}

function isValidPhone(value) {
    // 10 digit number which may contain bracets () and hyphens -
   	var pattern = /^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/;
    return pattern.test(value);
}

function isValidEmail(value) {
    // email = (username with dot, hyphen and underscore) + @ + domain + extension 
    var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return pattern.test(value);
}

function isValidUsername(value) {
    // 6-15 character long and accepts only dot (.), hyphen (-) and underscore (_) as special characters
    var pattern = /^[\w\.\-]{6,15}$/;
    return pattern.test(value);
}

function isValidPassword(value) {
    // min 8 characters long with atleast one alphabet, one number and one special character
    var pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    return pattern.test(value);
}

function areSame(field1, field2) {
    return (field1 == field2);
}

function showError(field, msg) {
    var errorHolder = field.parentNode.getElementsByClassName('error_container')[0];
    errorHolder.style.display = 'block';
    errorHolder.innerHTML = msg;
}

function hideError(field) {
    var errorHolder = field.parentNode.getElementsByClassName('error_container')[0];
    errorHolder.style.display = 'none';
}

function hideAllErrors() {
    var errorHolders = document.getElementsByClassName('error_container');
    for (var i =0; i < errorHolders.length; i++) {
        errorHolders[i].style.display = 'none';
    }
}

function gel(id) {
    return document.getElementById(id);
}