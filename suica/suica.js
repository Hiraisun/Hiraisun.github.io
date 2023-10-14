
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
	Body = Matter.Body;

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


var bodys = [];

//bodyいろいろ生成
bodys.push(Bodies.rectangle(0, 0, 120, 120, {
	position: { x: 100, y: 400 },
	render: {
		sprite: {
			texture: '../images/twitterQR.png',
			xScale: 0.5,
			yScale: 0.5
		}
	}
}));


//ワールドに追加
Composite.add(engine.world, bodys);

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
	const cardOpt = {
		restitution: 0.5,
		isStatic: true,
		collisionFilter: { //オブジェクトに触れられないようにフィルタ
			mask: 0xFFFFCC,
		},
		label: num
	};
	switch (num) {
		case 0:
			newBody = Bodies.circle(100, 100, 20, cardOpt);
			return newBody;
		case 1:
			newBody = Bodies.circle(100, 100, 30, cardOpt);
			return newBody;
		case 2:
			newBody = Bodies.circle(100, 100, 40, cardOpt);
			return newBody;
		case 3:
			newBody = Bodies.circle(100, 100, 50, cardOpt);
			newBody.label = "max";
			return newBody;
		default:
			break;
	}
}


//開始時に持つカード
var holdingBody = createCard(0);	//id0を生成
Body.setPosition(holdingBody, { x: 100, y: 50 });
//ボール生成
Composite.add(engine.world, holdingBody);


//マウスクリック時
Events.on(mouseConstraint, 'mousedown', function (event) {
	//持ってるやつを実体化
	Body.setStatic(holdingBody, false);
	holdingBody.collisionFilter.mask = 1;

	//次のカード生成
	randnum = Math.floor(Math.random() * 2);	//乱数
	holdingBody = createCard(randnum);	//出た目のやつ生成
	Body.setPosition(holdingBody, { x: mouse.position.x, y: 50 });
	//ボール生成
	Composite.add(engine.world, holdingBody);	//追加
});

//tick処理
Events.on(runner, "beforeTick", function (event) {
	//var holdMatt = Matter.Composite.get(engine.world, holdingID, "body");

	//マウス追従
	Body.setPosition(holdingBody, { x: mouse.position.x, y: 50 });
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



