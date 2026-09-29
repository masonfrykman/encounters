
import * as FIT from 'fitty';

function nav_date(day: string, loc: string) {
  if(day.length == 0) return;

  console.log(day)

  window.localStorage.setItem("nav-date", day)
  window.localStorage.setItem("nav-loc", loc)
  window.location.href += "map.html"
}

function size() {
  if(window.screen.width <= 500) {
    document.getElementById("hw-leading")!.innerHTML = "Have<br>we*"
  } else {
    document.getElementById("hw-leading")!.innerHTML = "Have we*"
  }
}

// attach used fns
window.nav_date = nav_date; 

// fit text
FIT.default(document.getElementById("encountered-leading")!, {
  minSize: 18,
});

FIT.default(document.getElementById("hw-leading")!, {minSize: 36});

//window.onresize = size
//size()

function nav_search() {
  var sbox = document.getElementById("searchbox")
  if(sbox == null) {
    console.error("Call to nav_search without a bound #searchbox.")
    return
  }

  let boxw = sbox! as HTMLInputElement

  let btid = boxw.value.trim()
  if(btid == "") {
    boxw.classList.add("badinput")
    return
  }

  window.localStorage.setItem("searchbtid", btid)
  window.location.href += "search.html"
}

window.nav_search = nav_search