import { search } from './server';

async function init() {
    // get value from LS
    let btid = window.localStorage.getItem("searchbtid");
    if(btid == null) {
        alert("No BTID found :(")
        window.location.href = window.location.href.replaceAll("search.html", "")
        return
    }

    // send a search request to the server.
    let results = await search(btid);
    if(typeof results == 'number') {
        // error!
        console.error("SERVER RESP code " + results)
        if(results == 404) {
            // not found :(
            document.getElementById("table-container")!.innerHTML = "No results for BTID '" + btid + "'."
        } else {
            document.getElementById("table-container")!.innerHTML = "Lookup failed for BTID '" + btid + "', server response code " + results + "."
        }
        return
    }

    console.log("200 resp, laying out in the table!")
    // results of type 'any' contain search results!
    document.getElementById("table-container")!.innerHTML = "<p id='plswait'>(parsing server response...)</p>" + document.getElementById("table-container")!.innerHTML
    for(var data of results) {
        document.getElementById("device-table-body")!.innerHTML 
            += "<tr>" + "<th scope='row'>" + data["t"] + "</th>" // Timegroup
            + "<td>" + data["i"] + "</td>" // BTID
            + "<td>" + data["l"] + "</td>" // BTNAME
            + "<td>" + data["r"] + "</td>" // RSSI
            + "<td>" + data["a"] + "</td>" // LAT
            + "<td>" + data["n"] + "</td>" + "</tr>"; // LON
    }
    document.getElementById("table-container")!.removeChild(document.getElementById("plswait")!)
    document.getElementById("device-table")!.removeAttribute("hidden");

    console.log("done!")
}

window.onload = init