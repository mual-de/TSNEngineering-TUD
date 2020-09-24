/**
 * This file implements a function set for loading a given configuration in json to this website.
 */


function onLoad(data) {
    console.log(data);
    dataset = data;
    let length = dataset.length;

    for (var i = 0; i < length; i++) {
        addNewSwitch(counter, dataset[i]);
        let masterTableLength = Object.keys(dataset[i]["fpga_config"]["TNflowtable"]["mastertable"]).length;
        for (var c = 0; c < masterTableLength; c++) {
            addFlowControlRule(i, dataset[i]["fpga_config"]["TNflowtable"]["mastertable"][String(c)]);
        }
        console.log(dataset[i]["ovs_config"]);
        console.log(Object.keys(dataset[i]["ovs_config"]).length);
        let ovsMasterTableLength = Object.keys(dataset[i]["ovs_config"]).length;

        for (var c = 0; c < ovsMasterTableLength; c++) {
            addOVSFlowRule(i, c, dataset[i]["ovs_config"][String(c)]);
        }
        internalCountingSystem[i]["ovs"] = ovsMasterTableLength;
    }
}