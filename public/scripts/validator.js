let jsb = {

    validationEmpty: function(formCssSelector, inputCssSelector, errorText, chooseOuputCssSelector){
        
        const formListener = (formElement) => { 
            formElement.addEventListener('submit', (event) => {
            let errorHandling = true;
            let inputElement = inputCssSelector
            let outputField = document.querySelector(chooseOuputCssSelector);
                // Validerer for tomme felter (function)
                const checkForEmptyValue = (input) => {
                    if (input.value == '') {
                        event.preventDefault();
                        errorHandling = false;
                        input.style.border = "red solid 2px";
                        outputField.style.padding = "0.5em 2em";
                        inputErrorText = errorText;
                        return outputField.textContent = inputErrorText;
                    } else {
                        errorHandling = true;
                    }
                }
                // Tjekker om inputElementer er class eller id
                    if (inputElement.substr(0,1) == '.') {
                        let inputs = formElement.querySelectorAll(inputElement);
                        inputs.forEach((input) => {
                            checkForEmptyValue(input);
                        })
                    } 
                    else if (inputElement.substr(0,1) == '#') {
                        let input = document.querySelector(inputElement);
                        checkForEmptyValue(input);
                    }
            });
        }

        // Tjekker om formElementer er class eller id 
        if (formCssSelector.substr(0,1) == '#') {
            let formElement = document.querySelector(formCssSelector);
            formListener(formElement);
        }
        if (formCssSelector.substr(0,1) == '.') {
            let formElements = document.querySelectorAll(formCssSelector);
            formElements.forEach((formElement) => {
                formListener(formElement);
            })
        }
    }
};
