;(async function app() {
    const n = 161

    const FPS = 24

    const canvas = document.getElementById('movieClip')

    const ctx = canvas.getContext('2d')

    const images = await Promise.all(
        [...Array(n)].map(
            (_, i) =>
                new Promise((resolve, reject) => {
                    const image = new Image()

                    image.addEventListener('load', () => void resolve(image))

                    image.addEventListener('error', () => void reject())

                    image.src = `./CompedFrames/2023 Rail Header Image-v3Comped-Frame-${`000${i}`.slice(
                        -3
                    )}.png`
                })
        )
    )

    let startedAt = undefined

    let lastFrameNo = undefined

    const w = images[0].width

    const h = images[0].height

    const cw = canvas.width

    const ch = canvas.height

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
