
//パラメータ類-----------------------------
const expandRatio = 1024; //画像解像度
const rasterRetio = 4;	//ラスタライズ時拡大割合
const svgUrl = '/ojigiSteve/ojigiSteve.svg'; //使うsvgのurl

//----------------------------------------


const inputElement = document.getElementById("image-input");
const imageElement = document.getElementById("image-preview");//選択中スキンいれるとこ

let inputSkin;//選択中のスキン画像(fileオブジェクト)
let skinBase64;//選択中スキンのbase64(データURL)



//最初にデフォルトスキンいれとく
fetch('/ojigiSteve/skin.png')
	.then(response => response.blob())
	.then(blob => {
		skinReader.readAsDataURL(blob); // blobをbase64に変換しonload呼び出し
	})

//inputで画像が選択されたとき
inputElement.addEventListener("change", (event) => {
	skinReader.readAsDataURL(event.target.files[0]);
});

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

//blobをbase64にするやつ
let skinReader = new FileReader();	//スキンpng(blob)の変換
//読み込み時に呼び出される。
skinReader.onload = function () {
	skinBase64 = skinReader.result; // data url(base64)を格納
	imageElement.src = skinBase64;//スキンプレビュー更新
	console.log("スキン読み込み完了 base64: " + skinBase64);
	//展開図生成処理
	generateExploded();
};

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


