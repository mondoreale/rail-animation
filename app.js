function movieClip({ canvas, numberOfFrames, filepathFn, fps = 20 } = {}) {
    if (!canvas) {
        throw new Error('Canvas element is missing')
    }

    if (numberOfFrames == null || numberOfFrames < 0) {
        throw new Error('Invalid number of frames')
    }

    const ctx = canvas.getContext('2d')

    ctx.imageSmoothingEnabled = false

    function getFilePathname(frameNo) {
        if (typeof filepathFn === 'function') {
            return filepathFn(frameNo)
        }

        return `./frames/${frameNo}.png`
    }

    function getImage(index) {
        return new Promise((resolve, reject) => {
            const image = new Image()

            image.addEventListener('load', () => void resolve(image))

            image.addEventListener('error', () => void reject())

            image.src = getFilePathname(index)
        })
    }

    let frameRequest = undefined

    let playbackId = {}

    function discard() {
        cancelAnimationFrame(frameRequest)

        frameRequest = undefined

        playbackId = {}
    }

    function draw(image) {
        const cw = canvas.clientWidth

        const ch = canvas.clientHeight

        canvas.width = cw

        canvas.height = ch

        ctx.clearRect(0, 0, cw, ch)

        ctx.drawImage(image, 0, 0, cw, ch)
    }

    return {
        async play() {
            if (frameRequest != null) {
                discard()
            }

            const currentPlaybackId = {}

            playbackId = currentPlaybackId

            let startedAt = undefined

            let lastFrameNo = undefined

            const firstImage = await getImage(0)

            if (currentPlaybackId !== playbackId) {
                return
            }

            draw(firstImage)

            const images = await Promise.all(
                [...Array(numberOfFrames)].map((_, i) => getImage(i))
            )

            if (currentPlaybackId !== playbackId) {
                return
            }

            function onTick(time) {
                if (startedAt == null) {
                    startedAt = time
                }

                const f =
                    Math.floor((time - startedAt) / (1000 / fps)) %
                    numberOfFrames

                if (f !== lastFrameNo) {
                    lastFrameNo = f

                    draw(images[f])
                }

                frameRequest = requestAnimationFrame(onTick)
            }

            frameRequest = requestAnimationFrame(onTick)
        },

        discard,
    }
}

;(async function app() {
    const picker = document.getElementById('bgPicker')

    picker.addEventListener('input', (e) => {
        document.body.style.backgroundColor = e.target.value
    })

    function getFilePathname(frameNo) {
        return `./frames/2023 Rail Header Image-v3Comped-Frame-${`000${frameNo}`.slice(
            -3
        )}.png`
    }

    movieClip({
        canvas: document.getElementById('movieClip1'),
        numberOfFrames: 161,
        filepathFn: getFilePathname,
    }).play()
})()
