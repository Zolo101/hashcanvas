import moduleCode from "./module.wgsl?raw";

export default class WebGPURenderer {
    width: number
    height: number
    private readonly context: GPUCanvasContext
    private readonly device: GPUDevice

    private readonly tiles: Uint8ClampedArray
    private readonly screen: GPUTexture
    private readonly colours: GPUTexture // TODO: Does it have to be a texture?
    private readonly renderPassDescriptor: GPURenderPassDescriptor

    private readonly module: GPUShaderModule
    private readonly pipeline: GPURenderPipeline
    private readonly bindGroup: GPUBindGroup

    constructor(width: number, height: number, context: GPUCanvasContext, device: GPUDevice) {
        this.width = width
        this.height = height
        this.context = context
        this.device = device
        this.tiles = new Uint8ClampedArray(this.width * this.height)
        this.screen = this.device.createTexture({
            label: "screen",
            size: [this.width, this.height],
            format: "r8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        })
        this.colours = this.device.createTexture({
            label: "colours",
            dimension: "1d",
            size: [256], // support 256 colours
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        })
        this.renderPassDescriptor = {
            // @ts-ignore
            colorAttachments: [{
                // view: <- to be filled out when we render
                // view: this.context.getCurrentTexture().createView(),
                clearValue: [1.0, 1.0, 1.0, 1.0],
                loadOp: "clear",
                storeOp: "store",
            }]
        }

        const format = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({device: this.device, format})

        this.module = this.device.createShaderModule({
            code: moduleCode
        })

        this.pipeline = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: this.module,
                entryPoint: "vertexMain"
            },
            fragment: {
                module: this.module,
                entryPoint: "fragmentMain",
                targets: [{format}]
            }
        })

        const sampler = this.device.createSampler();

        this.bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: sampler},
                {binding: 1, resource: this.screen.createView()},
                {binding: 2, resource: this.colours.createView()},
            ]
        });

        // window.addEventListener("updateTileEvent", this.updateColours)
        requestAnimationFrame(() => this.render())
        console.log("WebGPU renderer initialised")
    }

    private createColourTexture() {
        return new Uint8ClampedArray(4 * 256)
    }

    updateColours(colours: RGBA[]) {
        // clear array and re-add colours
        const coloursBuffer = this.createColourTexture()
        coloursBuffer.set(colours.flat(), 0)

        this.device.queue.writeTexture(
            {texture: this.colours},
            coloursBuffer,
            {bytesPerRow: 4 * 256},
            [256]
        )
        this.render()
    }

    updateTiles(tiles: ArrayLike<number>) {
        this.tiles.set(tiles, 0)
        this.render()
    }

    render() {
        //@ts-ignore
        this.renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();

        this.device.queue.writeTexture(
            {texture: this.screen},
            this.tiles,
            {bytesPerRow: this.width},
            [this.width, this.height]
        )

        const encoder = this.device.createCommandEncoder();
        const pass = encoder.beginRenderPass(this.renderPassDescriptor);
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroup);

        pass.draw(3);
        pass.end();

        const commandBuffer = encoder.finish();
        this.device.queue.submit([commandBuffer]);
    }
}