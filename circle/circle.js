
const inputElement = document.getElementById("input-r"); //半径
const canvasElement = document.getElementById("out-canvas"); //キャンバス

//ctx.imageSmoothingEnabled = false;//補完しない

//パラメータ------------------
const margin = 30;	//余白
const grid = 20;	//間隔

let r = parseInt(inputElement.value);
drawCircle();


//半径変更時
inputElement.addEventListener("change", (event) => {
	r = parseInt(inputElement.value);
	drawCircle();
});


function drawCircle() {
	canvasElement.width = (r + 1) * grid + margin * 2;
	canvasElement.height = (r + 1) * grid + margin * 2;
	const ctx = canvasElement.getContext('2d');


	// 方眼描く
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;

	// パスの開始
	ctx.beginPath();

	console.log();

	ctx.fillStyle = 'orange';
	for (let x = 0; x < r + 1; x++) {
		for (let y = 0; y < r + 1; y++) {
			if ((x ** 2) + (y ** 2) <= (r + 0.5) ** 2) {
				ctx.fillRect(x * grid + margin, y * grid + margin, grid, grid);
			}
			//console.log(x.toString() + ',' + y.toString());
		}
	}


	//方眼
	for (let index = 0; index <= r + 1; index++) {
		const x = index * grid + margin
		//縦線
		ctx.moveTo(x, 30);//線開始
		ctx.lineTo(x, grid * (r + 1) + margin);//線終了
		//横線
		ctx.moveTo(30, x);//線開始
		ctx.lineTo(grid * (r + 1) + margin, x);//線終了
	}

	// 描画
	ctx.stroke();


}






//展開図生成処理 一連の流れ
async function generateExploded() {
	console.log("----展開図生成開始------------------------");

	//スキンを拡大する
	let extendedskin64 = await extendSkin(skinBase64);
	console.log("スキン拡大完了 dataURL: ");

	//svgをスキンで置換する (完了まで待つawait)
	let svgXml = await replaceSVG(extendedskin64);
	console.log("スキン置換完了 xml:");

	//ラスタライズ
	let rasterized64 = await rasterize(svgXml);
	console.log("ラスタライズ完了 dataURL:");

}

/// 1.Promiseを使った同期読み込み
async function loadImage(imgUrl) {
	let img = null;
	let promise = new Promise(function (resolve) {
		img = new Image();
		/// 読み込み開始...
		img.src = imgUrl;
		img.onload = function () {
			/// 読み込み完了後...
			console.log('image読み込み完了');
			resolve();
		}
	});
	/// 読込完了まで待つ
	await promise;
	return img;
}


//スキン拡大処理
async function extendSkin(inBase64) {
	//画像読み込み、完了まで待つ
	let skinImg = await loadImage(inBase64);

	//キャンバス生成、サイズ指定
	let canvas = document.createElement('canvas');
	canvas.width = expandRatio;
	canvas.height = expandRatio;

	//CanvasRenderingContext2D っていうオブジェクトを生成(canvas2d)
	//2Dグラフィックの描画とかできるっぽい。Graphicsてきな
	let ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;//補完しない
	ctx.drawImage(skinImg, 0, 0, expandRatio, expandRatio);
	let extendedSkin64 = canvas.toDataURL();//base64として記録

	canvas.remove()	//使ったcanvas削除

	console.log("拡大関数");
	return extendedSkin64;



}

//SVGの置換処理 置換後xmlを返す
async function replaceSVG(inBase64) {
	return fetch(svgUrl)	//svgとってくる(テキスト形式)
		.then(response => response.text())
		.then(str => {
			//svg要素取得
			let parser = new DOMParser();
			let svg = parser.parseFromString(str, 'image/svg+xml').documentElement;
			//svg内の全image要素取得
			let images = svg.querySelectorAll('image');

			//全てのimage要素に対して
			images.forEach(imageElement => {
				if (imageElement.getAttribute('xlink:href') == "skin.png") {	//skin.pngだけを入れ替える
					imageElement.setAttribute('href', inBase64);
				}
			});

			let xml = new XMLSerializer().serializeToString(svg);

			console.log("置換関数");
			return xml;
		});
}


//ラスタライズ処理 dataURL返す
async function rasterize(inXml) {
	//canvasに描画する画像(置換後xmlから)
	let img = await loadImage('data:image/svg+xml;base64,' + utf8_to_b64(inXml));

	//canvasを使ってラスタライズ
	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');
	canvas.width = img.width * rasterRetio;
	canvas.height = img.height * rasterRetio;

	//背景塗りつぶし
	ctx.beginPath();
	ctx.fillStyle = 'rgb( 255,255,255)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	//dataURL(base64)にして出力
	let dataURL = canvas.toDataURL();

	document.getElementById("raster").src = dataURL;
	document.getElementById("download-a").href = dataURL;

	console.log("ラスタライズ関数");
	return dataURL;
}



function utf8_to_b64(str) {//文字コード変更してbase64するやつ
	return window.btoa(unescape(encodeURIComponent(str)));
}


