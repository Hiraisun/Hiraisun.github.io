
const inputElement = document.getElementById("image-input");
const imageElement = document.getElementById("image-preview");

let inputSkin;//選択中のスキン画像(fileオブジェクト)

//最初にデフォルトスキンいれとく
fetch('/ojigiSteve/skin.png')
	.then(response => response.blob())
	.then(blob => {
		inputSkin = new File([blob], 'skin.png', { type: 'image/png' });
		rasterizeSteve();
	});

//inputで画像が選択されたとき
inputElement.addEventListener("change", (event) => {
	const reader = new FileReader();
	reader.readAsDataURL(event.target.files[0]);
	reader.onload = (event) => {
		imageElement.src = event.target.result;//スキンプレビュー
		inputSkin = inputElement.files[0];
		rasterizeSteve();
	};
});

function utf8_to_b64(str) {//文字コード変更してbase64するやつ
	return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
	return decodeURIComponent(escape(window.atob(str)));
}




function rasterizeSteve() {

	//input画像を拡大
	const expandRatio = 1024;//←変えてok
	let reader = new FileReader();
	reader.onload = function (e) {
		let img = new Image();
		img.onload = function () {
			let canvas = document.createElement('canvas');
			canvas.width = expandRatio;
			canvas.height = expandRatio;

			//CanvasRenderingContext2D っていうオブジェクトを生成(canvas2d)
			//2Dグラフィックの描画とかできるっぽい
			let ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;//補完しない
			ctx.drawImage(img, 0, 0, expandRatio, expandRatio);
			let extendBase64 = canvas.toDataURL();//base64として記録

			//svgのimageの置換----------------------------------------------
			const svgUrl = '/ojigiSteve/ojigiSteve.svg';
			fetch(svgUrl)
				.then(response => response.text())
				.then(str => {
					//svgのテキストデータ、全てのimageを取得
					let parser = new DOMParser();
					let svg = parser.parseFromString(str, 'image/svg+xml').documentElement;
					let images = svg.querySelectorAll('image');

					//全てのimageを置換
					for (let i = 0; i < images.length; i++) {
						images[i].setAttribute('href', extendBase64);
					}


					//canvasを使ってラスタライズ
					let canvas = document.createElement('canvas');
					let ctx = canvas.getContext('2d');
					let img = new Image();
					let rasterRetio = 4;
					img.onload = function () {
						canvas.width = img.width * rasterRetio;//ラスタライズ解像度
						canvas.height = img.height * rasterRetio;
						ctx.imageSmoothingEnabled = false;
						ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
						let dataURL = canvas.toDataURL();
						document.getElementById("raster").src = dataURL;
						document.getElementById("download-a").href = dataURL;
					};
					let xml = new XMLSerializer().serializeToString(svg);
					img.src = 'data:image/svg+xml;base64,' + utf8_to_b64(xml);

				});

		}
		img.src = e.target.result;
	}
	reader.readAsDataURL(inputSkin);

}






