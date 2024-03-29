import HashCanvas from "$lib/HashCanvas.svelte";
import WebGL2Renderer from "$lib/render/webgl2/webgl2.js";
import WebGPURenderer from "$lib/render/webgpu/webgpu.js";

export default HashCanvas
export { WebGL2Renderer, WebGPURenderer }
export type Renderer = WebGL2Renderer | WebGPURenderer;
