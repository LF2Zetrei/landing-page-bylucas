'use client';
import { useEffect, useRef, ReactNode } from 'react';

type MetaballBackgroundProps = {
  children?: ReactNode;
  speed?: number;
  bgColor?: string;
  gradientColor?: string;
};

type Metaball = { x: number; y: number; vx: number; vy: number; r: number };

export default function MetaballBackground({
  children = null,
  speed = 3,
  bgColor = '0.0, 0.0, 0.0',
  gradientColor = 'x / WIDTH, y / HEIGHT, 1.0',
}: MetaballBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number | undefined;
    const metaballs: Metaball[] = [];
    let currentProgram: WebGLProgram | null = null;
    let currentBuffer: WebGLBuffer | null = null;
    let currentShaders: WebGLShader[] = [];

    const init = () => {
      const width = (canvas.width = canvas.offsetWidth);
      const height = (canvas.height = canvas.offsetHeight);

      const gl = canvas.getContext('webgl');
      if (!gl) return;

      if (currentProgram) {
        currentShaders.forEach((s) => gl.deleteShader(s));
        gl.deleteProgram(currentProgram);
      }
      if (currentBuffer) {
        gl.deleteBuffer(currentBuffer);
      }

      const numMetaballs = 30;

      // Garde les metaballs existantes si déjà initialisées, sinon crée
      if (metaballs.length === 0) {
        for (let i = 0; i < numMetaballs; i++) {
          const radius = Math.random() * 60 + 10;
          metaballs.push({
            x: Math.random() * (width - 2 * radius) + radius,
            y: Math.random() * (height - 2 * radius) + radius,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed,
            r: radius * 0.75,
          });
        }
      }

      const vertexShaderSrc = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fragmentShaderSrc = `
        precision highp float;
        const float WIDTH = ${width >> 0}.0;
        const float HEIGHT = ${height >> 0}.0;
        uniform vec3 metaballs[${numMetaballs}];

        void main(){
          float x = gl_FragCoord.x;
          float y = gl_FragCoord.y;
          float sum = 0.0;

          for (int i = 0; i < ${numMetaballs}; i++) {
            vec3 metaball = metaballs[i];
            float dx = metaball.x - x;
            float dy = metaball.y - y;
            float radius = metaball.z;
            sum += (radius * radius) / (dx * dx + dy * dy);
          }

          if (sum >= 0.99) {
            gl_FragColor = vec4(
              mix(
                vec3(${gradientColor}),
                vec3(${bgColor}),
                max(0.0, 1.0 - (sum - 0.99) * 100.0)
              ), 1.0);
            return;
          }

          gl_FragColor = vec4(${bgColor}, 1.0);
        }
      `;

      const compileShader = (src: string, type: number): WebGLShader => {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        return shader;
      };

      const vertexShader = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
      const fragmentShader = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

      const program = gl.createProgram()!;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.useProgram(program);

      currentShaders = [vertexShader, fragmentShader];
      currentProgram = program;

      const vertexData = new Float32Array([-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0]);
      const vertexDataBuffer = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

      currentBuffer = vertexDataBuffer;

      const positionHandle = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(positionHandle);
      gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

      const metaballsHandle = gl.getUniformLocation(program, 'metaballs');

      // Stop previous loop
      if (animId) cancelAnimationFrame(animId);

      gl.viewport(0, 0, width, height);

      const loop = () => {
        for (let i = 0; i < numMetaballs; i++) {
          const mb = metaballs[i];
          mb.x += mb.vx;
          mb.y += mb.vy;
          if (mb.x < mb.r || mb.x > width - mb.r) mb.vx *= -1;
          if (mb.y < mb.r || mb.y > height - mb.r) mb.vy *= -1;
        }

        const data = new Float32Array(3 * numMetaballs);
        for (let i = 0; i < numMetaballs; i++) {
          data[3 * i + 0] = metaballs[i].x;
          data[3 * i + 1] = metaballs[i].y;
          data[3 * i + 2] = metaballs[i].r;
        }

        gl.uniform3fv(metaballsHandle, data);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animId = requestAnimationFrame(loop);
      };

      loop();
    };

    init();

    // Resize — on debounce pour ne pas recompiler 100x/sec
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        init();
      }, 150); // ← attend 150ms après le dernier resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [speed, bgColor, gradientColor]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}