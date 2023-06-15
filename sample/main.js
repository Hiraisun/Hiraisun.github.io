// // SVG画像ファイルのURL
// const svgUrl = 'example.svg';

// // Imageオブジェクトを作成
// const img = new Image();

// // 画像が読み込まれたら処理を実行
// img.onload = function () {
// 	console.log("1");
// 	// Canvas要素を作成
// 	const canvas = document.createElement('canvas');

// 	// Canvasのサイズを設定
// 	canvas.width = img.width;
// 	canvas.height = img.height;

// 	// 2Dコンテキストを取得
// 	const ctx = canvas.getContext('2d');

// 	// SVG画像ファイルをCanvasに描画
// 	ctx.drawImage(img, 0, 0);

// 	// Canvasの内容をデータURLとして取得
// 	const dataUrl = canvas.toDataURL();

// 	// データURLを使用してラスタ画像として保存
// 	const raster = document.getElementById("raster");
// 	raster.src = dataUrl;
// };

// // ImageオブジェクトにSVG画像ファイルのURLを設定
// img.src = svgUrl;


// SVG画像ファイルのURL
const svgUrl = 'example.svg';

//ここからimageの置換----------------------------------------------
fetch(svgUrl)
	.then(response => response.text())
	.then(str => {
		var parser = new DOMParser();
		var svg = parser.parseFromString(str, 'image/svg+xml').documentElement;
		var images = svg.querySelectorAll('image');
		for (var i = 0; i < images.length; i++) {
			images[i].setAttribute('href', 'newImage.png');
		}
		document.body.appendChild(svg);

		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var img = new Image();
		img.onload = function () {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			var dataURL = canvas.toDataURL();
			document.getElementById("raster").src = dataURL;
		};
		var xml = new XMLSerializer().serializeToString(svg);
		img.src = 'data:image/svg+xml;base64,' + btoa(xml);

	});


