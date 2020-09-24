function createOVSFlowControlConfigurator(internalCounter) {
    var flowDiv = document.createElement("div");
    var heading = document.createElement("h3");
    heading.innerText = "OVS FLOWTABLE EDITOR";
    flowDiv.appendChild(heading);
    flowDiv.appendChild(createOVSFlowControlTable(internalCounter));
    flowDiv.appendChild(createOVSFlowRuleEditor(internalCounter));
    return flowDiv;
}



function createOVSFlowControlTable(internalCounter) {
    var div = document.createElement("div");
    div.setAttribute("class", "config-flowtable-div");
    var table = document.createElement("table");
    table.setAttribute("class", "w3-table-all")
    table.id = "switch-ovs_area-flow-table-" + String(dataset[internalCounter]["id"]);
    var header = document.createElement("tr");
    var idTh = document.createElement("th");
    idTh.innerText = "ID";
    idTh.setAttribute("width", "50px");
    header.appendChild(idTh);
    var matchTH = document.createElement("th");
    matchTH.innerText = "MATCH"
    header.appendChild(matchTH);
    var actionTH = document.createElement("th");
    actionTH.innerText = "ACTION";
    header.appendChild(actionTH);
    var deleteTH = document.createElement("th");
    deleteTH.innerText = "delete";
    deleteTH.setAttribute("width", "100px");
    header.append(deleteTH);
    table.appendChild(header);

    div.appendChild(table);
    return div;
}

function createOVSFlowRuleEditor(internalCounter) {
    let div = document.createElement("div");
    let fs = document.createElement("fieldset");
    let lgd = document.createElement("legend");
    lgd.innerText = "create new rule";
    fs.appendChild(lgd);
    fs.appendChild(createOVSMatchInputs(internalCounter));
    fs.appendChild(createOVSActionInputs(internalCounter));


    let btn = document.createElement("button");
    btn.innerText = "Add new Rule";
    btn.onclick = function() {
        console.log("START READING");
        getInputsAndCreateFlowData(internalCounter);
    };
    fs.appendChild(btn);
    div.appendChild(fs);
    return div;
}

function createOVSActionInputs(internalCounter) {
    let fs = document.createElement("fieldset");
    let lgd = document.createElement("legend");
    lgd.innerText = "action";
    fs.appendChild(lgd);

    let lblOutPort = document.createElement("label");
    lblOutPort.innerText = "output port:";
    let inOutPort = document.createElement("input");
    inOutPort.setAttribute("class", "w3-input");
    inOutPort.type = "number";
    inOutPort.setAttribute("min", "1");
    inOutPort.setAttribute("max", "16");
    lblOutPort.for = inOutPort;
    inOutPort.id = "switch-ovs_area-add_rule-outPort-" + String(dataset[internalCounter]["id"]);
    fs.appendChild(lblOutPort);
    fs.appendChild(inOutPort);

    fs.appendChild(document.createElement("br"));
    let lblTypeField = document.createElement("label");
    lblTypeField.innerText = "set action type:";
    let typeField = document.createElement("input");
    typeField.setAttribute("class", "w3-input");
    lblTypeField.id = "switch-ovs_area-add_rule-typeField-" + String(dataset[internalCounter]["id"]);
    fs.appendChild(lblTypeField);
    fs.appendChild(typeField);
    fs.appendChild(document.createElement("br"));

    let lblSetField = document.createElement("label");
    lblSetField.innerText = "set field:";

    let inField = document.createElement("input");
    inField.type = "text";
    inField.setAttribute("class", "w3-input");
    inField.id = "switch-ovs_area-add_rule-inField-" + String(dataset[internalCounter]["id"]);

    let inFieldValue = document.createElement("input");
    inFieldValue.type = "text";
    inFieldValue.setAttribute("class", "w3-input");
    inFieldValue.id = "switch-ovs_area-add_rule-inFieldValue-" + String(dataset[internalCounter]["id"]);

    let helpURL = document.createElement("a");
    helpURL.setAttribute("href", "https://ryu.readthedocs.io/en/latest/app/ofctl_rest.html#example-of-set-field-action");
    helpURL.setAttribute("target", "_blank");
    helpURL.setAttribute("rel", "noopener noreferrer");
    helpURL.innerText = "see API for more informations";
    fs.appendChild(lblSetField);
    fs.appendChild(inField);
    fs.appendChild(inFieldValue);
    fs.appendChild(helpURL);

    return fs;
}

function createOVSMatchInputs(internalCounter) {
    let fs = document.createElement("fieldset");
    let lgd = document.createElement("legend");
    lgd.innerText = "match";
    fs.appendChild(lgd);
    let lblInPort = document.createElement("label");
    lblInPort.innerText = "Switch input port:";
    let inInPort = document.createElement("input");
    lblInPort.for = inInPort;
    inInPort.id = "switch-ovs_area-add_rule-inPort-" + String(dataset[internalCounter]["id"]);
    inInPort.type = "number";
    inInPort.setAttribute("min", "1");
    inInPort.setAttribute("max", "16");
    fs.appendChild(lblInPort);
    fs.appendChild(inInPort);

    fs.appendChild(document.createElement("br"));

    let lblEthDst = document.createElement("label");
    lblEthDst.innerText = "Ethernet Destination address:";
    let inEthDst = document.createElement("input");
    inEthDst.type = "text";
    inEthDst.id = "switch-ovs_area-add_rule-inEthDst-" + String(dataset[internalCounter]["id"]);
    lblEthDst.for = inEthDst;
    fs.appendChild(lblEthDst);
    fs.appendChild(inEthDst);

    fs.appendChild(document.createElement("br"));

    let lblEthSrc = document.createElement("label");
    lblEthSrc.innerText = "Ethernet source address:";
    let inEthSrc = document.createElement("input");
    inEthSrc.type = "text";
    inEthSrc.id = "switch-ovs_area-add_rule-inEthSrc-" + String(dataset[internalCounter]["id"]);
    lblEthSrc.for = inEthSrc;
    fs.appendChild(lblEthSrc);
    fs.appendChild(inEthSrc);

    fs.appendChild(document.createElement("br"));

    let lblEthType = document.createElement("label");
    lblEthType.innerText = "Ethernet type:";
    let inEthType = document.createElement("input");
    inEthType.type = "number";
    inEthType.id = "switch-ovs_area-add_rule-inEthType-" + String(dataset[internalCounter]["id"]);
    lblEthType.for = inEthType;
    fs.appendChild(lblEthType);
    fs.appendChild(inEthType);

    fs.appendChild(document.createElement("br"));

    let lblIPv4Src = document.createElement("label");
    lblIPv4Src.innerText = "IPv4 source adress:";
    let inIPv4Src = document.createElement("input");
    inIPv4Src.type = "text";
    inIPv4Src.id = "switch-ovs_area-add_rule-inIPv4Src-" + String(dataset[internalCounter]["id"]);
    lblIPv4Src.for = inIPv4Src;
    fs.appendChild(lblIPv4Src);
    fs.appendChild(inIPv4Src);

    fs.appendChild(document.createElement("br"));

    let lblIPv4Dst = document.createElement("label");
    lblIPv4Dst.innerText = "IPv4 source adress:";
    let inIPv4Dst = document.createElement("input");
    inIPv4Dst.type = "text";
    inIPv4Dst.id = "switch-ovs_area-add_rule-inIPv4Dst-" + String(dataset[internalCounter]["id"]);
    lblIPv4Dst.for = inIPv4Dst;
    fs.appendChild(lblIPv4Dst);
    fs.appendChild(inIPv4Dst);

    return fs;
}

function getInputsAndCreateFlowData(internalCounter) {
    let jsonData = {};
    jsonData["match"] = {};
    // Match Part
    // INPUT PORT
    let inPort = document.getElementById("switch-ovs_area-add_rule-inPort-" + String(dataset[internalCounter]["id"]));
    if (inPort.value != "") {
        jsonData["match"]["in_port"] = parseInt(inPort.value);
        inPort.value = "";
    }
    // ETHERNET DESTINATION
    let ethDst = document.getElementById("switch-ovs_area-add_rule-inEthDst-" + String(dataset[internalCounter]["id"]));
    if (ethDst.value != "") {
        jsonData["match"]["dl_dst"] = ethDst.value;
        ethDst.value = "";
    }
    // MAC SRC
    let ethSrc = document.getElementById("switch-ovs_area-add_rule-inEthSrc-" + String(dataset[internalCounter]["id"]));
    if (ethSrc.value != "") {
        jsonData["match"]["dl_dst"] = ethSrc.value;
        ethSrc.value = "";
    }
    // ETHERTYPE
    let ethType = document.getElementById("switch-ovs_area-add_rule-inEthType-" + String(dataset[internalCounter]["id"]));
    if (ethType.value != "") {
        jsonData["match"]["dl_type"] = parseInt(ethType.value);
        ethType.value = "";
    }

    let ipv4src = document.getElementById("switch-ovs_area-add_rule-inIPv4Src-" + String(dataset[internalCounter]["id"]));
    if (ipv4src.value != "") {
        jsonData["match"]["nw_src"] = ipv4src.value;
        ipv4src.value = "";
    }

    let ipv4dst = document.getElementById("switch-ovs_area-add_rule-inIPv4Dst-" + String(dataset[internalCounter]["id"]));
    if (ipv4dst.value != "") {
        jsonData["match"]["nw_src"] = ipv4dst.value;
        ipv4dst.value = "";
    }

    // ACTION
    jsonData["actions"] = [];
    let outport = document.getElementById("switch-ovs_area-add_rule-outPort-" + String(dataset[internalCounter]["id"]));
    if (outport.value != "") {
        let jsonOutData = {};
        jsonOutData["type"] = "OUTPUT";
        jsonOutData["port"] = parseInt(outport.value);
        jsonData["actions"].push(jsonOutData);
        outport.value = "";
    }
    let field = document.getElementById("switch-ovs_area-add_rule-inField-" + String(dataset[internalCounter]["id"]));
    let typeField = document.getElementById("switch-ovs_area-add_rule-typeField-" + String(dataset[internalCounter]["id"]));
    let fieldValue = document.getElementById("switch-ovs_area-add_rule-inFieldValue-" + String(dataset[internalCounter]["id"]));

    if ((field.value != "") && (fieldValue.value != "") && (typeField.value != "")) {
        let jsonOutData = {};
        jsonOutData["type"] = uptypeField.value.toUpperCase();
        jsonData[field.value] = fieldValue.value;
        field.value = "";
        fieldValue.value = "";
        typeField.value = "";
        jsonData["actions"].push(jsonOutData);
    }
    console.log(jsonData);
    let counter = internalCountingSystem[internalCounter]["ovs"];
    addOVSFlowRule(internalCounter, counter, jsonData);
    internalCountingSystem[internalCounter]["ovs"] = counter + 1;
}

function addOVSFlowRule(internalCounter, counter, internaleJsonData) {
    console.log(internalCounter);
    console.log(counter);
    console.log(internaleJsonData);
    let table = document.getElementById("switch-ovs_area-flow-table-" + String(dataset[internalCounter]["id"]));

    let tr = document.createElement("tr");
    tr.id = "switch-ovs_area-flow-table-" + String(dataset[internalCounter]["id"]) + "-row-" + String(counter);

    let id = document.createElement("td");
    id.innerText = String(counter);
    let ma = document.createElement("td");
    ma.innerText = JSON.stringify(internaleJsonData["match"]);
    ma.id = String(internalCounter) + ":" + String(counter) + ":ma";
    ma.contentEditable = true;
    ma.addEventListener("input", storeOVSMatchChangedValue);

    let ac = document.createElement("td");
    ac.innerText = JSON.stringify(internaleJsonData["actions"]);
    ac.id = String(internalCounter) + ":" + String(counter) + ":ac";
    ac.contentEditable = true;
    ac.addEventListener("input", storeOVSActionChangedValue);

    let del = document.createElement("td");
    del.innerText = "delete";
    del.setAttribute("class", "w3-button");
    del.onclick = function() {
        document.getElementById("switch-ovs_area-flow-table-" + String(dataset[internalCounter]["id"]) + "-row-" + String(counter)).remove();
        dataset[internalCounter]["ovs_config"].splice(counter, 1);
    };

    tr.appendChild(id);
    tr.appendChild(ma);
    tr.appendChild(ac);
    tr.appendChild(del);

    table.appendChild(tr);
    dataset[internalCounter]["ovs_config"][counter] = internaleJsonData;
    console.log(dataset);
}

function storeOVSMatchChangedValue(input) {
    let tid = input["originalTarget"].id.split(':');
    dataset[parseInt(tid[0])]["ovs_config"][parseInt(tid[1])]["match"] = JSON.parse(input[["originalTarget"]].innerText.replace(/\n/g, ""));
}

function storeOVSActionChangedValue(input) {
    let tid = input["originalTarget"].id.split(':');
    dataset[parseInt(tid[0])]["ovs_config"][parseInt(tid[1])]["actions"] = JSON.parse(input[["originalTarget"]].innerText.replace(/\n/g, ""));
}