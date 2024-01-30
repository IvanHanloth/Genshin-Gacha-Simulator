
class Card {
    /**
     * 抽卡类型：
     * 0:歪
     * 1:金
     * 2:紫
     * 3:蓝
     */
    constructor() {
        this.num = {
            "count": 0,
            "num": 0,
            "total": 0,
            'turn': 1,
            "random": 0
        }; //数据
        this.res = {
            "up": [],
            "waile": [],
            "purple": [],
            "blue": [],
            "this": "金"
        }; //结果
        this.baodi = {
            "gold": 0,
            "purple": 0
        }; //保底
        this.range = {
            "gold": 503 - 497,
            "purple": 1000 - 975 + 26,
            "blue": 1000 - (503 - 497) - (1000 - 975 + 26)
        }; //范围
    }

    gold() {
        if (this.baodi["gold"] == 1) { //大保底
            this.baodi["gold"] = 0;
            this.res['up'].push({
                "count": this.num['count'],
                "total": this.num['total'],
                "turn": this.num['turn']
            });
            this.res['this'] = "UP"
        } else {
            let res = Math.floor(Math.random() * 3) - 1;
            if (res == 0) {
                this.baodi["gold"] = 1;
                this.res['waile'].push({
                    "count": this.num['count'],
                    "total": this.num['total'],
                    "turn": this.num['turn']
                });
                this.res['this'] = "歪"
            } else {
                this.res['up'].push({
                    "count": this.num['count'],
                    "total": this.num['total'],
                    "turn": this.num['turn']
                });
                this.res['this'] = "UP"
            }
        }
        this.num['count'] = 0;
        this.num['turn'] += 1;
    }

    purple() {
        this.baodi['purple'] = 0;
        let res = Math.floor(Math.random() * 1001);
        if (res >= 497 && res <= 502) {
            this.gold();
        } else {
            this.res['purple'].push({
                "count": this.num['count'],
                "total": this.num['total'],
                "turn": this.num['turn']
            });
            this.res['this'] = "紫"
        }
    }

    blue() {
        this.baodi["purple"] += 1;
        this.res['blue'].push({
            "count": this.num['count'],
            "total": this.num['total'],
            "turn": this.num['turn']
        });
        this.res['this'] = "蓝"
    }

    gacha() {
        var result = Math.floor(Math.random() * 1000) + 1;
        this.num['random'] = result;
        var gold = Array.from(Array(6).keys());
        var purple = Array.from(Array(51).keys()).map(x => x + 949);
        if (this.num['count'] >= 74) {
            gold = Array.from(Array((this.num['count'] - 73) * 60 + 6).keys());
        }
        if (this.baodi['purple'] >= 9) {
            purple = Array.from(Array(510 * (this.baodi['purple'] - 8)).keys()).map(x => 1000 - 51 - x);
        }
        this.range = {
            "gold": gold.length,
            "purple": purple.length,
            "blue": 1000 - gold.length - purple.length
        }
        if (this.range['blue'] < 0) {
            this.range['blue'] = 0
            this.range['purple'] = 1000 - gold.length
        }

        if (gold.includes(result)) {
            this.gold();
        } else if (purple.includes(result)) {
            this.purple();
        } else {
            this.blue();
        }
    }

    report() {
        return {
            "num": this.num['num'],
            "consume": this.num['total'] * 160,
            "turn": this.num['turn'],
            "up": this.res['up'].length,
            "waile": this.res['waile'].length,
            "purple": this.res['purple'].length,
            "blue": this.res['blue'].length,
            "detail": this.res,
            "range": this.range,
            "random": this.num['random']
        }
    }

    main(num) {
        this.num['num'] = num
        for (let i = 0; i < this.num['num']; i++) {
            this.num['count'] += 1;
            this.num['total'] += 1;
            this.gacha();
        }
        return this.report()
    }
}


$("#start-gacha-1").click(function () {
    if ($("#gacha-num-1").val() == "") {
        layui.layer.msg("请输入抽卡次数", {
            icon: 2,
            time: 1500,
            anim: 6
        })
        return false;
    }
    card = new Card();
    res = card.main($("#gacha-num-1").val());
    $("#consume-num-1").html(res['consume']);
    $("#turn-num-1").html(res['turn']);
    $("#up-num-1").html(res['up']);
    $("#waile-num-1").html(res['waile']);
    $("#purple-num-1").html(res['purple']);
    $("#blue-num-1").html(res['blue']);
    $("#res-saver-1").html(JSON.stringify(res));
})
whole_card = new Card();
$("#start-gacha-2").click(function () {
    if ($("#start-gacha-2").html() == "启动抽卡") {
        action1();
    } else {
        action2();
    }

    function action1() {
        if ($("#gacha-time").val() == "") {
            layui.layer.msg("请输入抽卡间隔", {
                icon: 2,
                time: 1500,
                anim: 6
            })
            return false;
        }
        if ($("#gacha-time").val() - 1 + 1 <= 0.4) {
            layui.layer.msg("抽卡间隔不建议小于0.3s", {
                time: 1500
            })
            return false;
        }
        $("#start-gacha-2").html("停止抽卡");
        $("#gacha-time-1").attr("disabled", "disabled")

        function action() {
            $("#gacha-num-2").html($("#gacha-num-2").html() - 1 + 2)
            whole_card.num['total'] = $("#gacha-num-2").html();
            whole_card.num['count'] += 1;
            whole_card.gacha();
            res = whole_card.report();
            $("#consume-num-2").html(res['consume']);
            $("#turn-num-2").html(res['turn']);
            $("#up-num-2").html(res['up']);
            $("#waile-num-2").html(res['waile']);
            $("#purple-num-2").html(res['purple']);
            $("#blue-num-2").html(res['blue']);
            $("#res-saver-2").html(JSON.stringify(res));
            $(".posibility-gold").css("width", res['range']['gold'] / 10 + "%")
            $(".posibility-purple").css("width", res['range']['purple'] / 10 + "%")
            $(".posibility-blue").css("width", res['range']['blue'] / 10 + "%")
            $(".posibility-show").html(res['random'])
            $(".posibility-res").html(res['detail']['this'])
            $(".posibility-cursor").css("left", "calc(" + res['random'] / 10 + "% - 1px)")
        }
        action()
        $("#res-saver-2").attr("data-interval", setInterval(action, $("#gacha-time").val() * 1000))
    }

    function action2() {
        $("#start-gacha-2").html("启动抽卡");
        $("#gacha-time-1").removeAttr("disabled")
        clearInterval($("#res-saver-2").attr("data-interval"))
    }
})

function show_detail(type, content, num) {
    layui.use(function () {
        layer = layui.layer;
        if ($("#res-saver-" + num).html() == "") {
            layer.msg("请先进行抽卡", {
                icon: 2,
                time: 1500,
                anim: 6
            })
            return false;
        }
        res = JSON.parse($("#res-saver-" + num).html())

        function create() {
            html = '<div style="text-align:center;min-height:200px;min-width:28em" >\
            <h2>您一共' + content + '了' + res[type] + '次，详细信息如下</h2><table style="width: 100%;text-align: center;">\
<thead>\
<tr>\
  <th>总抽数</th>\
  <th>抽卡轮数</th>\
  <th>该轮抽数</th>\
  <th>总计原石消耗</th>\
</tr>\
</thead>\
<tbody>'
            res["detail"][type].forEach(function (item, index) {
                html += '<tr>\
                <td>' + item['total'] + '</td>\
                <td>' + item['turn'] + '</td>\
                <td>' + item['count'] + '</td>\
                <td>' + item['total'] * 160 + '</td>\
                </tr>'
            })
            html += '</tbody>\
</table></div>'
            return html
        }
        txt = create()
        layer.open({
            type: 1,
            content: txt,
            title: "抽卡详情",
            shade: 0.3
        })
    })
}
console.log("\n %c Genshin-Gacha-Simulator https://github.com/IvanHanloth/Genshin-Gacha-Simulator", "font-weight:bold;color:#fff;background:linear-gradient(90deg,#44e9ff,#ffce60);padding:5px 0;font-family:'微软雅黑'");