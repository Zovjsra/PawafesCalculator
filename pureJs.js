var basePoint = 0
var actPoint = [[0, 0, 0, 0, 0]]
var basePoint = [0, 0, 0, 0, 0]
var basePointAttr = {
    difficulty: 1,
    oppPoint: 0,
    isTyphoon: 0,
    playState: 0,
    winPoint: 0,
    managerBonus: [1, 1, 1, 1, 1]
}
var maxActPoint = [0, 80, 90, 100, 120, 150, 200]
var currentGame = 1
var totalPoint = [0, 0, 0, 0, 0]
var actPointTable = {
    'H': {
        'name': '安打',
        'points': [3, 3, 4, 0, 2]
    },
    'h2B': {
        'name': '二塁打',
        'points': [7, 8, 5, 0, 5]
    },
    'h3B': {
        'name': '三塁打',
        'points': [8, 10, 5, 0, 8]
    },
    'HR': {
        'name': '本塁打',
        'points': [10, 0, 5, 0, 9]
    },
    'SH': {
        'name': '犠牲打',
        'points': [0, 4, 4, 0, 0]
    },
    'SF': {
        'name': '犠牲フライ',
        'points': [3, 5, 3, 0, 9]
    },
    'SB': {
        'name': '盗塁',
        'points': [2, 8, 2, 0, 0]
    },
    'onm': {
        'name': '投手登板',
        'points': [3, 1, 1, 3, 3]
    },
    'oFB': {
        'name': 'ストレート系',
        'points': [7, 2, 3, 0, 5]
    },
    'oBR': {
        'name': '変化球',
        'points': [0, 1, 7, 16, 5]
    },
    'K': {
        'name': '奪三振',
        'points': [5, 1, 5, 5, 9]
    },
    'FO': {
        'name': 'フライアウト',
        "points": [4, 5, 4, 2, 6]
    },
    'GO': {
        'name': 'ゴロアウト',
        'points': [2, 2, 6, 4, 8]
    },
    'DP': {
        'name': 'ダブルプレイ',
        'points': [3, 10, 10, 5, 10]
    }
}

function updateTotalPoint() {
    totalPoint = totalPoint.map(function (value, index) {
        return Math.min(~~(maxActPoint[currentGame] * ([0.5, 1, 1.2])[basePointAttr.difficulty]), ~~(actPoint[actPoint.length - 1][index] * ([[1, 1.3], [1, 1], [1, 1.3], [1, 1], [1, 1]])[index][basePointAttr.winPoint])) + basePoint[index]
    })
    console.log(totalPoint)
    for (i = 0; i < 5; i++) {
        $('#currentActPointTable tr:eq(4) td').eq(i + 1).html(totalPoint[i])
    }
}

function updateActPoint() {
    for (i = 0; i < 5; i++) {
        $('#currentActPointTable tr:eq(2) td').eq(i + 1).html(~~(actPoint[actPoint.length - 1][i] * ([[1, 1.3], [1, 1], [1, 1.3], [1, 1], [1, 1]])[i][basePointAttr.winPoint]))
        $('#currentActPointTable tr:eq(3) td').eq(i + 1).html(~~(maxActPoint[currentGame] * ([0.5, 1, 1.2])[basePointAttr.difficulty]))
    }
    updateTotalPoint()
}

function updateBasePoint() {
    basePoint = basePoint.map(function (value, index) {
        return Math.round((basePointAttr.oppPoint * ([1, 2])[basePointAttr.isTyphoon] * ([1, 1.1, 1.2, 1.3, 1.5])[basePointAttr.playState]))
    })
    console.log(basePoint)
    for (i = 0; i < 5; i++) {
        $('#currentActPointTable tr:eq(1) td').eq(i + 1).html(basePoint[i])
    }
    updateTotalPoint()
}

function undoActPoint() {
    if (actPoint.length > 0) {
        actPoint.pop()
    }
    updateActPoint()
}

function clearActPoint() {
    actPoint = [[0, 0, 0, 0, 0]]
    updateActPoint()
}

function loseActPoint() {
    actPoint.push(actPoint[actPoint.length - 1].map(function (point) {
        return ~~(point * 0.96)
    }))
    updateActPoint()
}

function getActPoint() {
    actPoint.push(actPoint[actPoint.length - 1].map(function (point) {
        return ~~(point * 1.1)
    }))
    updateActPoint()
}

function toMaxActPoint() {
    actPoint.push(Array(5).fill(maxActPoint[currentGame] * ([0.5, 1, 1.2])[basePointAttr.difficulty]))
    updateActPoint()
}

function addActTableRow() {
    for (k in actPointTable) {
        let curRow = $('<tr>').appendTo($('#actPointTable tbody').last())
        curRow.append($('<td>').html(actPointTable[k].name))
        for (p of actPointTable[k].points) {
            curRow.append($('<td>').html(p))
        }
        curRow.data('key', k)
        curRow.click(function (event) {
            let key = $(this).data().key
            actPoint.push(actPoint[actPoint.length - 1].map(function (point, index) {
                return point + actPointTable[key].points[index]
            }))
            updateActPoint()
        })
    }
}
updateBasePoint()
updateActPoint()
addActTableRow()
$('#actPoint').hide()
$('#tabSwitch input[name="switch-main"]').change(function () {
    console.log($(this))
    if ($(this).val() == 'inGame') {
        $('#actPoint').show()
        $('#preGameSetting').hide()
    } else {
        $('#actPoint').hide()
        $('#preGameSetting').show()
    }
})
$('#gameSwitch input[name="gameNumber"]').change(function () {
    currentGame = $(this).val()
    updateActPoint()
})
$('input[name="winPoint"]').change(function () {
    console.log($(this).val())
    if (!isNaN($(this).val())) {
        basePointAttr.winPoint = $(this).val()
    }
    updateActPoint()
})
$('input[name="difficulty"]').change(function () {
    console.log($(this).val())
    if (!isNaN($(this).val())) {
        basePointAttr.difficulty = $(this).val()
    }
    updateActPoint()
})
$('input[name="oppPoint"]').change(function () {
    if (!isNaN($(this).val())) {
        basePointAttr.oppPoint = $(this).val()
    }
    updateBasePoint()
})
$('input[name="typhoonSwitch"]').change(function () {
    if (!isNaN($(this).val())) {
        basePointAttr.isTyphoon = $(this).val()
    }
    updateBasePoint()
})
$('input[name="playSwitch"]').change(function () {
    if (!isNaN($(this).val())) {
        basePointAttr.playState = $(this).val()
    }
    updateBasePoint()
})