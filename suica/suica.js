
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
	Mouse = Matter.Mouse;

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
			mask: 0xFFFFCC,
		}
	});


var bodys = [];

//bodyいろいろ生成
bodys.push(Bodies.rectangle(100, 100, 120, 120, {
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
wakuBodys.push(Bodies.rectangle(0, wakuHeight / 2, 40, wakuHeight, {
	render: { fillStyle: 'rgb(255, 221, 126)', },
	isStatic: true
}));
wakuBodys.push(Bodies.rectangle(wakuWidth / 2, wakuHeight, wakuWidth, 40, {
	render: { fillStyle: 'rgb(255, 221, 126)', },
	isStatic: true
}));
wakuBodys.push(Bodies.rectangle(wakuWidth, wakuHeight / 2, 40, wakuHeight, {
	render: { fillStyle: 'rgb(255, 221, 126)', },
	isStatic: true
}));
Composite.add(engine.world, wakuBodys);	//ワールドに追加

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
	Composite.add(engine.world, ball);	//追加
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




