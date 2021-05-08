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
    metaClickUpgrade: 0,
    metaClickCost: 1,
    metaAutoUpgrade: 0,
    metaAutoCost: 1,
    notation: 0,
    lastTick: Date.now
}

var notationList = ["Scientific", "Engineering", "Standard", "Alphabet", "Cancer", "Logarithm"]
var standardPrefixUnder10 = [" K", " M", " B", " T", " Qa", " Qt", " Sx", " Sp", " Oc", " No"]
var standardPrefixOne = [" ", " U", " D", " T", " Qa", " Qt", " Sx", " Sp", " O", " N"]
var standardPrefixTen = ["", "Dc", "Vg", "Tg", "Qd", "Qi", "Sg", "St", "Og", "Nn", "Ce"]
var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
var emoji = ["😠", "🎂", "🎄", "💀", "🍆", "👪", "🌈", "💯", "🍦", "🎃", "💋", "😂", "🌙", "⛔", "🐙", "💩", "❓", "☢", "🙈", "👍", "☂", "✌", "⚠", "❌", "😋", "⚡"]

function tab(tab) {
    document.getElementById("produceMenu").style.display = "none"
    document.getElementById("shopMenu").style.display = "none"
    document.getElementById("settingMenu").style.display = "none"
    document.getElementById("metaPointMenu").style.display = "none"
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
        document.getElementById("mpnav").style.display = "inline-block"
        player.prestigeMenuUnlock = true
    }
}

function update(id, content) {
    document.getElementById(id).innerHTML = content;
}

function changeNotation(type) {
    player.notation = type
}

function format(number, type) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / Math.pow(10, exponent)
	if (type === 0 && exponent >= 3) return mantissa.toFixed(2) + "e" + exponent
	if (type === 1 && exponent >= 3) return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
    if (type === 2 && exponent >= 3)
    {
        let exponentOrder = Math.floor(exponent / 3) - 1;
        if (exponentOrder < 10)
        {
            return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + standardPrefixUnder10[exponentOrder]
        }
        else
        {
            let exponentTen = Math.floor(exponentOrder / 10)
            let exponentOne = exponentOrder % 10
            return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + standardPrefixOne[exponentOne] + standardPrefixTen[exponentTen]
        }
    }
    if (type === 3 && exponent >= 3)
    {
        let exponentOrder = Math.floor(exponent / 3) - 1;
        if (exponentOrder < 26)
        {
            return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + " " + alphabet[exponentOrder]
        }
        else
        {
            let exponentTen = Math.floor(exponentOrder / 26)
            let exponentOne = exponentOrder % 26
            return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + " " + alphabet[exponentTen - 1] + alphabet[exponentOne]
        }
    }
    if (type === 4 && exponent >= 3)
    {
        let exponentOrder = Math.floor(exponent / 3) - 1;
        if (exponentOrder < 26)
        {
            return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + " " + emoji[exponentOrder]
        }
        else
        {
            let exponentTen = Math.floor(exponentOrder / 26)
            let exponentOne = exponentOrder % 26
            return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + " " + emoji[exponentTen - 1] + emoji[exponentOne]
        }
    }
    if (type === 5 && exponent >= 3)
    {
        let logTen = Math.log10(number)
        return "e" + logTen.toFixed(2)
    }
    return number.toFixed(0)
}

function prestigeUpdate() {
    if (player.point >= Math.pow(2, 2.5) * 5000)
    {
        document.getElementById("prestige1").disabled = false;
        update("prestige1", "Prestige for " + format(Math.floor(Math.pow(player.point / 5000, 0.4)), player.notation) + " Meta-Points")
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
    var prestigeCon = confirm("Are you sure you want to prestige? You will get " + format(Math.floor(Math.pow(player.point/5000, 0.4)), player.notation) + " Meta-Points.")
    if (prestigeCon === true)
    {
        player.metaPoint += Math.floor(Math.pow(player.point/5000, 0.4))
        player.point = 0
        player.pointPerClick = 1
        player.pointPerClickCost = 10
        player.autoPointLevel = 0
        player.autoPointCost = 100
        update("mp", format(player.metaPoint, player.notation) + " Meta-Point")
        if (player.metaPoint != 1)
        {
            update("mp", document.getElementById("mp").innerHTML + "s")
        }
        unlock()
    }
}

function clickPoint() {
    if (isNaN(player.point)) player.point = 0
    player.point += player.pointPerClick*Math.pow(3, player.metaClickUpgrade)
    update("point", "You have " + format(player.point, player.notation) + " Point")
    if (player.point != 1)
    {
        update("point", document.getElementById("point").innerHTML + "s")
    }
    update("point", document.getElementById("point").innerHTML + ".")
    unlock()
    prestigeUpdate()
}

function upgradeClick() {
    if (player.point >= player.pointPerClickCost)
    {
        player.point -= player.pointPerClickCost
        player.pointPerClick += 1
        player.pointPerClickCost = player.pointPerClick * player.pointPerClick * 10
        update("point", "You have " + format(player.point, player.notation) + " Point")
        if (player.point != 1)
        {
            update("point", document.getElementById("point").innerHTML + "s")
        }
        update("point", document.getElementById("point").innerHTML + ".")
        update("a01", "Earn " + format(player.pointPerClick * Math.pow(3, player.metaClickUpgrade), player.notation) + " Point")
        if (player.pointPerClick*Math.pow(2, player.metaClickUpgrade) != 1)
        {
            update("a01", document.getElementById("a01").innerHTML + "s")
        }
        update("b01", "Upgrade Click: Level " + player.pointPerClick + " (" + format(player.pointPerClickCost, player.notation) + " Points)")
        return true
    }
    return false
}

function upgradeMaxClick() {
    while(upgradeClick()) {}
}

function autoPoint(ms) {
    player.point += (player.autoPointLevel * player.autoPointLevel * Math.pow(4, player.metaAutoUpgrade) * ms / 1000)
    update("pps", "You are getting " + format(player.autoPointLevel * player.autoPointLevel * Math.pow(4, player.metaAutoUpgrade), player.notation) + " Points per second.")
    update("point", "You have " + format(player.point, player.notation) + " Point")
    if (player.point != 1)
    {
        update("point", document.getElementById("point").innerHTML + "s")
    }
    update("point", document.getElementById("point").innerHTML + ".")
}

function upgradeAutoPoint() {
    if (player.point >= player.autoPointCost)
    {
        player.point -= player.autoPointCost
        player.autoPointLevel += 1
        player.autoPointCost = player.autoPointLevel * player.autoPointLevel * player.autoPointLevel * 100
        update("point", "You have " + format(player.point, player.notation) + " Point")
        if (player.point != 1)
        {
            update("point", document.getElementById("point").innerHTML + "s")
        }
        update("point", document.getElementById("point").innerHTML + ".")
        update("b02", "Upgrade Auto: Level " + player.autoPointLevel + " (" + format(player.autoPointCost, player.notation) + " Points)")
        return true
    }
    return false
}

function upgradeMaxAuto() {
    while(upgradeAutoPoint()) {}
}

function Layer1MaxAll() {
    upgradeMaxClick()
    upgradeMaxAuto()
}

function upgradeMetaClick() {
    if (player.metaPoint >= player.metaClickCost)
    {
        player.metaPoint -= player.metaClickCost
        player.metaClickUpgrade += 1
        player.metaClickCost = player.metaClickCost * 3
        update("mp", format(player.metaPoint, player.notation) + " Meta-Point")
        if (player.metaPoint != 1)
        {
            update("mp", document.getElementById("mp").innerHTML + "s")
        }
        update("a01", "Earn " + format(player.pointPerClick*Math.pow(3, player.metaClickUpgrade), player.notation) + " Point")
        update("c01", "Upgrade Meta-Click: Level " + player.metaClickUpgrade + " (Costs " + format(player.metaClickCost, player.notation) + " Meta-Points)")
        return true
    }
    return false
}

function upgradeMaxMetaClick() {
    while(upgradeMetaClick()) {}
}

function upgradeMetaAuto() {
    if (player.metaPoint >= player.metaAutoCost)
    {
        player.metaPoint -= player.metaAutoCost
        player.metaAutoUpgrade += 1
        player.metaAutoCost = player.metaAutoCost * 3
        update("mp", format(player.metaPoint, player.notation) + " Meta-Point")
        if (player.metaPoint != 1)
        {
            update("mp", document.getElementById("mp").innerHTML + "s")
        }
        update("pps", "You are getting " + format(player.autoPointLevel * player.autoPointLevel * Math.pow(4, player.metaAutoUpgrade), player.notation) + " Points per second.")
        update("c03", "Upgrade Meta-Auto: Level " + player.metaAutoUpgrade + " (Costs " + format(player.metaAutoCost, player.notation) + " Meta-Points)")
        return true
    }
    return false
}

function upgradeMaxMetaAuto() {
    while(upgradeMetaAuto()) {}
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
    player.metaClickUpgrade = 0
    player.metaClickCost = 1
    player.metaAutoUpgrade = 0
    player.metaAutoCost = 1
    player.lastTick = Date.now()
    document.getElementById("mpnav").style.display = "none"
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
    if (player.prestigeMenuUnlock === true)
    {
        document.getElementById("mp").style.display = "inline-block"
        document.getElementById("mpnav").style.display = "inline-block"
    }
    if (typeof savegame.metaClickUpgrade !== "undefined") player.metaClickUpgrade = savegame.metaClickUpgrade
    if (typeof savegame.metaClickCost !== "undefined") player.metaClickCost = savegame.metaClickCost
    if (typeof savegame.metaAutoUpgrade !== "undefined") player.metaAutoUpgrade = savegame.metaAutoUpgrade
    if (typeof savegame.metaAutoCost !== "undefined") player.metaAutoCost = savegame.metaAutoCost
    if (typeof savegame.notation !== "undefined") player.notation = savegame.notation
    if (typeof savegame.lastTick !== "undefined") player.lastTick = savegame.lastTick
}

var gameLoop = window.setInterval(function() {
    if (isNaN(player.point)) player.point = 0
    diff = Date.now() - player.lastTick
    player.lastTick = Date.now()
    update("b01", "Upgrade Click: Level " + player.pointPerClick + " (Costs " + format(player.pointPerClickCost, player.notation) + " Points)")
    update("b02", "Upgrade Auto: Level " + player.autoPointLevel + " (Costs " + format(player.autoPointCost, player.notation) + " Points)")
    update("c01", "Upgrade Meta-Click: Level " + player.metaClickUpgrade + " (Costs " + format(player.metaClickCost, player.notation) + " Meta-Points)")
    update("c02", "Meta-Click multiplies your Click Value by " + format(Math.pow(3, player.metaClickUpgrade), player.notation) + "x.")
    update("c03", "Upgrade Meta-Auto: Level " + player.metaAutoUpgrade + " (Costs " + format(player.metaAutoCost, player.notation) + " Meta-Points)")
    update("c04", "Meta-Auto multiplies your Auto Value by " + format(Math.pow(4, player.metaAutoUpgrade), player.notation) + "x.")
    update("a01", "Earn " + format(player.pointPerClick*Math.pow(3, player.metaClickUpgrade), player.notation) + " Point")
    if (player.pointPerClick*Math.pow(3, player.metaClickUpgrade) != 1)
    {
        update("a01", document.getElementById("a01").innerHTML + "s")
    }
    autoPoint(diff)
    unlock()
    prestigeUpdate()
    update("mp", format(player.metaPoint, player.notation) + " Meta-Point")
    if (player.metaPoint != 1)
    {
        update("mp", document.getElementById("mp").innerHTML + "s")
    }
}, 100)

var saveLoop = window.setInterval(function() {
    localStorage.setItem("badIdleSave", JSON.stringify(player))
    console.log("Game Saved")
}, 10000)
