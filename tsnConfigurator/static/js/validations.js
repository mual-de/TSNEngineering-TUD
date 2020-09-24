/**
 * This file contains a function set for validating inputs of configuration.js and fpga_flowcontrol_configurator.js.
 * @author: Alexander Mueller - mual-de - alexander.mueller3@tu-dresden.de
 * @version 0.0.1
 * 
 * CHANGELOG:
 */

function validateUUID(inputField) {
    console.log("validate!")
    if (inputField.value == "") {
        inputField.style.borderColor = "red";
        inputField.validationMessage = "Set valid input!";
        return false;
    } else {
        inputField.style.borderColor = "green";
        return true;
    }
}

/**
 * Validates a given inputElement if innerText is a valid mac adress.
 * @param {e} inputField 
 */
function validateMACAdress(inputField) {
    console.log("MAC VALIDATION");
    console.log(inputField["originalTarget"]);
    let regexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
    let val = inputField["originalTarget"].innerText.replace(/\n/g, "");
    if (regexp.test(val)) {
        inputField["originalTarget"].style.borderColor = "green";
        inputField["originalTarget"].style.backgroundColor = "";
        return true;
    } else {
        inputField["originalTarget"].style.borderColor = "red";
        inputField["originalTarget"].style.backgroundColor = "red";
        inputField["originalTarget"].validationMessage = "Set valid input!";
        inputField["originalTarget"].focus();
        return false;
    }
}