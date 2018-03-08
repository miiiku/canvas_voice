var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var param = {
    arr: [], // 获取到的音频数据
    x: 0.5, // 中心点x轴
    y: 0.7, // 中心点y轴
    color: "rgba(255, 255, 255, 1.0)", // 颜色
    shadowColor: "rgba(255, 255, 0, 1.0)", // 模糊颜色
    colorT: 1, // 颜色透明度
    shadowColorT: 1, // 模糊颜色透明度
    shadowBlur: 48, // 模糊大小
    lineWidth: 4, // 线宽
    range: 100, // 振幅
    spacing: 1, // 间距
    base: true, // 是否有最小高度
    round: false, // 是否启用线条圆角
}

window.onresize = resize;
resize();

/* 监听配置 */
window.wallpaperPropertyListener = {
    applyUserProperties: function(properties){
		// 背景图
		if(properties.image){
			if(properties.image.value){
				document.body.style.backgroundImage = "url('file:///"+ properties.image.value +"')";
			}else{
				document.body.style.backgroundImage = "url('bg.jpg')";
			}
		}
        // 背景填充样式
        if(properties.gackgroundStyle) {
            var style = "cover";
            var repeat = "no-repeat";
            switch(properties.gackgroundStyle.value){
                case 1: // 填充
                    style = 'cover';
                    break;
                case 2: // 适应
                    style = 'contain';
                    break;
                case 3: // 拉伸
                    style = '100% 100%';
                    break;
                case 4: // 平铺
                    style = 'initial';
                    repeat = 'repeat';
                    break;
                case 5: // 居中
                    style = 'initial';
                    break;
            }
            document.body.style.backgroundSize = style;
            document.body.style.backgroundRepeat = repeat;
        }
        // 颜色
        if(properties.color){
            param.color = properties.color.value.split(' ').map(function(c){return Math.ceil(c*255)});
            ctx.strokeStyle = 'rgba('+ param.color +','+ param.colorT +')';
        }
        // 颜色透明度
        if(properties.colorT){
            param.colorT = properties.colorT.value / 100;
            ctx.strokeStyle = 'rgba('+ param.color +','+ param.colorT +')';
        };
		// 模糊颜色
		if(properties.shadowColor){
			param.shadowColor = properties.shadowColor.value.split(' ').map(function(c){return Math.ceil(c*255)});
            ctx.shadowColor = 'rgba('+ param.shadowColor +','+ param.shadowColorT +')';
		};
        // 模糊透明度
        if(properties.shadowColorT){
            param.shadowColorT = properties.shadowColorT.value / 100;
            ctx.shadowColor = 'rgba('+ param.shadowColor +','+ param.shadowColorT +')';
        };
        // 模糊大小
        if(properties.shadowBlur){
            ctx.shadowBlur = param.shadowBlur = properties.shadowBlur.value;
        };
		// 中心点x
		if(properties.cX){
			param.x = properties.cX.value / 100;
		};
		// 中心点y
		if(properties.cY){
			param.y = properties.cY.value / 100;
		};
        // 基础高
        if(properties.base){
            param.base = properties.base.value;
        };
		// 线宽
		if(properties.lineWidth){
			ctx.lineWidth = param.lineWidth = properties.lineWidth.value;
		};
        // 幅度
        if(properties.range){
            param.range = properties.range.value;
        };
        // 间距
        if(properties.spacing){
            param.spacing = properties.spacing.value;
        };
        // 圆角
        if(properties.round){
            param.round = properties.round.value;
            if(properties.round.value) {
                ctx.lineCap = "round";
            }else {
                ctx.lineCap = "butt";
            }
        };
	}
}

window.wallpaperRegisterAudioListener && window.wallpaperRegisterAudioListener(wallpaperAudioListener);

function wallpaperAudioListener(audioArray){
	refresh(audioArray)
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = param.shadowBlur;
    ctx.shadowColor = param.shadowColor;
    ctx.strokeStyle = param.color;
    ctx.lineWidth = param.lineWidth;

    if(param.round) {
        ctx.lineCap = "round";
    }else {
        ctx.lineCap = "butt";
    }
}

function style(audioArray) {
	var audioArray = audioArray || [];
    var centerX = canvas.width * param.x;
    var centerY = canvas.height * param.y;

    param.arr = [];

    /**
    *   备注
    *   画矩形 是从给出的坐标往右开始画
    *   画线条 是从给出的坐标往左右两边画
    *   所以在计算x坐标时 需要加上线宽的一半使其成为中心点
    */

    // 左
    for(var i = 0; i < audioArray.length; i++) {
        var height = audioArray[i] ? audioArray[i] : 0;
        height = height * param.range;
        if(param.base) height ++;

        var x = (i + 1) * (param.lineWidth + param.spacing);

        param.arr.push({
            x: centerX - x + param.spacing / 2 + param.lineWidth / 2,
            y1: centerY - height / 2,
            y2: centerY + height / 2
        });
    }

    // 右
    for(var i = 0; i < audioArray.length; i++) {
        var height = audioArray[i] ? audioArray[i] : 0;
        height = height * param.range;
        if(param.base) height ++;

        var x = (i + 1) * (param.lineWidth + param.spacing);

        param.arr.push({
            x: centerX + x - param.lineWidth - param.spacing / 2 + param.lineWidth / 2,
            y1: centerY - height / 2,
            y2: centerY + height / 2
        });
    }	
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 画线
    ctx.beginPath();
    for(var i = 0; i < param.arr.length; i++) {
        ctx.moveTo(param.arr[i].x, param.arr[i].y1);
        ctx.lineTo(param.arr[i].x, param.arr[i].y2);
    };
    ctx.stroke();
    ctx.closePath();
}

function refresh(audioArray) {
    style(audioArray);
    draw();
}
