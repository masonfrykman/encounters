import * as LEAF from 'leaflet';

const PAGENAME = "map.html"
const API_HOST = "http://127.0.0.1:51923";

var map: (LEAF.Map | null) = null;
var entries: any[] | null = null



async function grabData(day: string): Promise<any | number> {
    var day: string
    switch(day) {
        case "sunday":
            day = "20260920"
            break
        case "monday":
            day = "20260921"
            break
        case "tuesday":
            day = "20260922"
            break
        case "wednesday":
            day = "20260923"
            break
        case "thursday":
            day = "20260924"
            break
        default:
            alert("Bad date specified! This is a bug!")
            return -1;
    }

    let r = new Request(API_HOST + "/readings/day/" + day);
    let resp = await fetch(r);
    if(!resp.ok) {
        return resp.status;
    }

    let json = await resp.json()
    if(json == null) {
        return -2;
    }

    return json
}

function initMap() {
  map = LEAF.map("map", {center: [41.86387, -87.64733], zoom: 18})
  LEAF.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

function handleEntry(entry: any) {
    if(map == null) return;

    let loc = [entry["a"], entry["n"]]
    let l = new LEAF.LatLng(entry["a"], entry["n"])
    var lbl: string
    var sl: string | null = null
    if(entry["l"] == "") {
        lbl = entry["i"]
    } else {
        lbl = entry["l"]
        sl = entry["i"]
    }

    LEAF.marker(l, {
        "title": lbl
    }).addTo(map)
}

function toLeafLL(data: any): LEAF.LatLng {
    return new LEAF.LatLng(data["a"], data["n"])
}

function makeMarker(entry: any): LEAF.Marker {
    let loc = [entry["a"], entry["n"]]
    let l = new LEAF.LatLng(entry["a"], entry["n"])
    var lbl: string
    var sl: string | null = null
    if(entry["l"] == "") {
        lbl = entry["i"]
    } else {
        lbl = entry["l"]
        sl = entry["i"]
    }

    return LEAF.marker(l, {
        "title": lbl
    })
}

function init(data: any[]) {
    initMap()

    if(entries == null) {
        entries = []
    }

    for(var entry of data) {
        if(!Object.hasOwn(entry, "i")) {
            console.error("Entry without an ID!")
            console.error(entry)
            continue
        }

        //handleEntry(entry)
        entries?.push(entry)
    }

    console.log(data)

    map!.addEventListener("moveend", (ev) => {
        // Remove all layers from the map
        map!.eachLayer((layer) => {
            map!.removeLayer(layer)
        })

        // Add visible entries.
        let bounds = map!.getBounds()
        let group = LEAF.layerGroup()
        entries!.forEach((v) => {
            let ll = toLeafLL(v)
            if(bounds.contains(ll)) {
                makeMarker(v).addTo(group)
            }
        })

        map!.addLayer(group)
    })
}

function landing_init() {
    let selectedDate = window.localStorage.getItem("nav-date")
    if(selectedDate == null) {
        // go back to the landing page.
        console.error("NO DATE INPUTTED")
        window.location.href = window.location.href.replaceAll(PAGENAME, "")
        return
    }

    grabData(selectedDate).then((v) => {
        if(typeof v == "number") {
            if(v == -2) {
                console.error("Failed to parse the data recieved from the server :( (this is a bug!)")
            }
            window.location.href = window.location.href.replaceAll(PAGENAME, "")
            return
        }

        if(!Array.isArray(v)) {
            console.error("The server responded with badly formatted data :(");
            window.location.href = window.location.href.replaceAll(PAGENAME, "")
            return
        }

        init(v);
    });
}

window.onload = landing_init

window.onresize = () => {
    if(map != null) {
        map.invalidateSize()
    }
}