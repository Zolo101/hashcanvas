<script>
    import HashCanvas from "$lib/HashCanvas.svelte";

    const [width, height] = [400, 400]
    const randomTiles = () => {
        const tiles = new Array(width * height).fill(0)
        return tiles.map(() => ~~(Math.random() * 255))
    }
    const gradientColours = () => {
        const tiles = new Array(255 * 4)
        for (let i = 0; i < tiles.length; i += 4) {
            tiles[i] = i / 4
            tiles[i + 1] = i / 4
            tiles[i + 2] = i / 4
            tiles[i + 3] = 255
        }
        return tiles
    }

    const onCreation = (renderer, canvas) => {
        renderer.updateTiles(randomTiles())
        renderer.updateColours(gradientColours())
    }
</script>

<HashCanvas {width} {height} {onCreation}/>