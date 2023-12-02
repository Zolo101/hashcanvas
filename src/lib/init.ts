import Renderer from "$lib/render/webgl2/webgl2.js";
import WebGPURenderer from "$lib/render/webgpu/webgpu.js";

export default async function init(width: number, height: number, gl2_2D: WebGL2RenderingContext | null, glw_2D: GPUCanvasContext | null): Promise<Renderer | WebGPURenderer> {
    // console.log("webgl2:", !!gl2_2D, "webgpu:", !!glw_2D)
    if (glw_2D) {
        const adapter = await navigator.gpu?.requestAdapter();
        if (!adapter) throw new Error("WebGPU is not supported")

        const device = await adapter?.requestDevice();
        if (!device) throw new Error("WebGPU is not supported")

        return new WebGPURenderer(width, height, glw_2D, device);
    }

    if (gl2_2D) {
        return new Renderer(width, height, gl2_2D);
    }

    alert("No WebGL2 or WebGPU support!")
    throw new Error("No WebGL2 or WebGPU support!")
}
