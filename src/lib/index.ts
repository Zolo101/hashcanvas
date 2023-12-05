import HashCanvas from "$lib/HashCanvas.svelte";
import type WebGL2Renderer from "./render/webgl2/webgl2.js";
import type WebGPURenderer from "./render/webgpu/webgpu.js";

export default HashCanvas
export type Renderer = WebGL2Renderer | WebGPURenderer;
