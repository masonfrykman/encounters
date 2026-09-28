import * as PLOT from 'plotly.js-dist'

import * as COMMS from './server'

var pldata: any
var dat: any

function randomColor(): number {
    let colors = [
        "red", "orange", "yellow", "green", "blue", "purple", "fuschia", "brown", "white", "black", "beige"
    ]

    return Math.random() * colors.length
}

function shakeup(lat: number, lon: number): [number, number] {
    var l = lat + (Math.random() * 0.00015) - 0.00003
    var n = lon + (Math.random() * 0.0001) - 0.00003
    return [l, n]
}

var showMap = true
var dlI = 0

function layoutDeviceList() {
    document.getElementById("device-table-body")!.innerHTML = ""

    var incr = 10
    if(dlI >= dat.length) {
        dlI = 0
    } else if(dlI + incr >= dat.length) {
        incr = dat.length - dlI
    }

    for(var i = dlI; i < dlI + incr; i++) {
        var data = dat[i]

        document.getElementById("device-table-body")!.innerHTML 
        += "<tr>" + "<th scope='row'>" + data["t"] + "</th>" // Timegroup
        + "<td>" + data["i"] + "</td>" // BTID
        + "<td>" + data["l"] + "</td>" // BTNAME
        + "<td>" + data["r"] + "</td>" // RSSI
        + "<td>" + data["a"] + "</td>" // LAT
        + "<td>" + data["n"] + "</td>" + "</tr>"; // LON
    }

    document.getElementById("devl-count")!.innerText = "(" + dlI + ")"
}

function forwardDeviceList() {
    dlI += 10
    layoutDeviceList()
}

function backDeviceList() {
    dlI -= 10
    if(dlI < 0) {
        dlI = 0
    }

    layoutDeviceList()
}

window.deviceListFwd = forwardDeviceList
window.deviceListBack = backDeviceList

function switchShowDevices() {
    showMap = !showMap

    if(!showMap) {
        document.getElementById("map")!.hidden = true
        document.getElementById("device-table")!.hidden = false
        document.getElementById("footer-devicelistctrl")!.hidden = false
        document.getElementById("devl-count")!.hidden = false

        layoutDeviceList()
    } else {
        document.getElementById("map")!.hidden = false
        document.getElementById("device-table")!.hidden = true
        document.getElementById("footer-devicelistctrl")!.hidden = true
        document.getElementById("devl-count")!.hidden = true
    }
}

window.showDevices = switchShowDevices

async function init() {
    let day = window.localStorage.getItem("nav-date")
    if(day == null) {
        console.error("Date was not specified!")
        window.location.href = window.location.href.replaceAll("map.html", "")
        return
    }

    var center, zoom

    let loc = window.localStorage.getItem("nav-loc") ?? "uic"
    if (loc == "river-north") {
        zoom = 16
        center = [41.89503675190523, -87.63993304770175]
    } else if (loc == "uic/river-north") {
        center = [41.880405280759746, -87.64774773869841]
        zoom = 14
    } else {
        zoom = 15
        center = [41.87191277694185, -87.64896002831655]
    }

    dat = await COMMS.grabData(day); // TODO: change this

    pldata = [
        {
            type: "scattermap",
            marker: {color: "fuchsia", size: 4},
            lon: [],
            lat: [],
            text: []
        }
    ]

    console.log(dat)

    // for 

    var i = 0
    var tsStart = Number.parseInt(dat[0]["t"])
    var tsEnd = tsStart + 1000 * 15
    var uniqueness = new Set<string>()
    let body = document.getElementById("device-table-body")
    var lts = new Date(tsStart).toLocaleTimeString()

    for(var data of dat) {
        //console.log(Number.parseInt(data["t"]))
        if(Number.parseInt(data["t"]) > tsEnd) {
            console.log("ARGH!")
            tsStart = Number.parseInt(data["t"])
            tsEnd = tsStart + 1000 * 15
            i = i + 1

            var d = new Date(tsStart)
            lts = d.toLocaleTimeString()

            pldata[i] = {
                type: "scattermap",
                marker: { color: randomColor(), size: 4},
                lat: [],
                lon: [],
                text: [],
                name: lts
            }
        }

        // push data to the map
        let loc = shakeup(Number.parseFloat(data["a"]), Number.parseFloat(data["n"]))

        pldata[i].lat.push(loc[0])
        pldata[i].lon.push(loc[1])
        pldata[i].text.push(data["i"])

        // push data to the device table
        
        uniqueness.add(data["i"])
    }

    var layout = {
        dragmode: "",
        map: {
            style: "streets",
            center: {
                lat: center[0],
                lon: center[1]
            },
            zoom: zoom,
        },
        margin: {r: 0, t:0, b:0, l:0}
    }

    console.log(pldata)

    await PLOT.newPlot("map", pldata, layout)

    // place in the encounter count
    document.getElementById("count")!.innerText = "" + COMMS.lastReadCount + " encounters!"
    document.getElementById("uniques")!.innerText = "" + uniqueness.size + " unique people!"
    

}

window.onload = init