var player = {
    version: 0.22,
    point: 0,
    pointPerClick: 1,
    pointPerClickCost: 10,
    autoPointLevel: 0,
    autoPointCost: 100,
    prestigeUnlock: false,
    metaPoint: 0,
    prestigeMenuUnlock: false,
    lastTick: Date.now
}

function tab(tab) {
    document.getElementById("produceMenu").style.display = "none"
    document.getElementById("shopMenu").style.display = "none"
    document.getElementById("settingMenu").style.display = "none"
    document.getElementById(tab).style.display = "block"
}

function unlock() {
    if (player.point >= 5000)
    {
        document.getElementById("prestige1").style.display = "inline-block"
        player.prestigeUnlock = true
    }
    if (player.metaPoint >= 1)
    {
        document.getElementById("mp").style.display = "inline-block"
        player.prestigeMenuUnlock = true
    }
}

function update(id, content) {
    document.getElementById(id).innerHTML = content;
}

function format(number, type) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / Math.pow(10, exponent)
	if (exponent < 3) return number.toFixed(0)
	if (type === "scientific") return mantissa.toFixed(2) + "e" + exponent
	if (type === "engineering") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
}

function prestigeUpdate() {
    if (player.point >= Math.pow(2, 2.5) * 5000)
    {
        document.getElementById("prestige1").disabled = false;
        update("prestige1", "Prestige for " + format(Math.pow(player.point/5000, 0.4), "scientific") + " Meta-Points")
    }
    else if (player.point >= 5000)
    {
        document.getElementById("prestige1").disabled = false;
        update("prestige1", "Prestige for 1 Meta-Point")
    }
    else
    {
        document.getElementById("prestige1").disabled = true;
        update("prestige1", "Prestige for 0 Meta-Points")
    }
}

function prestige() {
    var prestigeCon = confirm("Are you sure you want to prestige? You will get " + format(Math.pow(player.point/5000, 0.4), "scientific") + " Meta-Points.")
    if (prestigeCon === true)
    {
        player.metaPoint += Math.floor(Math.pow(player.point/5000, 0.4))
        player.point = 0
        player.pointPerClick = 1
        player.pointPerClickCost = 10
        player.autoPointLevel = 0
        player.autoPointCost = 100
        update("mp", player.metaPoint + " Meta-Point")
        if (player.metaPoint != 1)
        {
            update("mp", document.getElementById("mp").innerHTML + "s")
        }
        unlock()
    }
}

function clickPoint() {
    player.point += player.pointPerClick
    update("point", format(player.point, "scientific") + " Point")
    if (player.point != 1)
    {
        update("point", document.getElementById("point").innerHTML + "s")
    }
    unlock()
    prestigeUpdate()
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
    player.prestigeUnlock = false
    player.metaPoint = 0
    player.prestigeMenuUnlock = false
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
    if (typeof savegame.prestigeUnlock !== "undefined") player.prestigeUnlock = savegame.prestigeUnlock
    if (player.prestigeUnlock === true) document.getElementById("prestige1").style.display = "inline-block"
    if (typeof savegame.metaPoint !== "undefined") player.metaPoint = savegame.metaPoint
    if (typeof savegame.prestigeMenuUnlock !== "undefined") player.prestigeMenuUnlock = savegame.prestigeMenuUnlock
    if (player.prestigeMenuUnlock === true) document.getElementById("mp").style.display = "inline-block"
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
    unlock()
    prestigeUpdate()
    update("mp", player.metaPoint + " Meta-Point")
    if (player.metaPoint != 1)
    {
        update("mp", document.getElementById("mp").innerHTML + "s")
    }
}, 1000)

var saveLoop = window.setInterval(function() {
    localStorage.setItem("badIdleSave", JSON.stringify(player))
    console.log("Game Saved")
}, 10000)
