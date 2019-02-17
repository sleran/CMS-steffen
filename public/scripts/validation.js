
let val = {

validationEmpty: function(chooseForm, chooseInput, errorText, chooseOuput){
    let formName = document.querySelector(chooseForm);
    formName.addEventListener('submit', (event) => {
        let errorHandling = true;
        let inputField = document.querySelector(chooseInput);
        let outputField = document.querySelector(chooseOuput);
        if (inputField.value == '') {
            event.preventDefault();
            errorHandling = false;
            inputErrorText = errorText;
            return outputField.textContent = inputErrorText;
        } else {
            errorHandling = true;
            return formName.submit();
        }
    })
}

};

val.validationEmtpy('#addMenuItem', '#nameInput', 'Udfyld et navn!', '.errorMessage');