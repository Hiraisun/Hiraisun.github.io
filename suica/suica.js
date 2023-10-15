
//パラメータ類---------------
const wakuHeight = 500;
const wakuWidth = 400;

const allHeight = 650	//枠の終わりまで全体

const wakuStart = allHeight - wakuHeight		//枠が始まるY座標
const wakuCenter = wakuStart + wakuHeight / 2	//枠の中心Y座標

const canvasElement = document.getElementById("gameCanvas"); //描画位置
const scoreSpan = document.getElementById("scoreSpan");	//スコア表示位置

// module aliases
var Engine = Matter.Engine,
	World = Matter.World,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite,
	Events = Matter.Events,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse,
	Common = Matter.Common,
	Body = Matter.Body,
	Constraint = Matter.Constraint

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
	element: canvasElement,
	engine: engine,
	options: {
		width: wakuWidth,
		height: allHeight + 50,
		wireframes: false,
		background: "rgba(255,255,255,0)",
	}
});



//マウスオブジェクト
var mouse = Mouse.create(render.canvas),
	mouseConstraint = MouseConstraint.create(engine, {
		mouse: mouse,
		constraint: {
			stiffness: 0.2,
			render: {
				visible: false
			}
		},
		collisionFilter: { //オブジェクトに触れられないようにフィルタ
			mask: 0xFFFFEE,
		}
	});



//枠の作成
var wakuBodys = [];
wakuParam = {
	render: { fillStyle: 'rgb(255, 221, 126)', },
	isStatic: true
}
wakuBodys.push(Bodies.rectangle(0, wakuCenter, 40, wakuHeight, wakuParam));
wakuBodys.push(Bodies.rectangle(wakuWidth / 2, allHeight, wakuWidth, 20, wakuParam));
wakuBodys.push(Bodies.rectangle(wakuWidth, wakuCenter, 40, wakuHeight, wakuParam));
Composite.add(engine.world, wakuBodys);	//ワールドに追加

// run the renderer
Render.run(render);
// create runner
var runner = Runner.create();
// run the engine
Runner.run(runner, engine);



//カード生成関数
function createCard(num) {

	//パラメータ
	var tate = 100
	var yoko = tate * 1.618

	var rendScale = 0.1;
	var textureSource = '/suica/card_image/kippu.png';

	switch (num) {	//各カードデータ
		case 0:
			tate = 30
			yoko = tate * 2
			rendScale = 0.08;
			textureSource = '/suica/card_image/kippu.png';
			break;
		case 1:
			tate = 35
			yoko = tate * 1.618
			rendScale = 0.155;
			textureSource = '/suica/card_image/hayakaken.png';
			break;
		case 2:
			tate = 40
			yoko = tate * 1.618
			rendScale = 0.1;
			textureSource = '/suica/card_image/kitaca.png';
			break;
		case 3:
			tate = 45
			yoko = tate * 1.618
			rendScale = 0.13;
			textureSource = '/suica/card_image/toica.png';
			break;
		case 4:
			tate = 50
			yoko = tate * 1.618
			rendScale = 0.16;
			textureSource = '/suica/card_image/pitapa.png';
			break;
		case 5:
			tate = 60
			yoko = tate * 1.618
			rendScale = 0.05;
			textureSource = '/suica/card_image/sugoca.png';
			break;
		case 6:
			tate = 70
			yoko = tate * 1.618
			rendScale = 0.25;
			textureSource = '/suica/card_image/nimoca.png';
			break;
		case 7:
			tate = 80
			yoko = tate * 1.618
			rendScale = 0.23;
			textureSource = '/suica/card_image/manaca.png';
			break;
		case 8:
			tate = 90
			yoko = tate * 1.618
			rendScale = 0.63;
			textureSource = '/suica/card_image/icoca.png';
			break;
		case 9:
			tate = 100
			yoko = tate * 1.618
			rendScale = 0.46;
			textureSource = '/suica/card_image/pasmo.png';
			break;
		case 10:
			tate = 120
			yoko = tate * 1.618
			rendScale = 0.55;
			textureSource = '/suica/card_image/suica.png';
			break;
		default:
			break;
	}

	//いざ生成
	var body = Bodies.rectangle(0, 0, yoko, tate, {
		label: num,
		isStatic: true,
		slop: 0.02,
		frictionAir: 0.02,
		collisionFilter: { //オブジェクトに触れられないようにフィルタ
			mask: 0xFFFFCC,
		},
		render: {
			sprite: {
				texture: textureSource,
				xScale: rendScale, yScale: rendScale
			}
		}
	});

	return body;

}


//開始時に持つカード
var holdingObj = createCard(0);	//id0を生成
//カード
Composite.add(engine.world, holdingObj);

//クリック
canvasElement.addEventListener('click', function () {
	//持ってるやつを実体化
	Body.setStatic(holdingObj, false);
	holdingObj.collisionFilter.mask = 1;

	//次のカード生成
	var randnum = Math.floor(Math.random() * 5);	//乱数
	holdingObj = createCard(randnum);	//出た目のやつ生成
	Body.setPosition(holdingObj, { x: mouse.position.x, y: 50 });
	//ボール生成
	Composite.add(engine.world, holdingObj);	//追加
});

//ホイール
window.onmousewheel = function () {
	if (event.wheelDelta > 0) {
		Matter.Body.rotate(holdingObj, -Math.PI / 16)
	} else {
		Matter.Body.rotate(holdingObj, Math.PI / 16)
	}
}


//tick処理
Events.on(runner, "beforeTick", function (event) {
	//var holdMatt = Matter.Composite.get(engine.world, holdingID, "body");

	//マウス追従
	Body.setPosition(holdingObj, { x: mouse.position.x, y: 100 });

});

var score = 0;
//合成前id→合成時のスコア
const idToScore = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];

//衝突イベント
Events.on(engine, "collisionStart", function (event) {
	var pairs = event.pairs;
	pairs.forEach(pair => {

		if (pair.bodyA.label >= 0 && pair.bodyA.label != 10) {	//数字ラベル(カード)で
			if (pair.bodyA.label == pair.bodyB.label) {	//ラベル一致

				//合体！
				//中間に生成
				newBody = createCard(pair.bodyA.label + 1);	//次のidのやつ
				newx = (pair.bodyA.position.x + pair.bodyB.position.x) / 2;
				newy = (pair.bodyA.position.y + pair.bodyB.position.y) / 2;
				Body.setPosition(newBody, { x: newx, y: newy });
				Body.setStatic(newBody, false);
				newBody.collisionFilter.mask = 1;
				//ボール生成
				Composite.add(engine.world, newBody);	//追加

				Composite.remove(engine.world, pair.bodyA);
				Composite.remove(engine.world, pair.bodyB);

				//スコア加算
				score += idToScore[pair.bodyA.label];
				scoreSpan.innerHTML = score;
			}
		}
	});
});



