const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;

document.getElementById("k").addEventListener("input", input_k);
document.getElementById("dk").addEventListener("input", input_dk);
document.getElementById("w").addEventListener("input", input_w);
document.getElementById("dw").addEventListener("input", input_dw);

// https://en.wikipedia.org/wiki/Phase_velocity
// https://en.wikipedia.org/wiki/Group_velocity

class Wave {
    constructor(a, k, dk, w, dw) {
	this.a = a;
	this.k = k;
	this.dk = dk;
	this.w = w;
	this.dw = dw;

	this.phase_v = this.dw/this.dk;
	this.group_v = this.w/this.k;
    }

    draw(time) {
	ctx.beginPath();
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 3;
	ctx.moveTo(0, this.y_offset);

	let resolution = 0.5;
	for(let x = 0; x < canvas.width; x += resolution) {
	    let val = 
		this.a*Math.cos((this.k - this.dk)*x - (this.w - this.dw)*time) + 
		this.a*Math.cos((this.k + this.dk)*x - (this.w + this.dw)*time);
	    ctx.lineTo(x, val + this.y_offset);
	}

	ctx.stroke();
    }

    draw_markers(time) {
	let width = 4;

	ctx.fillStyle = "red";
	ctx.fillRect(mod(this.phase_v*time, canvas.width), this.y_offset - 2*this.a, width, 4*this.a);

	ctx.fillStyle = "yellow";
	ctx.fillRect(mod(this.group_v*time, canvas.width), this.y_offset - 2*this.a, width, 4*this.a);
    }
}

let k_min = -0.02, k_max = 0.02;
let dk_min = -0.20, dk_max = 0.20;
let w_min = -0.004, w_max = 0.004;
let dw_min = -0.03, dw_max = 0.03;

let waves = [];
for(let i = 0; i <= 7; ++i) {
    waves.push(
	new Wave(
	    30,
	    random(k_min, k_max),
	    random(dk_min, dk_max),
	    random(w_min, w_max),
	    random(dw_min, dw_max)
	)
    );
}

let y_spacing = 10;
let y_offset = y_spacing;
for(let wave of waves) {
    wave.y_offset = y_offset + 2*wave.a;
    y_offset += 4*wave.a + y_spacing;
}

canvas.height = y_offset;

let t_start = new Date().getTime();
window.requestAnimationFrame(draw_all);

function input_k(event) {
    let value = map(event.target.value, event.target.min, event.target.max, k_min, k_max);
    let new_wave = new Wave(waves[0].a, value, waves[0].dk, waves[0].w, waves[0].dw);
    new_wave.y_offset = waves[0].y_offset;
    waves[0] = new_wave;
}

function input_dk(event) {
    let value = map(event.target.value, event.target.min, event.target.max, dk_min, dk_max);
    let new_wave = new Wave(waves[0].a, waves[0].k , value, waves[0].w, waves[0].dw);
    new_wave.y_offset = waves[0].y_offset;
    waves[0] = new_wave;
}

function input_w(event) {
    let value = map(event.target.value, event.target.min, event.target.max, w_min, w_max);
    let new_wave = new Wave(waves[0].a, waves[0].k , waves[0].dk, value, waves[0].dw);
    new_wave.y_offset = waves[0].y_offset;
    waves[0] = new_wave;
}

function input_dw(event) {
    let value = map(event.target.value, event.target.min, event.target.max, dw_min, dw_max);
    let new_wave = new Wave(waves[0].a, waves[0].k , waves[0].dk, waves[0].w, value);
    new_wave.y_offset = waves[0].y_offset;
    waves[0] = new_wave;
}

function draw_all() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let time = new Date().getTime() - t_start;
    for(let wave of waves) {
	wave.draw(time);
	wave.draw_markers(time);
    }

    window.requestAnimationFrame(draw_all);
}

function mod(x, m) {
    return (x%m + m)%m;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function map(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
