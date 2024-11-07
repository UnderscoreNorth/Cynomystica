<script lang="ts">
	import { getRandomInt } from '$lib/utilities/getRandomInt';
	import { getRandomFloat } from '$lib/utilities/getRandomFloat';
	import { effectStore } from '$lib/special/EffectStore';
	import { onMount } from 'svelte';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		let snow_level = $effectStore['Snow'].arg_1 as
			| 'low'
			| 'dust'
			| 'light'
			| 'medium'
			| 'normal'
			| 'high'
			| 'blizzard'
			| 'prime95'
			| 'space_heater'
			| 'whiteout'
			| 'danger'
			| 'bigdanger'
			| 'canada';
		const snow_levels = {
			// The rate at which snow falls. High numbers means less snow

			// Low levels. Multiple aliases
			low: { min: 12500, max: 20000 },
			dust: { min: 12500, max: 20000 },
			light: { min: 12500, max: 20000 },

			// Medium or normal aliases
			medium: { min: 3000, max: 7500 },
			normal: { min: 3000, max: 7500 },

			high: { min: 1000, max: 3500 },
			blizzard: { min: 500, max: 5000 },
			prime95: { min: 75, max: 900 },
			space_heater: { min: 30, max: 400 },
			whiteout: { min: 15, max: 50 },

			danger: { min: 5, max: 10 },
			bigdanger: { min: 3, max: 5 },
			canada: { min: 2, max: 2 }
		};
		if (snow_levels[snow_level] == undefined) snow_level = 'medium';
		let _program = null;

		// gl vars
		let _a_position: GLuint;
		let _u_resolution: WebGLUniformLocation | null;

		let _width = window.innerWidth;
		let _height = window.innerHeight;
		type SnowFlake = {
			x: number;
			y: number;
			size: any;
			velocity: {
				x: any;
				y: any;
			};
		};
		let _snowflakes: Array<SnowFlake> = [];
		let _requested_animation_frame: number;

		let _vertex_buffer: WebGLBuffer | null;
		let pixels_per_flake_min = 500;
		let pixels_per_flake_max = 5000;
		let max_size = 10;
		let min_size = 3;
		let min_x_speed = 0.5;
		let max_x_speed = 3;
		let min_y_speed = 1;
		let max_y_speed = 4;

		let vertex_shader_src = `
      attribute vec2 a_position;
      uniform vec2 u_resolution;
  
      void main() {
          // convert the position from pixels to 0.0 to 1.0
          // convert from 0->1 to 0->2
          vec2 zero_to_two = (a_position / u_resolution) * 2.0;
  
          // convert from 0->2 to -1->+1 (clip space)
          vec2 clip_space = zero_to_two - 1.0;
  
          gl_Position = vec4(clip_space.x, -clip_space.y, 0, 1);
      }
  `;
		let fragment_shader_src = `
      precision mediump float;
  
      void main() {
          gl_FragColor = vec4(1, 1, 1, 0.8);
      }
  `;
		let TRIANGLES_PER_PX_WIDTH = 10 / 10;

		let _gl = canvas.getContext('webgl') as WebGLRenderingContext;
		_gl.enable(_gl.BLEND);
		_gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA);

		buildSnowAndUseProgram();

		// 0 timeout to allow the CSSOM to update the size of the canvas appropriately
		setTimeout(() => initAndReset(), 0);

		// If the window resizes, just start all over again for simplicity
		let _resizeHandler = () => initAndReset();
		window.addEventListener('resize', _resizeHandler);

		function buildSnowAndUseProgram() {
			// setup GLSL program
			let _program = buildGlProgram(_gl, vertex_shader_src, fragment_shader_src);
			_gl.useProgram(_program);
			if (_program !== null) {
				_a_position = _gl.getAttribLocation(_program, 'a_position');
				_u_resolution = _gl.getUniformLocation(_program, 'u_resolution');
			}
			_vertex_buffer = _gl.createBuffer();
		}
		function buildGlProgram(
			gl: WebGLRenderingContext,
			vertex_shader_src: string,
			fragment_shader_src: string
		) {
			const v_shader = addGlShader(gl, vertex_shader_src, gl.VERTEX_SHADER);
			const f_shader = addGlShader(gl, fragment_shader_src, gl.FRAGMENT_SHADER);
			if (!v_shader || !f_shader) {
				return null;
			}

			const program = gl.createProgram() as WebGLProgram;
			gl.attachShader(program, v_shader);
			gl.attachShader(program, f_shader);

			gl.linkProgram(program);
			return program;
		}

		function addGlShader(gl: WebGLRenderingContext, shader_source: string, type: GLenum) {
			const shader = gl.createShader(type);
			if (shader == null) return null;
			gl.shaderSource(shader, shader_source);
			gl.compileShader(shader);

			// Check the compile status
			const did_compile = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
			if (!did_compile) {
				const lastError = gl.getShaderInfoLog(shader);
				console.error(`Error compiling shader: ${lastError}`);
				gl.deleteShader(shader);
				return null;
			}

			return shader;
		}

		function initAndReset() {
			_width = canvas.width = window.innerWidth;
			_height = canvas.height = window.innerHeight;
			_gl.viewport(0, 0, _width, _height);
			_gl.uniform2f(_u_resolution, _width, _height);

			_snowflakes = [];

			if (!_requested_animation_frame) {
				_requested_animation_frame = requestAnimationFrame(() => handleFrame());
			}
		}

		function handleFrame() {
			if (!_gl) {
				return;
			}

			_gl.clearColor(0, 0, 0, 0);
			_gl.clear(_gl.COLOR_BUFFER_BIT);

			// Add new snowflakes
			const min_new = _width / snow_levels[snow_level].max;
			const max_new = _width / snow_levels[snow_level].min;
			const number_of_new_flakes = getRandomInt(min_new, max_new);
			for (let i = 0; i < number_of_new_flakes; i++) {
				_snowflakes.push(createSnowflake());
			}

			// Move all the flakes and get their vertices
			const all_vertices = [];
			for (const snowflake of _snowflakes) {
				snowflake.x += snowflake.velocity.x;
				snowflake.y += snowflake.velocity.y;

				all_vertices.push(...buildCircleVertices(snowflake.x, snowflake.y, snowflake.size));
			}
			drawSnowTriangles(all_vertices);

			// Remove particles below the screen
			_snowflakes = _snowflakes.filter((snowflake) => {
				const top_y = snowflake.y + snowflake.size / 2;
				if (top_y > _height) {
					return false;
				}

				const top_x = snowflake.x - snowflake.size / 2;
				if (top_x > _width) {
					return false;
				}

				return true;
			});

			_requested_animation_frame = requestAnimationFrame(() => handleFrame());
		}

		function buildCircleVertices(cx: number, cy: number, radius: number) {
			const vertices = [];
			let total_triangles = Math.max(Math.floor(TRIANGLES_PER_PX_WIDTH * radius), 5);
			if (radius <= 1) {
				total_triangles = 3;
			} else if (radius <= 2) {
				total_triangles = 4;
			}

			const pi_frac = (2 * Math.PI) / total_triangles;
			for (let i = 0; i < total_triangles; i++) {
				vertices.push(cx, cy);
				vertices.push(Math.cos(i * pi_frac) * radius + cx, Math.sin(i * pi_frac) * radius + cy);
				vertices.push(
					Math.cos((i + 1) * pi_frac) * radius + cx,
					Math.sin((i + 1) * pi_frac) * radius + cy
				);
			}

			return vertices;
		}

		function drawSnowTriangles(snow_vertices: number[]) {
			// Put the snow vertices in the vertex buffer
			_gl.bindBuffer(_gl.ARRAY_BUFFER, _vertex_buffer);
			_gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(snow_vertices), _gl.STATIC_DRAW);

			// Load the vertices into a_position
			{
				const size = 2;
				const type = _gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				_gl.bindBuffer(_gl.ARRAY_BUFFER, _vertex_buffer);
				_gl.vertexAttribPointer(_a_position, size, type, normalize, stride, offset);
				_gl.enableVertexAttribArray(_a_position);
			}

			{
				const offset = 0;
				const vertex_total = snow_vertices.length / 2;
				_gl.drawArrays(_gl.TRIANGLES, offset, vertex_total);
			}
		}

		function createSnowflake() {
			const x = Math.random() * _width;
			const size = getRandomFloat(min_size / 2, max_size / 2);

			let x_vel = getRandomFloat(min_x_speed, max_x_speed);
			if (Math.random() > 0.5) {
				x_vel = -x_vel;
			}

			return {
				x,
				y: -size,
				size,
				velocity: {
					x: x_vel,
					y: getRandomFloat(min_y_speed, max_y_speed)
				}
			};
		}

		function isSnowflakeOffscreen(snowflake: SnowFlake) {
			const top_y = snowflake.y + snowflake.size / 2;
			if (top_y > _height) {
				return false;
			}

			const top_x = snowflake.x - snowflake.size / 2;
			if (top_x > _width) {
				return false;
			}
		}
	});
</script>

<div style:z-index={9} style:position="absolute" style:top="0" style:left="0">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		pointer-events: none;
		z-index: 1000000;
	}
</style>
