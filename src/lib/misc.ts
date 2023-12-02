export const isWebGL2Supported = () => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    return !!gl;
}

export const isWebGPUSupported = () => !!navigator.gpu;