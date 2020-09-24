/**
 * This file contains a configuration tool for trustnode tsn switches.
 * A configuration in JSON format is exchanged with a python flask application.
 * This app interacts with the underlying yang model based python framework to generate
 * NETCONF-XML and OPENFLOW Models for using a network.
 * 
 * @author: Alexander Mueller - mual-de - alexander.mueller3@tu-dresden.de
 * @version 0.0.1
 * 
 * CHANGELOG:
 */
var counter = 0;
var dataset = [];
var internalCountingSystem = [];

function storeConfiguration() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/engineering/storeConfig", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var configName = document.getElementById("config-name").value;
    var configDesc = document.getElementById("config-desc").value;
    xhr.send("dataset=" + JSON.stringify(dataset) + "&config-name=" + configName + "&config-desc=" + configDesc);
}

function updateConfiguration(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/engineering/updateConfig", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var configName = document.getElementById("config-name").value;
    var configDesc = document.getElementById("config-desc").value;
    xhr.send("dataset=" + JSON.stringify(dataset) + "&config-name=" + configName + "&config-desc=" + configDesc + "&config-id=" + id);
}

function addNewSwitch(internalCounter, datasetEntry = null) {
    if (datasetEntry == null) {
        // Create new Dataset entry with 
        dataset[internalCounter] = { "id": internalCounter, "uuid": "", "fpga_sw_active": false, "ovs_sw_active": false, "ovs_config": [], "fpga_config": { "TNflowtable": { "mastertable": {}, "config_time": "0" }, "TNtas": { "ports": { "0": { "id": "0", "GCL": {}, "gate_enable": false, "admin_cycle_time_ext": "0", "admin_base_time": "0" }, "1": { "id": "1", "GCL": {}, "gate_enable": false, "admin_cycle_time_ext": "0", "admin_base_time": "0" }, "2": { "id": "2", "GCL": {}, "gate_enable": false, "admin_cycle_time_ext": "0", "admin_base_time": "0" }, "3": { "id": "3", "GCL": {}, "gate_enable": false, "admin_cycle_time_ext": "0", "admin_base_time": "0" }, "4": { "id": "4", "GCL": {}, "gate_enable": false, "admin_cycle_time_ext": "0", "admin_base_time": "0" }, "5": { "id": "5", "GCL": {}, "gate_enable": false, "admin_cycle_time_ext": "0", "admin_base_time": "0" } } } } };
    } else {
        dataset[internalCounter] = datasetEntry;
    }
    createSwitchEntry(internalCounter)
    counter = internalCounter + 1;
    console.log(dataset)
}

function createSwitchEntry(internalCounter) {
    internalCountingSystem[internalCounter] = JSON.parse('{"fpga":{"gcl":[], "master":"0"},"ovs":0}');
    console.log(internalCountingSystem);
    var div = document.createElement("div");
    div.id = "switch-entry-" + String(dataset[internalCounter]["id"]);
    div.class = "switch-entry";
    div.innerHTML = "<hr> <h3> Switch</h3>";
    var fs = document.createElement("fieldset");
    // UUID 
    var uuidLabel = document.createElement("label");
    uuidLabel.innerText = "UUID: ";
    uuidLabel.htmlFor = "switch-uuid-" + String(dataset[internalCounter]["id"]);
    var uuidInput = document.createElement("input");
    uuidInput.id = "switch-uuid-" + String(dataset[internalCounter]["id"]);
    uuidInput.value = dataset[internalCounter]["uuid"];
    uuidInput.required = true;
    uuidInput.onchange = function() { updateField(uuidInput, internalCounter, "uuid", validateUUID) };
    fs.appendChild(uuidLabel);
    fs.appendChild(uuidInput);
    fs.appendChild(document.createElement("br"));
    // FPGA ACTIVE CHECKBOX
    var fpgaLabel = document.createElement("label");
    fpgaLabel.innerHTML = "FPGA switch active?:   ";
    fpgaLabel.htmlFor = "switch-fpga_active-" + String(dataset[internalCounter]["id"]);
    var fpgaActive = document.createElement("input");
    fpgaActive.type = "checkbox";
    fpgaActive.checked = dataset[internalCounter]["fpga_sw_active"];
    fpgaActive.id = "switch-fpga_active-" + String(dataset[internalCounter]["id"]);
    fs.appendChild(fpgaLabel);
    fs.appendChild(fpgaActive);
    fs.appendChild(document.createElement("br"));
    // OVS ACTIVE CHECKBOX
    var ovsLabel = document.createElement("label");
    ovsLabel.innerText = "OVS switch active?    ";
    var ovsActive = document.createElement("input");
    ovsLabel.for = ovsActive;
    ovsActive.type = "checkbox";
    ovsActive.checked = dataset[internalCounter]["ovs_sw_active"];
    ovsActive.id = "switch-ovs_active-" + String(dataset[internalCounter]["id"]);
    fs.appendChild(ovsLabel);
    fs.appendChild(ovsActive);
    div.append(fs);


    var fpgaDiv = document.createElement("div");
    var fpga_config_div = createFPGAConfig(internalCounter);

    fpgaActive.onchange = function() {
        if (fpgaActive.checked) {
            fpgaDiv.appendChild(fpga_config_div);
            dataset[internalCounter]["fpga_sw_active"] = true;
        } else {
            document.getElementById("switch-fpga_area-" + String(dataset[internalCounter]["id"])).remove();
            dataset[internalCounter]["fpga_sw_active"] = false;
        }
        console.log(dataset);
    };
    // If fpga sw active is set by default, show it!
    if (dataset[internalCounter]["fpga_sw_active"] == true) {
        console.log("TEST!");
        fpgaDiv.append(fpga_config_div);
    }
    div.append(fpgaDiv);

    var ovs_div = document.createElement("div");
    var ovs_config_div = createOVSFlowControlConfigurator(internalCounter);
    ovs_config_div.id = "switch-ovs_area-" + String(dataset[internalCounter]["id"]);
    ovsActive.onchange = function() {
            if (ovsActive.checked) {
                ovs_div.appendChild(ovs_config_div);
                dataset[internalCounter]["ovs_sw_active"] = true;
            } else {
                document.getElementById("switch-ovs_area-" + String(dataset[internalCounter]["id"])).remove();
                dataset[internalCounter]["ovs_sw_active"] = false;
            }
            console.log(dataset);
        }
        // If fpga sw active is set by default, show it!
    if (dataset[internalCounter]["ovs_sw_active"] == true) {
        console.log("TEST!");
        fpgaDiv.append(ovs_config_div);
    }
    div.append(ovs_div);




    document.getElementById("switch-area").append(div);
}



function updateField(inputField, internalCounter, objReference, validationFunction) {
    if (validationFunction(inputField)) {
        dataset[internalCounter][objReference] = inputField.value;
    }
}

/**
 * Create the fpga config area for a given switch!
 * @param {int} internalCounter 
 */
function createFPGAConfig(internalCounter) {
    var div = document.createElement("div");
    div.id = "switch-fpga_area-" + String(dataset[internalCounter]["id"]);
    div.innerHTML = "<h3>FPGA SWITCH EDITOR:</h3><h4>Flowcontrol:</h4>";
    // Create Flow Control
    div.appendChild(createFlowControlConfigurator(internalCounter));
    // Create Gate Control List
    var gclHeading = document.createElement("h4");
    gclHeading.innerText = "Gate Control List";
    div.appendChild(gclHeading);
    var twoColDiv = document.createElement("div");
    twoColDiv.setAttribute("class", "config-cgl-twocols-div");
    div.append(twoColDiv);
    for (var i = 0; i < 6; i++) {
        var cgldiv = createGCLTable(internalCounter, i);
        twoColDiv.append(cgldiv);
        if (i % 2 == 1) {
            twoColDiv = document.createElement("div");
            twoColDiv.setAttribute("class", "config-cgl-twocols-div");
            div.append(twoColDiv);
        }
    }
    return div;
}





function createGCLTable(internalCounter, portNumber) {
    internalCountingSystem[internalCounter]["fpga"]["gcl"][portNumber] = 0;
    var div = document.createElement("div");
    div.setAttribute("class", "config-gcl-div");
    var heading = document.createElement("h5");
    heading.innerText = "GCL for port #" + String(portNumber);
    var table_div = document.createElement("div");
    table_div.setAttribute("class", "config-cgl-table-div");
    var table = document.createElement("table");
    table.id = "gcl-table-" + String(internalCounter) + "-p-" + String(portNumber);
    table.setAttribute("class", "w3-table-all");
    var header = document.createElement("tr");
    header.setAttribute("class", "w3-theme");
    var idTh = document.createElement("th");
    idTh.innerText = "ID";
    header.appendChild(idTh);
    var matchTH = document.createElement("th");
    matchTH.innerText = "timeperiod"
    header.appendChild(matchTH);
    var actionTH = document.createElement("th");
    actionTH.innerText = "gatestates";
    header.appendChild(actionTH);
    table.appendChild(header);
    var addBTN = document.createElement("button");
    addBTN.innerText = "add row";
    addBTN.onclick = function() {
        // Add new row to json array
        let counter = internalCountingSystem[internalCounter]["fpga"]["gcl"][portNumber];
        dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["GCL"][counter] = JSON.parse('{"id":"' + String(counter) + '","timeperiod":"0","gatestates":"0"}');
        addGCLRow(internalCounter, portNumber, counter, table);
    };

    div.appendChild(heading);
    table_div.appendChild(table);
    div.appendChild(table_div);
    div.appendChild(addBTN);
    // in edit case, show existing entries
    if (dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["GCL"].length != 0) {
        console.log("There are some rows to add...");
        let len = Object.keys(dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["GCL"]).length;
        console.log(len);
        console.log(dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["GCL"]);
        for (var i = 0; i < len; i++) {
            let counter = internalCountingSystem[internalCounter]["fpga"]["gcl"][portNumber];
            addGCLRow(internalCounter, portNumber, counter, table);
        }
    }
    div.appendChild(document.createElement("br"));

    // Form for further informations
    var tasForm = document.createElement("form");
    // ENABLE gate control!
    var gateEnableLabel = document.createElement("label");
    gateEnableLabel.innerText = "Enable Gates:";
    var gateEnableBox = document.createElement("input");
    gateEnableBox.type = "checkbox";
    if (dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["gate_enable"]) {
        gateEnableBox.checked = true;
    }
    gateEnableBox.onchange = function() {
        dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["gate_enable"] = gateEnableBox.checked;
    }
    gateEnableLabel.for = gateEnableBox;
    tasForm.appendChild(gateEnableLabel);
    tasForm.appendChild(gateEnableBox);
    tasForm.appendChild(document.createElement("br"));
    // admin base time
    var adminBaseTimeLabel = document.createElement("label");
    adminBaseTimeLabel.innerText = "admin base time:";
    var adminBaseTimeBox = document.createElement("input");
    adminBaseTimeBox.type = "number";
    adminBaseTimeLabel.for = adminBaseTimeBox;
    adminBaseTimeBox.value = dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["admin_base_time"];
    adminBaseTimeBox.onchange = function() {
        dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["admin_base_time"] = adminBaseTimeBox.value;
    }
    tasForm.appendChild(adminBaseTimeLabel);
    tasForm.appendChild(adminBaseTimeBox);
    tasForm.appendChild(document.createElement("br"));
    // admin cycle time
    var adminCycleTimeLabel = document.createElement("label");
    adminCycleTimeLabel.innerText = "admin cycle time:";
    var adminCycleTimeBox = document.createElement("input");
    adminCycleTimeBox.type = "number";
    adminCycleTimeLabel.for = adminCycleTimeBox;
    adminCycleTimeBox.value = dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["admin_cycle_time_ext"];
    adminCycleTimeBox.onchange = function() {
        dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["admin_cycle_time_ext"] = adminCycleTimeBox.value;
    }
    tasForm.appendChild(adminCycleTimeLabel);
    tasForm.appendChild(adminCycleTimeBox);
    tasForm.appendChild(document.createElement("br"));


    div.appendChild(tasForm);
    return div;

}

function addGCLRow(internalCounter, portNumber, counter, table) {
    internalCountingSystem[internalCounter]["fpga"]["gcl"][portNumber] = counter + 1;
    var row = document.createElement("tr");
    row.id = "gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(counter);
    var id = document.createElement("td");
    id.contentEditable = true;
    id.innerText = dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["GCL"][counter]["id"];
    id.id = String(internalCounter) + ":" + String(portNumber) + ":" + String(counter) + ":id";
    id.addEventListener("input", storeGCLIDChangedValue);
    var tp = document.createElement("td");
    tp.contentEditable = true;
    tp.innerText = dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["GCL"][counter]["timeperiod"];
    tp.id = String(internalCounter) + ":" + String(portNumber) + ":" + String(counter) + ":tp";
    tp.addEventListener("input", storeGCLTPChangedValue);
    var gatestates = document.createElement("td");
    var btn0 = createGCLStateBtn(internalCounter, portNumber, counter, 0);
    gatestates.appendChild(btn0);
    var btn1 = createGCLStateBtn(internalCounter, portNumber, counter, 1);
    gatestates.appendChild(btn1);
    var btn2 = createGCLStateBtn(internalCounter, portNumber, counter, 2);
    gatestates.appendChild(btn2);
    var btn3 = createGCLStateBtn(internalCounter, portNumber, counter, 3);
    gatestates.appendChild(btn3);
    var btn4 = createGCLStateBtn(internalCounter, portNumber, counter, 4);
    gatestates.appendChild(btn4);
    var btn5 = createGCLStateBtn(internalCounter, portNumber, counter, 5);
    gatestates.appendChild(btn5);
    var btn6 = createGCLStateBtn(internalCounter, portNumber, counter, 6);
    gatestates.appendChild(btn6);
    var btn7 = createGCLStateBtn(internalCounter, portNumber, counter, 7);
    gatestates.appendChild(btn7);
    row.appendChild(id);
    row.appendChild(tp);
    row.appendChild(gatestates);
    table.appendChild(row);
}
/**
 * Change id if input has changed in gcl timeperiod field.
 * @param {*} input 
 */
function storeGCLTPChangedValue(input) {
    let tid = input["originalTarget"].id.split(':');
    dataset[parseInt(tid[0])]["fpga_config"]["TNtas"]["ports"][parseInt(tid[1])]["GCL"][parseInt(tid[2])]["timeperiod"] = input[["originalTarget"]].innerText.replace(/\n/g, "");;
}
/**
 * Change id if input has changed in gcl id field.
 * @param {*} input 
 */
function storeGCLIDChangedValue(input) {
    let tid = input["originalTarget"].id.split(':');
    dataset[parseInt(tid[0])]["fpga_config"]["TNtas"]["ports"][parseInt(tid[1])]["GCL"][parseInt(tid[2])]["id"] = input[["originalTarget"]].innerText.replace(/\n/g, "");;
}

/**
 * Create a cgl state checkbox button.
 * @param {int} internalCounter 
 * @param {int} portNumber 
 * @param {int} counter 
 * @param {int} btnNumber 
 */
function createGCLStateBtn(internalCounter, portNumber, counter, btnNumber) {
    var btn = document.createElement("input");
    btn.type = "checkbox";
    btn.id = "gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(counter) + "-btn" + String(btnNumber);
    btn.checked = ((dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["GCL"][counter]["gatestates"] >> btnNumber) % 2 != 0)
    btn.onchange = function() {
        var val = gateStateChange(internalCounter, portNumber, counter);
        dataset[internalCounter]["fpga_config"]["TNtas"]["ports"][portNumber]["GCL"][counter]["gatestates"] = val;
        console.log(dataset)
    }
    return btn;
}
/**
 * Get actual state of gate control list
 * @param {int} internalCounter internal number of switch in json array
 * @param {int} portNumber number of port the gcl is associated with
 * @param {int} rowCounter entry row in table 
 */
function gateStateChange(internalCounter, portNumber, rowCounter) {
    var value = 0;
    if (document.getElementById("gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(rowCounter) + "-btn0").checked) {
        value = value + 1;
    }
    if (document.getElementById("gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(rowCounter) + "-btn1").checked) {
        value = value + 2;
    }
    if (document.getElementById("gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(rowCounter) + "-btn2").checked) {
        value = value + 4;
    }
    if (document.getElementById("gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(rowCounter) + "-btn3").checked) {
        value = value + 8;
    }
    if (document.getElementById("gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(rowCounter) + "-btn4").checked) {
        value = value + 16;
    }
    if (document.getElementById("gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(rowCounter) + "-btn5").checked) {
        value = value + 32;
    }
    if (document.getElementById("gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(rowCounter) + "-btn6").checked) {
        value = value + 64;
    }
    if (document.getElementById("gcl-table-row-" + String(internalCounter) + "-p-" + String(portNumber) + "-l-" + String(rowCounter) + "-btn7").checked) {
        value = value + 128;
    }
    return value;
}