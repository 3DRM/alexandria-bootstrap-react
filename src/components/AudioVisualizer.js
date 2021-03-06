import React, { Component } from 'react';

class AudioVisualizer extends Component {
	constructor(props){
		super(props);

		this.startVisualizationLoop = this.startVisualizationLoop.bind(this);
		this.stopVisualizationLoop = this.stopVisualizationLoop.bind(this);
		this.visualizationLoop = this.visualizationLoop.bind(this);
	}
	shouldComponentUpdate(nextProps, nextState){
		if ((!this.props.audio && nextProps.audio) || this.props.audio.src !== nextProps.audio.src){
			return true;
		}

		return false
	}
	componentDidMount(){
		if (this.props.audio){
			this.startVisualizationLoop();
		}
	}
	componentDidUpdate(){
		console.log("Updated");
		if (this.props.audio){
			this.startVisualizationLoop();
		}
	}
	startVisualizationLoop() {
		if (this._frameId)
			return;

		if('webkitAudioContext' in window) {
			this.audioContext = new window.webkitAudioContext();
		} else {
			this.audioContext = new AudioContext();
		}

		if (this.props.audio.crossOrigin !== "anonymous")
			this.props.audio.crossOrigin = "anonymous";
		
		this.analyser = this.audioContext.createAnalyser();
		this.canvas = this.refs.analyzerCanvas;
		this.ctx = this.canvas.getContext('2d');
		this.audio = this.props.audio;
		this.audio.crossOrigin = "anonymous";
		this.audioSrc = this.audioContext.createMediaElementSource(this.audio);
		this.audioSrc.connect(this.analyser);
		this.audioSrc.connect(this.audioContext.destination);
		this.analyser.connect(this.audioContext.destination);

		if( !this._frameId ) {
			let fps = 30;
			let one_second = 1000;

			this.fpsInterval = one_second / fps;
			this.then = Date.now();
			this.startTime = this.then;
			this.visualizationLoop();
		}
	}
	stopVisualizationLoop(){
		window.cancelAnimationFrame( this._frameId );
	}
	visualizationLoop(){
		this._frameId = window.requestAnimationFrame( this.visualizationLoop );

		let now = Date.now();
		let elapsed = now - this.then;

		if (elapsed > this.fpsInterval){
			this.then = now - (elapsed % this.fpsInterval);

			// Drawing Code

			let freqData = new Uint8Array(this.analyser.frequencyBinCount)
			this.analyser.getByteFrequencyData(freqData)
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.ctx.fillStyle = this.props.mainColor;
			let bars = 200;
			for (var i = 0; i < bars; i++) {
				let bar_x = i * 3;
				let bar_width = 3;
				let bar_height = -(freqData[i] / 2);
				this.ctx.fillRect(bar_x, this.canvas.height, bar_width, bar_height)
			}
		}
	}
	render() {
		return (
			<canvas
				className="canvas-goo"
				ref="analyzerCanvas"
				id="analyzer"
				style={{width:"100%", height: "200px"}}
			>
			</canvas>
		)
	}
}


export default AudioVisualizer;