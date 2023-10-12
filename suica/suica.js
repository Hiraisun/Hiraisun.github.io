
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
	Mouse = Matter.Mouse;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
	element: canvasElement,
	engine: engine,
	options: {
		width: 800,
		height: 600,
	}
});

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
			mask: 0xFFFFCC,
		}
	});

//bodyいろいろ生成
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80, {
	render: {
		strokeStyle: "#ffffff",
		sprite: { texture: './twitterQR.png' }
	}
});
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

console.log(boxB.render.sprite);


//ワールドに追加
Composite.add(engine.world, [mouseConstraint, boxA, boxB, ground]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);


//マウスクリック時
Events.on(mouseConstraint, 'mousedown', function (event) {

	//ボール生成
	const ball = Bodies.circle(event.mouse.position.x, event.mouse.position.y, 20, {
		restitution: 0.5,
	});
	Composite.add(engine.world, ball);
});


























//パラメータ------------------
const margin = 30;	//余白
const grid = 20;	//間隔



//半径変更時
inputElement.addEventListener("change", (event) => {
	r = parseFloat(inputElement.value);
	drawCircle();
});


function drawCircle() {
	const ceilr = Math.ceil(r);	//切り上げて+1した半径。グリッド本数等に

	canvasElement.width = ceilr * grid + margin * 2;
	canvasElement.height = ceilr * grid + margin * 2;
	const ctx = canvasElement.getContext('2d');





	//円内の色付け
	ctx.fillStyle = 'rgb(0, 255, 34,0.7)';
	for (let x = 0; x < ceilr; x++) {
		for (let y = 0; y < ceilr; y++) {
			if ((x ** 2) + (y ** 2) <= (r + 0.5) ** 2) {
				ctx.fillRect(x * grid + margin, y * grid + margin, grid, grid);
			}
			//console.log(x.toString() + ',' + y.toString());
		}
	}

	ctx.fillStyle = 'orange';
	ctx.fillRect(margin, margin, grid, grid)

	// 方眼描く
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;

	const endpos = grid * ceilr + margin; //線の終点座標

	//方眼-縦線横線同時にループ。番号も同時に
	for (let index = 0; index <= ceilr; index++) {
		const pos = index * grid + margin //線の座標

		ctx.beginPath();

		//8本ごとに太線
		if (index % 8 == 0) {
			ctx.lineWidth = 2;
		} else {
			ctx.lineWidth = 0.5;
		}

		//縦線
		ctx.moveTo(pos, margin);//線開始
		ctx.lineTo(pos, endpos);//線終了
		//横線
		ctx.moveTo(margin, pos);//線開始
		ctx.lineTo(endpos, pos);//線終了

		ctx.stroke();
	}


}




