function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML =
        h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}
$(".dd").on('click',function(){
    $(".dd").addClass("bgfor")
    $(".dh").removeClass("bgfor")
    console.log("hello");
})

$(".dh").on('click', function () {
    $(".dh").addClass("bgfor")
    $(".dd").removeClass("bgfor")
    console.log("hello");
})

if ($(".complete").val ==="COMPLETED"){
    $("odrder").addClass("strike");
    console.log("STRIKED");
}

window.setInterval('refresh()', 30000); 	// Call a function every 10000 milliseconds (OR 10 seconds).

// Refresh or reload page.
function refresh() {
    window.location.reload();
}

