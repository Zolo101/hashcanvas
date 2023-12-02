<script lang="ts">
    import { onMount } from "svelte";
    import { isWebGL2Supported, isWebGPUSupported } from "$lib/misc.js";
    import init from "$lib/init.js";
    import type Renderer from "$lib/render/webgl2/webgl2.js";
    import type WebGPURenderer from "$lib/render/webgpu/webgpu.js";

    export let width = 400;
    export let height = 400;

    export let onCreation: (renderer: Renderer | WebGPURenderer, canvas: HTMLCanvasElement) => void;

    let canvas: HTMLCanvasElement;
    let renderer: Renderer | WebGPURenderer;
    onMount(async () => {
        if (isWebGPUSupported()) {
            const glw = canvas.getContext("webgpu");
            renderer = await init(width, height, null, glw)
        } else if (isWebGL2Supported()) {
            const gl2 = canvas.getContext("webgl2");
            renderer = await init(width, height, gl2, null)
        } else {
            // TODO: Fallback to canvas
            throw new Error("WebGL2 is not supported")
        }
        onCreation(renderer, canvas)
    })
</script>

<canvas bind:this={canvas} {width} {height}></canvas>