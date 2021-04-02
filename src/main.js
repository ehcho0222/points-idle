var player = {
    version: 0.21,
    point: 0,
    pointPerClick: 1,
    pointPerClickCost: 10,
    autoPointLevel: 0,
    autoPointCost: 100,
    lastTick: 0
}

function tab(tab) {
    document.getElementById("produceMenu").style.display = "none"
    document.getElementById("shopMenu").style.display = "none"
    document.getElementById("settingMenu").style.display = "none"
    document.getElementById(tab).style.display = "block"
}

function update(id, content) {
    document.getElementById(id).innerHTML = content;
}

function format(number, type) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / Math.pow(10, exponent)
	if (exponent < 3) return number.toFixed(0)
	if (type == "scientific") return mantissa.toFixed(2) + "e" + exponent
	if (type == "engineering") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
}

function clickPoint() {
    player.point += player.pointPerClick
    update("point", format(player.point, "scientific") + " Point")
    if (player.point != 1)
    {
        update("point", document.getElementById("point").innerHTML + "s")
    }
}

function upgradeClick() {
    if (player.point >= player.pointPerClickCost)
    {
        player.point -= player.pointPerClickCost
        player.pointPerClick += 1
        player.pointPerClickCost = player.pointPerClick * player.pointPerClick * 10
        update("point", format(player.point, "scientific") + " Point")
        if (player.point != 1)
        {
            update("point", document.getElementById("point").innerHTML + "s")
        }
        update("a01", "Earn " + format(player.pointPerClick, "scientific") + " Point")
        if (player.pointPerClick != 1)
        {
            update("a01", document.getElementById("a01").innerHTML + "s")
        }
        update("b01", "Upgrade Click: Level " + format(player.pointPerClick, "scientific") + " (Costs " + format(player.pointPerClickCost, "scientific") + " Points)")
    }
}

function autoPoint(ms) {
    player.point += (player.autoPointLevel * player.autoPointLevel * ms / 1000)
    document.getElementById("pps").innerHTML = (player.autoPointLevel * player.autoPointLevel) + " Points/sec"
    update("point", format(player.point, "scientific") + " Point")
    if (player.point != 1)
    {
        update("point", document.getElementById("point").innerHTML + "s")
    }
}

function upgradeAutoPoint() {
    if (player.point >= player.autoPointCost)
    {
        player.point -= player.autoPointCost
        player.autoPointLevel += 1
        player.autoPointCost = player.autoPointLevel * player.autoPointLevel * player.autoPointLevel * 100
        update("point", format(player.point, "scientific") + " Point")
        if (player.point != 1)
        {
            update("point", document.getElementById("point").innerHTML + "s")
        }
        update("b02", "Upgrade Auto: Level " + format(player.autoPointLevel, "scientific") + " (Costs " + format(player.autoPointCost, "scientific") + " Points)")
    }
}

function hardReset() {
    player.point = 0
    player.pointPerClick = 1
    player.pointPerClickCost = 10
    player.autoPointLevel = 0
    player.autoPointCost = 100
    player.lastTick = Date.now()
    tab(produceMenu)
}

var savegame = JSON.parse(localStorage.getItem("badIdleSave"))
if (savegame !== null) {
    if (typeof savegame.point !== "undefined") player.point = savegame.point
    if (typeof savegame.pointPerClick !== "undefined") player.pointPerClick = savegame.pointPerClick
    if (typeof savegame.pointPerClickCost !== "undefined") player.pointPerClickCost = savegame.pointPerClickCost
    if (typeof savegame.autoPointLevel !== "undefined") player.autoPointLevel = savegame.autoPointLevel
    if (typeof savegame.autoPointCost !== "undefined") player.autoPointCost = savegame.autoPointCost
    if (typeof savegame.lastTick !== "undefined") player.lastTick = savegame.lastTick
}

var gameLoop = window.setInterval(function() {
    diff = Date.now() - player.lastTick
    player.lastTick = Date.now()
    update("b01", "Upgrade Click: Level " + format(player.pointPerClick, "scientific") + " (Costs " + format(player.pointPerClickCost, "scientific") + " Points)")
    update("b02", "Upgrade Auto: Level " + format(player.autoPointLevel, "scientific") + " (Costs " + format(player.autoPointCost, "scientific") + " Points)")
    update("a01", "Earn " + format(player.pointPerClick, "scientific") + " Point")
    if (player.pointPerClick != 1)
    {
        update("a01", document.getElementById("a01").innerHTML + "s")
    }
    autoPoint(diff)
}, 1000)

var saveLoop = window.setInterval(function() {
    localStorage.setItem("badIdleSave", JSON.stringify(player))
    console.log("Game Saved")
}, 10000)
