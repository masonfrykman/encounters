const API_HOST = "https://encounters.api.frykman.dev";
export var lastReadCount: number | null

export async function grabData(day: string): Promise<any | number> {
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

    if(resp.headers.has("X-Count")) {
        lastReadCount = Number.parseInt(resp.headers.get("X-Count")!)
    }

    return json
}

export async function search(btid: string): Promise<any | number> {
    let r = new Request(API_HOST + "/search/" + btid);
    let resp = await fetch(r);
    if(!resp.ok) {
        return resp.status;
    }

    let json = await resp.json()
    if(json == null) {
        return -2;
    }

    if(resp.headers.has("X-Count")) {
        lastReadCount = Number.parseInt(resp.headers.get("X-Count")!)
    }

    return json
}