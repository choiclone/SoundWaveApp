function TimeString(seconds) {
    let min, sec;

    min = parseInt((seconds % 3600) / 60);
    sec = seconds % 60;

    if (min.toString().length == 1) min = "0" + min;
    if (sec.toString().length == 1) sec = "0" + sec;

    return min + ":" + sec;
}

function test() {
    console.log("test");
}

export { TimeString, test };