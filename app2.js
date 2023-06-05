;(async function app2() {
    const n = 161

    const m = 13

    const FPS = 24

    const canvas = document.getElementById('movieClip')

    const ctx = canvas.getContext('2d')

    const image = new Image()

    await new Promise((resolve, reject) => {
        image.addEventListener('load', () => void resolve())

        image.addEventListener('error', () => void reject())

        image.src = './FramesOG.png'
    })

    let startedAt = undefined

    let lastFrameNo = undefined

    const w = image.width

    const h = image.height

    const cw = canvas.width

    const ch = canvas.height

    function onTick(time) {
        if (startedAt == null) {
            startedAt = time
        }

        const f = n - 1 - (Math.floor((time - startedAt) / (1000 / FPS)) % n)

        if (f !== lastFrameNo) {
            lastFrameNo = f

            ctx.clearRect(0, 0, cw, ch)

            ctx.drawImage(
                image,
                (f % m) * (w / m),
                Math.floor(f / m) * (h / m),
                w / m,
                h / m,
                0,
                0,
                cw,
                ch
            )
        }

        requestAnimationFrame(onTick)
    }

    requestAnimationFrame(onTick)
})()
