let jsb = {
    validationEmpty: function(chooseForm, chooseInput, errorText, chooseOuput){
    let formName = document.querySelector(chooseForm);
    formName.addEventListener('submit', (event) => {
        let errorHandling = true;
        let inputField = document.querySelector(chooseInput);
        let outputField = document.querySelector(chooseOuput);
        outputField.style.padding = "0.5em 2em";
        if (inputField.value == '') {
            event.preventDefault();
            errorHandling = false;
            inputErrorText = errorText;
            return outputField.textContent = inputErrorText;
        } else {
            errorHandling = true;
        }
    });
    }
};
