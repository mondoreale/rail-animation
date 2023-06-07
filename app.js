;(async function app() {
    const n = 161

    const FPS = 20

    const canvas = document.getElementById('movieClip')

    const ctx = canvas.getContext('2d')

    function getImage(index) {
        return new Promise((resolve, reject) => {
            const image = new Image()

            image.addEventListener('load', () => void resolve(image))

            image.addEventListener('error', () => void reject())

            image.src = `./frames/2023 Rail Header Image-v3Comped-Frame-${`000${index}`.slice(
                -3
            )}.png`
        })
    }

    let startedAt = undefined

    let lastFrameNo = undefined

    const cw = canvas.width

    const ch = canvas.height

    const firstImage = await getImage(0)

    ctx.clearRect(0, 0, cw, ch)

    ctx.drawImage(firstImage, 0, 0, cw, ch)

    const images = await Promise.all([...Array(n)].map((_, i) => getImage(i)))

    function onTick(time) {
        if (startedAt == null) {
            startedAt = time
        }

        const f = Math.floor((time - startedAt) / (1000 / FPS)) % n

        if (f !== lastFrameNo) {
            lastFrameNo = f

            ctx.clearRect(0, 0, cw, ch)

            ctx.drawImage(images[f], 0, 0, cw, ch)
        }

        requestAnimationFrame(onTick)
    }

    requestAnimationFrame(onTick)
})()
