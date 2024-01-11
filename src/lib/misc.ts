export const isWebGL2Supported = () => {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2");
    return !!gl;
}

export const isWebGPUSupported = () => {
    const canvas = document.createElement("canvas")
    const hasWebGPUDevice = !!navigator.gpu;
    if (hasWebGPUDevice) {
        return !!canvas.getContext("webgpu");
    } else {
        return false;
    }
}