
//パラメータ類---------------
const wakuHeight = 600;
const wakuWidth = 400;

const canvasElement = document.getElementById("gameCanvas"); //描画位置


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
		height: wakuHeight,
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
wakuBodys.push(Bodies.rectangle(0, wakuHeight / 2, 40, wakuHeight, wakuParam));
wakuBodys.push(Bodies.rectangle(wakuWidth / 2, wakuHeight, wakuWidth, 40, wakuParam));
wakuBodys.push(Bodies.rectangle(wakuWidth, wakuHeight / 2, 40, wakuHeight, wakuParam));
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
	var r = 20
	var renderParam = {
		sprite: {
			texture: '../images/twitterQR.png',
			xScale: 0.5, yScale: 0.5
		}
	};

	switch (num) {	//各カードデータ
		case 0:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 1:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 2:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 3:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 4:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 5:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 6:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 7:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 8:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 9:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 10:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		case 11:
			tate = 50
			r = 5
			renderParam.sprite.xScale = 0.1;
			renderParam.sprite.yScale = 0.1;
			renderParam.sprite.texture = '../images/twitterQR.png';
			break;
		default:
			break;
	}


	//いざ生成
	var verti = Bodies.rectangle(0, 0, yoko - r * 2, tate, { render: { visible: false } });
	var horizon = Bodies.rectangle(0, 0, yoko, tate - r * 2,);
	var ru = Bodies.circle(yoko / 2 - r, -tate / 2 + r, r,);	//右上
	var rd = Bodies.circle(yoko / 2 - r, tate / 2 - r, r,);		//右下
	var ld = Bodies.circle(-yoko / 2 + r, tate / 2 - r, r);		//左下
	var lu = Bodies.circle(-yoko / 2 + r, -tate / 2 + r, r);	//左上
	var body2 = Body.create({
		parts: [verti, horizon, ru, rd, ld, lu],
		label: "collisionBody",
		isStatic: true,
		collisionFilter: { //オブジェクトに触れられないようにフィルタ
			mask: 0xFFFFCC,
		},
	});
	//画像用
	spriteHolder = Bodies.rectangle(0, 0, 200, 200,
		{
			collisionFilter: {
				mask: 0,
			},
			render: renderParam,
		}
	)
	let constraint = Constraint.create({
		bodyA: body2, bodyB: spriteHolder,
		pointA: { x: yoko / 2, y: 0 },
		pointB: { x: yoko / 2, y: 0 },
		length: 0
	});
	let constraint2 = Constraint.create({
		bodyA: body2, bodyB: spriteHolder,
		pointA: { x: -yoko / 2, y: 0 },
		pointB: { x: -yoko / 2, y: 0 },
		length: 0
	});
	let group = Composite.create({ label: `group` });

	Body.setPosition(body2, { x: 300, y: 100 });

	Composite.add(group, [body2, spriteHolder, constraint, constraint2])


	return group;

}


//開始時に持つカード
var holdingObj = createCard(0);	//id0を生成
//カード
Composite.add(engine.world, holdingObj);


//マウスクリック時
Events.on(mouseConstraint, 'mousedown', function (event) {
	//持ってるやつを実体化
	Body.setStatic(holdingObj.bodies[0], false);
	holdingObj.bodies[0].collisionFilter.mask = 1;

	//次のカード生成
	randnum = Math.floor(Math.random() * 2);	//乱数
	holdingObj = createCard(randnum);	//出た目のやつ生成
	Body.setPosition(holdingObj.bodies[0], { x: mouse.position.x, y: 50 });
	//ボール生成
	Composite.add(engine.world, holdingObj);	//追加
});

//tick処理
Events.on(runner, "beforeTick", function (event) {
	//var holdMatt = Matter.Composite.get(engine.world, holdingID, "body");

	//マウス追従
	console.log(holdingObj);
	Body.setPosition(holdingObj.bodies[0], { x: mouse.position.x, y: 50 });

});

//衝突イベント
Events.on(engine, "collisionStart", function (event) {
	var pairs = event.pairs;
	pairs.forEach(pair => {

		if (pair.bodyA.label >= 0) {	//数字ラベル(カード)で
			if (pair.bodyA.label == pair.bodyB.label) {	//ラベル一致
				console.log(pair);
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
			}
		}
	});
});



