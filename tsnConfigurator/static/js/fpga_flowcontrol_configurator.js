var actionCounter = [];
var actionDataSet = [];
var fpgaTemplates = [];
var fpgaTemplatesOptions = [];

function createFlowControlConfigurator(internalCounter) {
    var flowDiv = document.createElement("div");
    flowDiv.appendChild(createFlowControlTable(internalCounter));
    flowDiv.appendChild(createFlowControlElements(internalCounter));

    return flowDiv;
}

function addFPGATemplates(fpgaTemplate) {

}

function createFlowControlElements(internalCounter) {
    var flowFilterDiv = document.createElement("div");
    var fs = document.createElement("fieldset");
    var lgd = document.createElement("legend");
    lgd.innerText = "Template tools";
    fs.appendChild(lgd);
    var storeBtn = document.createElement("button");
    storeBtn.innerText = "Store FlowTable as Template";
    storeBtn.onclick = function() {
        var name = prompt("Please a template name:", "template");
        if (!(name == null || name == "")) {
            let flowtableData = dataset[internalCounter]["fpga_config"]["TNflowtable"]["mastertable"];
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/engineering/storeFPGAFlowControlRule", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send("dataset=" + JSON.stringify(flowtableData) + "&template-name=" + name);
        }
    }
    fs.appendChild(storeBtn);
    var selectBox = document.createElement("select");
    fs.appendChild(selectBox);
    var loadTemplate = document.createElement("button");
    loadTemplate.innerText = "Load Template";
    fs.appendChild(loadTemplate);
    flowFilterDiv.appendChild(fs);
    flowFilterDiv.appendChild(createFlowControlFilter(internalCounter));
    return flowFilterDiv;
}
/**
 * create a <table> for fpga flow control entries
 * @param {int} internalCounter number of switches created, used to identify this sections
 */
function createFlowControlTable(internalCounter) {
    var div = document.createElement("div");
    div.setAttribute("class", "config-flowtable-div");
    var table = document.createElement("table");
    table.setAttribute("class", "w3-table-all")
    table.id = "switch-fpga_area-flow-table-" + String(dataset[internalCounter]["id"]);
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

/**
 * Build an input section for creating new fpga flow control entries.
 * @param {int} internalCounter 
 */
function createFlowControlFilter(internalCounter) {
    var div = document.createElement("div");
    div.setAttribute("class", "flow-control-filter-select-panel");
    div.id = "flow-control-filter-select-panel-" + String(internalCounter);
    var fs = document.createElement("fieldset");
    var lgd = document.createElement("legend");
    lgd.innerText = "Create new flowcontrol filter:";
    fs.appendChild(lgd);
    var portLabl = document.createElement("label");
    portLabl.innerText = "port:";
    var portInput = document.createElement("input");
    //portInput.setAttribute("class", "w3-input");
    portInput.type = "number";
    portInput.id = "switch-fpga_area-flow-port-" + String(dataset[internalCounter]["id"]);
    portInput.setAttribute("max", "31");
    portInput.setAttribute("min", "0");
    portInput.setAttribute("default", "0");
    portLabl.for = portInput
    fs.appendChild(portLabl);
    fs.appendChild(portInput);
    var matchDiv = document.createElement("div");
    matchDiv.setAttribute("class", "w3-container")
    matchDiv.innerHTML = "<h4>filter parameters</h4>";
    matchDiv.appendChild(createFlowControlFilterMatchEthernet(internalCounter));
    matchDiv.appendChild(createFlowControlFilterIPMatch(internalCounter));
    matchDiv.appendChild(createFlowControlFilterVLANMatch(internalCounter));
    fs.appendChild(matchDiv);
    var actionDiv = document.createElement("div");
    actionDiv.setAttribute("class", "w3-container");
    actionDiv.innerHTML = "<h4>actions</h4>";
    actionDiv.appendChild(createFlowControlFilterAction(internalCounter));
    fs.appendChild(actionDiv);
    var addBtn = document.createElement("button");
    addBtn.innerText = "Add Filter";
    actionCounter[internalCounter] = 0;
    actionDataSet[internalCounter] = {};
    addBtn.onclick = function() {
        addFlowControlRule(internalCounter);
        actionCounter[internalCounter] = 0;
        actionDataSet[internalCounter] = {};
    }
    fs.appendChild(addBtn);
    div.appendChild(fs);
    return div;
}
/**
 * Create a ethernet input filter
 * @param {int} internalCounter 
 */
function createFlowControlFilterMatchEthernet(internalCounter) {
    var div = document.createElement("div");
    div.setAttribute("class", "w3-container w3-cell config-flow-matchbox ");
    var ethMatchLbl = document.createElement("h5")
    ethMatchLbl.innerText = "Ethernet Match";
    div.appendChild(ethMatchLbl);
    var table = document.createElement("table");
    var msr = document.createElement("tr");
    var macSrcLbl = document.createElement("td");
    macSrcLbl.innerText = "source mac:";
    macSrcLbl.setAttribute("width", "30%");
    var macSrcBox = document.createElement("td");
    macSrcBox.id = "switch-fpga_area-flow-macsrc-" + String(dataset[internalCounter]["id"]);
    macSrcBox.innerText = "";
    macSrcBox.contentEditable = true;
    macSrcBox.setAttribute("width", "70%");
    macSrcBox.setAttribute("class", "w3-input");
    macSrcBox.addEventListener('input', validateMACAdress);
    msr.appendChild(macSrcLbl);
    msr.appendChild(macSrcBox);
    table.appendChild(msr);
    var mdr = document.createElement("tr");
    var macDstLbl = document.createElement("td");
    macDstLbl.innerText = "dest mac:";
    var macDstBox = document.createElement("td");
    macDstBox.id = "switch-fpga_area-flow-macdst-" + String(dataset[internalCounter]["id"]);
    macDstBox.contentEditable = true;
    macDstBox.setAttribute("class", "w3-input");
    macDstBox.value = ""
    macDstBox.addEventListener('input', validateMACAdress);
    mdr.appendChild(macDstLbl);
    mdr.appendChild(macDstBox);
    table.appendChild(mdr);
    var etr = document.createElement("tr");
    var etherTypeLbl = document.createElement("td");
    etherTypeLbl.innerText = "ether type:";
    var etherTypeBox = document.createElement("td");
    etherTypeBox.contentEditable = true;
    etherTypeBox.id = "switch-fpga_area-flow-ethertype-" + String(dataset[internalCounter]["id"]);
    etherTypeBox.setAttribute("class", "w3-input");
    etr.appendChild(etherTypeLbl);
    etr.appendChild(etherTypeBox);
    table.appendChild(etr);
    div.appendChild(table);
    return div;
}
/**
 * Create VLAN ID Match filter
 * @param {int} internalCounter 
 */
function createFlowControlFilterVLANMatch(internalCounter) {
    var div = document.createElement("div");
    div.setAttribute("class", "w3-container w3-cell config-flow-matchbox ");
    var vlanHeader = document.createElement("h5");
    vlanHeader.innerText = "VLAN Match"
    div.appendChild(vlanHeader);
    var lbl = document.createElement("label");
    lbl.innerText = "VLAN ID:";
    var vlanID = document.createElement("input");
    vlanID.setAttribute("class", "w3-input");
    vlanID.id = "switch-fpga_area-flow-vlanid-" + String(dataset[internalCounter]["id"]);
    lbl.for = vlanID;

    div.appendChild(lbl);
    div.appendChild(vlanID);


    return div;
}

function createFlowControlFilterIPMatch(internalCounter) {
    var div = document.createElement("div");
    div.setAttribute("class", "w3-container w3-cell config-flow-matchbox ");
    var ipHeader = document.createElement("h5");
    ipHeader.innerText = "IP Match"
    div.appendChild(ipHeader);

    var table = document.createElement("table");

    var tr1 = document.createElement("tr");
    var lblProtocol = document.createElement("td");
    lblProtocol.setAttribute("width", "30%");
    lblProtocol.innerText = "ip-protocol:";
    tr1.appendChild(lblProtocol);
    var inProtocol = document.createElement("td");
    inProtocol.setAttribute("class", "w3-input");
    inProtocol.contentEditable = true;
    inProtocol.setAttribute("width", "70%");
    inProtocol.id = "switch-fpga_area-flow-ipprotocol-" + String(dataset[internalCounter]["id"]);
    tr1.appendChild(inProtocol);
    table.appendChild(tr1);
    var tr2 = document.createElement("tr");
    var lblSrc = document.createElement("td");
    lblSrc.innerText = "source ip:";
    tr2.appendChild(lblSrc);
    var inSrc = document.createElement("td");
    inSrc.contentEditable = true;
    inSrc.setAttribute("class", "w3-input");
    inSrc.id = "switch-fpga_area-flow-ipsrc-" + String(dataset[internalCounter]["id"]);
    tr2.appendChild(inSrc);
    table.appendChild(tr2);
    var tr3 = document.createElement("tr");
    var lblDst = document.createElement("td");
    lblDst.innerText = "dest ip:";
    tr3.appendChild(lblDst);
    var inDst = document.createElement("td");
    inDst.contentEditable = true;
    inDst.setAttribute("class", "w3-input");
    inDst.id = "switch-fpga_area-flow-ipdst-" + String(dataset[internalCounter]["id"]);
    tr3.appendChild(inDst);
    table.appendChild(tr3);
    div.appendChild(table);


    return div;
}


function addFlowControlRule(internalCounter, existingData = null) {
    id_counter = internalCountingSystem[internalCounter]["fpga"]["master"];
    var flowControlRule;
    if (existingData == null) {
        flowControlRule = createFlowControlRule(internalCounter, id_counter);
    } else {
        flowControlRule = existingData;
    }
    var newRow = document.createElement("tr");
    newRow.id = "switch-fpga_area-flow-table-" + String(dataset[internalCounter]["id"]) + "-row-" + String(id_counter);
    var idTd = document.createElement("td");
    idTd.innerText = id_counter;
    idTd.contentEditable = true;
    newRow.appendChild(idTd);
    var ruleTd = document.createElement("td");
    ruleTd.innerText = JSON.stringify(flowControlRule["match"]);
    ruleTd.contentEditable = true;
    ruleTd.id = "switch-fpga_area-flow-table-" + String(dataset[internalCounter]["id"]) + "-rule-" + String(id_counter);
    ruleTd.onchange = function() { flowControlFilterUpdate(internalCounter, id_counter); };
    newRow.appendChild(ruleTd);
    var actionTd = document.createElement("td");
    actionTd.innerText = JSON.stringify(flowControlRule["action"]);
    actionTd.contentEditable = true;
    newRow.appendChild(actionTd);
    var deleteTd = document.createElement("td");
    deleteTd.innerText = "delete";
    deleteTd.setAttribute("class", "w3-button");
    deleteTd.onclick = function() { flowControlDeleteRow(internalCounter, id_counter) };
    newRow.appendChild(deleteTd);
    var table = document.getElementById("switch-fpga_area-flow-table-" + String(dataset[internalCounter]["id"]));
    table.appendChild(newRow);
    if (existingData == null) {
        dataset[internalCounter]["fpga_config"]["TNflowtable"]["mastertable"][internalCountingSystem[internalCounter]["fpga"]["master"]] = flowControlRule;
        // Empty action table!
        emptyControlFlowActionTable(internalCounter, actionCounter[internalCounter]);
    }
    dataset[internalCounter]["fpga_config"]["TNflowtable"]["mastertable"][internalCountingSystem[internalCounter]["fpga"]["master"]] = flowControlRule;
    internalCountingSystem[internalCounter]["fpga"]["master"] = String(parseInt(id_counter) + 1);

}

function createFlowControlRule(internalCounter, id_counter) {
    var flowControlRule = JSON.parse('{"id":"", "match":{}, "action":{}}');
    flowControlRule["id"] = id_counter;
    console.log(internalCounter);
    var in_port = document.getElementById("switch-fpga_area-flow-port-" + String(dataset[internalCounter]["id"])).value;
    document.getElementById("switch-fpga_area-flow-port-" + String(dataset[internalCounter]["id"])).value = "";
    flowControlRule["match"]["in-port"] = in_port;
    // IP-Match
    var destIp = document.getElementById("switch-fpga_area-flow-ipdst-" + String(dataset[internalCounter]["id"])).innerText;
    document.getElementById("switch-fpga_area-flow-ipdst-" + String(dataset[internalCounter]["id"])).innerText = "";
    var srcIp = document.getElementById("switch-fpga_area-flow-ipsrc-" + String(dataset[internalCounter]["id"])).innerText;
    document.getElementById("switch-fpga_area-flow-ipsrc-" + String(dataset[internalCounter]["id"])).innerText = "";
    var protocol = document.getElementById("switch-fpga_area-flow-ipprotocol-" + String(dataset[internalCounter]["id"])).innerText;
    document.getElementById("switch-fpga_area-flow-ipprotocol-" + String(dataset[internalCounter]["id"])).innerText = "";

    /*flowControlRule["match"]["ip-match"]["dest"] = destIp.replace(/\n/g, "");
    flowControlRule["match"]["ip-match"]["src"] = srcIp.replace(/\n/g, "");
    flowControlRule["match"]["ip-match"]["ip-protocol"] = protocol.replace(/\n/g, "");
    */
    // Eth-Match
    let macSrc = document.getElementById("switch-fpga_area-flow-macsrc-" + String(dataset[internalCounter]["id"])).innerText;
    macSrc = macSrc.replace(/\n/g, "");
    document.getElementById("switch-fpga_area-flow-macsrc-" + String(dataset[internalCounter]["id"])).innerText = "";
    let macDst = document.getElementById("switch-fpga_area-flow-macdst-" + String(dataset[internalCounter]["id"])).innerText;
    macDst = macDst.replace(/\n/g, "");
    document.getElementById("switch-fpga_area-flow-macdst-" + String(dataset[internalCounter]["id"])).innerText = "";
    let ethertype = document.getElementById("switch-fpga_area-flow-ethertype-" + String(dataset[internalCounter]["id"])).innerText;
    ethertype = ethertype.replace(/\n/g, "");
    document.getElementById("switch-fpga_area-flow-ethertype-" + String(dataset[internalCounter]["id"])).innerText = "";
    if (macSrc != "") {
        if (!flowControlRule.hasOwnProperty("ethernet-match")) {
            flowControlRule["match"]["ethernet-match"] = {};
        }
        flowControlRule["match"]["ethernet-match"]["ethernet-source"] = {};
        flowControlRule["match"]["ethernet-match"]["ethernet-source"]["address"] = macSrc;
    }
    if (macDst != "") {
        if (!flowControlRule.hasOwnProperty("ethernet-match")) {
            flowControlRule["match"]["ethernet-match"] = {};
        }
        flowControlRule["match"]["ethernet-match"]["ethernet-destination"] = {};
        flowControlRule["match"]["ethernet-match"]["ethernet-destination"]["address"] = macSrc;
    }
    if (ethertype != "") {
        if (!flowControlRule.hasOwnProperty("ethernet-match")) {
            flowControlRule["match"]["ethernet-match"] = {};
        }
        flowControlRule["match"]["ethernet-match"]["ethernet-type"] = {};
        flowControlRule["match"]["ethernet-match"]["ethernet-type"]["type"] = ethertype;
    }

    // Vlan-Match
    var vlanid = document.getElementById("switch-fpga_area-flow-vlanid-" + String(dataset[internalCounter]["id"])).innerText;
    document.getElementById("switch-fpga_area-flow-vlanid-" + String(dataset[internalCounter]["id"])).innerText = "";
    //flowControlRule["match"]["vlan-match"]["vlan-id"] = vlanid.replace(/\n/g, "");
    // Action Rule
    var action = actionDataSet[internalCounter];
    flowControlRule["action"]["action"] = action;
    console.log(flowControlRule);
    return flowControlRule;
}

function flowControlFilterUpdate(internalCounter, id_counter) {
    var rule = document.getElementById("switch-fpga_area-flow-table-" + String(dataset[internalCounter]["id"]) + "-rule-" + String(id_counter)).innerText;
    dataset[internalCounter]["fpga_config"]["TNflowtable"]["mastertable"][id_counter]["filter"] = JSON.parse(rule);
    console.log(dataset);
}

function flowControlDeleteRow(internalCounter, id_counter) {
    document.getElementById("switch-fpga_area-flow-table-" + String(dataset[internalCounter]["id"]) + "-row-" + String(id_counter)).remove();
    delete dataset[internalCounter]["fpga_config"]["TNflowtable"]["mastertable"][id_counter];
}

function createFlowControlRecipeSelect(internalCounter) {
    var recipeDiv = document.createElement("div");
    recipeDiv.id = "flow-control-filter-select-panel-" + String(internalCounter);
    recipeDiv.innerHTML = "TESTR";
    return recipeDiv;
}

function createFlowControlFilterAction(internalCounter) {
    var div = document.createElement("div");
    div.appendChild(createFlowControlActionTable(internalCounter));
    div.appendChild(createFlowControlActionSelect(internalCounter));

    return div;
}


function createFlowControlActionTable(internalCounter) {
    var tableDiv = document.createElement("div");
    tableDiv.setAttribute("class", "config-flowtable-div");
    var table = document.createElement("table");
    table.setAttribute("class", "w3-table-all");
    table.id = "flow-control-action-view-table-" + String(internalCounter);
    var row = document.createElement("tr");
    var idTh = document.createElement("th");
    idTh.innerText = "order";
    row.appendChild(idTh);
    var actionTh = document.createElement("th");
    actionTh.innerText = "action";
    row.appendChild(actionTh);
    var deleteTh = document.createElement("th");
    deleteTh.innerText = "delete";
    row.appendChild(deleteTh);
    table.appendChild(row);
    tableDiv.appendChild(table);
    return tableDiv;
}

function createFlowControlActionSelect(internalCounter) {
    var div = document.createElement("div");
    var fs = document.createElement("fieldset");
    var lgd = document.createElement("legend");
    lgd.innerText = "select action type";
    fs.appendChild(lgd);
    var outputPort = actionOutputPort(internalCounter);
    var dropAction = actionDrop(internalCounter);
    var queueAction = actionQueue(internalCounter);
    var modifyAction = actionModify(internalCounter);
    var sel = document.createElement("select");
    var opOption = document.createElement("option");
    opOption.innerText = "output port";
    sel.appendChild(opOption);
    var quOption = document.createElement("option");
    quOption.innerText = "queue action";
    sel.appendChild(quOption);
    var daOption = document.createElement("option");
    daOption.innerText = "drop action";
    sel.appendChild(daOption);
    var modOption = document.createElement("option");
    modOption.innerText = "modify option";
    sel.appendChild(modOption);
    fs.appendChild(sel);
    div.appendChild(fs);
    fs.appendChild(outputPort);
    sel.onchange = function() {
        console.log(sel.value);
        console.log("flow-control-action-add-field-" + String(internalCounter));
        document.getElementById("flow-control-action-add-field-" + String(internalCounter)).remove();
        if (sel.value == "output port") {
            fs.appendChild(outputPort);
        } else if (sel.value == "queue action") {
            console.log("HGE");
            fs.appendChild(queueAction);
        } else if (sel.value == "drop action") {
            fs.appendChild(dropAction);
        } else {
            fs.appendChild(modifyAction);
        }

    }

    return div;
}

function actionOutputPort(internalCounter) {
    var div = document.createElement("div");
    div.id = "flow-control-action-add-field-" + String(internalCounter);
    var fs = document.createElement("fieldset");
    var leg = document.createElement("legend");
    leg.innerText = "output port";
    fs.appendChild(leg);
    var oplbl = document.createElement("label");
    oplbl.innerText = "output port:";
    fs.append(oplbl);
    var op = document.createElement("input");
    oplbl.for = op;
    op.type = "number";
    op.id = "flow-control-action-op-" + String(internalCounter);
    fs.appendChild(op);
    var addAction = document.createElement("button");
    addAction.innerText = "add action";
    addAction.onclick = function() {
        console.log(op.innerText);
        var counter = actionCounter[internalCounter];
        ownDataset = {};
        ownDataset["order"] = counter;
        ownDataset["output-action"] = JSON.parse('{"output-port":"' + op.value + '"}')
        addActionTableRow(internalCounter, counter, ownDataset);
        op.value = "";
        actionCounter[internalCounter] = counter + 1;
    }
    fs.appendChild(addAction);
    div.appendChild(fs);
    return div;
}


function actionDrop(internalCounter) {
    let div = document.createElement("div");
    div.id = "flow-control-action-add-field-" + String(internalCounter);
    let fs = document.createElement("fieldset");
    let leg = document.createElement("legend");
    leg.innerText = "drop action";
    fs.appendChild(leg);
    let oplbl = document.createElement("label");
    oplbl.innerText = "drop reason:";
    fs.append(oplbl);
    let op = document.createElement("input");
    oplbl.for = op;
    op.type = "number";
    op.id = "flow-control-action-drop-" + String(internalCounter);
    fs.appendChild(op);
    let addAction = document.createElement("button");
    addAction.innerText = "add action";
    addAction.onclick = function() {
        let counter = actionCounter[internalCounter];
        let ownDataset = {};
        ownDataset["order"] = counter;
        ownDataset["drop-action"] = JSON.parse('{"drop-reason":"' + op.value + '"}')
        addActionTableRow(internalCounter, counter, ownDataset);
        op.value = "";
        actionCounter[internalCounter] = counter + 1;
    }
    fs.appendChild(addAction);
    div.appendChild(fs);
    return div;
}

function actionQueue(internalCounter) {
    let div = document.createElement("div");
    div.id = "flow-control-action-add-field-" + String(internalCounter);
    let fs = document.createElement("fieldset");
    let leg = document.createElement("legend");
    leg.innerText = "queue action";
    fs.appendChild(leg);
    let oplbl = document.createElement("label");
    oplbl.innerText = "queue-config:";
    fs.append(oplbl);
    let op = document.createElement("input");
    oplbl.for = op;
    op.type = "number";
    op.id = "flow-control-action-queue-" + String(internalCounter);
    fs.appendChild(op);
    let addAction = document.createElement("button");
    addAction.innerText = "add action";
    addAction.onclick = function() {
        let counter = actionCounter[internalCounter];
        let ownDataset = {};
        ownDataset["order"] = counter;
        ownDataset["queue-action"] = JSON.parse('{"queue":"' + op.value + '"}')
        addActionTableRow(internalCounter, counter, ownDataset);
        op.value = "";
        actionCounter[internalCounter] = counter + 1;
    }
    fs.appendChild(addAction);
    div.appendChild(fs);
    return div;
}

function actionModify(internalCounter) {
    console.log("action Modify reached!");
    let div = document.createElement("div");
    div.id = "flow-control-action-add-field-" + String(internalCounter);
    let fs = document.createElement("fieldset");
    let leg = document.createElement("legend");
    leg.innerText = "modify action";
    fs.appendChild(leg);
    let lbl = document.createElement("select");
    let macDst = document.createElement("option");
    macDst.innerText = "mac-dst-overẃrite";
    lbl.appendChild(macDst);
    let macSrc = document.createElement("option");
    macSrc.innerText = "mac-src-overwrite";
    lbl.appendChild(macSrc);
    let ipDst = document.createElement("option");
    ipDst.innerText = "ipv4-dst-overwrite";
    lbl.appendChild(ipDst);
    let ipSrc = document.createElement("option");
    ipSrc.innerText = "ipv4-src-overwrite";
    lbl.appendChild(ipSrc);
    let portDst = document.createElement("option");
    portDst.innerText = "port-dst-overwrite";
    lbl.appendChild(portDst);
    let portSrc = document.createElement("option");
    portSrc.innerText = "port-src-overwrite";
    lbl.appendChild(portSrc);
    let input = document.createElement("input");
    input.id = "flow-control-action-add-field-input-" + String(internalCounter);
    fs.appendChild(lbl);
    fs.appendChild(input);
    let addAction = document.createElement("button");
    addAction.innerText = "add action";
    addAction.onclick = function() {
        let counter = actionCounter[internalCounter];
        let ownDataset = {};
        ownDataset["order"] = counter;
        if (lbl.value == "mac-src-overwrite") {
            ownDataset["modify-action"] = JSON.parse('{"MAC-SRC-overwrite":"' + input.value + '"}');
        } else if (lbl.value == "mac-dst-overwrite") {
            ownDataset["modify-action"] = JSON.parse('{"MAC-DST-overwrite":"' + input.value + '"}');
        } else if (lbl.value == "ipv4-src-overwrite") {
            ownDataset["modify-action"] = JSON.parse('{"IPv4-SRC-overwrite":"' + input.value + '"}');
        } else if (lbl.value == "ipv4-dst-overwrite") {
            ownDataset["modify-action"] = JSON.parse('{"IPv4-DST-overwrite":"' + input.value + '"}');
        } else if (lbl.value == "port-src-overwrite") {
            ownDataset["modify-action"] = JSON.parse('{"L4-SRC-overwrite":"' + input.value + '"}');
        } else if (lbl.value == "port-dst-overwrite") {
            ownDataset["modify-action"] = JSON.parse('{"L4-DST-overwrite":"' + input.value + '"}');
        }
        console.log(ownDataset);
        addActionTableRow(internalCounter, counter, ownDataset);
        input.value = "";
        actionCounter[internalCounter] = counter + 1;
    }
    fs.appendChild(addAction);
    div.appendChild(fs);
    return div;
}

function addActionTableRow(internalCounter, rowCounter, dataSet) {
    let table = document.getElementById("flow-control-action-view-table-" + String(internalCounter));
    let row = document.createElement("tr");
    row.id = "flow-control-action-view-table-" + String(internalCounter) + "-row-" + String(rowCounter);
    let ord = document.createElement("td");
    ord.contentEditable = true;
    ord.innerText = dataSet["order"];
    row.appendChild(ord);
    let act = document.createElement("td");
    act.contentEditable = true;
    if (dataSet.hasOwnProperty("modify-action")) {
        act.innerText = JSON.stringify(dataSet["modify-action"]);
        act.onchange = function() {
            actionDataSet[internalCounter][rowCounter]["modify-action"] = JSON.parse(act.innerText);
        }
    } else if (dataSet.hasOwnProperty("output-action")) {
        act.innerText = JSON.stringify(dataSet["output-action"]);
        act.onchange = function() {
            actionDataSet[internalCounter][rowCounter]["output-action"] = JSON.parse(act.innerText);
        }
    } else if (dataSet.hasOwnProperty("drop-action")) {
        act.innerText = JSON.stringify(dataSet["drop-action"]);
        act.onchange = function() {
            actionDataSet[internalCounter][rowCounter]["drop-action"] = JSON.parse(act.innerText);
        }
    } else if (dataSet.hasOwnProperty("queue-action")) {
        act.innerText = JSON.stringify(dataSet["queue-action"]);
        act.onchange = function() {
            actionDataSet[internalCounter][rowCounter]["queue-action"] = JSON.parse(act.innerText);
        }
    }

    row.appendChild(act);
    let del = document.createElement("td");
    del.setAttribute("class", "w3-button");
    row.appendChild(del);
    actionDataSet[internalCounter][rowCounter] = dataSet;
    table.appendChild(row);
}

/**
 * Delete all rows from an action table which isn't needed anymore after adding actions to a filter rule
 * @param {int} internalCounter 
 * @param {int} rowCounter 
 */
function emptyControlFlowActionTable(internalCounter, rowCounter) {
    for (var i = 0; i < parseInt(rowCounter); i++) {
        document.getElementById("flow-control-action-view-table-" + String(internalCounter) + "-row-" + String(i)).remove();
    }
}