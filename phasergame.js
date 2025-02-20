// let width = 1000
// let height = width * window.innerHeight / window.innerWidth
let width = window.innerWidth
let height = window.innerWidth
let squareSize = width / 100
let cols = 100
let rows = Math.floor(height / squareSize) - 1
let colors = [
  0x000000,
  0xffffff,
  0xff0000,
  0x00ff00,
  0x0000ff,
]

class MainScene extends Phaser.Scene
{
  constructor()
  {
    super("MainScene")
  }

  create ()
  {
    let painting = false
    this.color = 0xff0000

    this.input.mouse.disableContextMenu();
    this.input.on("pointerdown", (pointer) =>
    {
      if (pointer.rightButtonDown())
      {
        let colorSelector = new ColorSelector(this, pointer.x, pointer.y)
        return
      }
      painting = true
    })
    this.input.on("pointerup", () =>
    {
      painting = false
    })

    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++)
      {
        let rect = this.add.rectangle(i * squareSize, j * squareSize, squareSize - 1, squareSize - 1, 0xffffff)
        rect.setOrigin(0, 0)

        rect.setInteractive()
        rect.on("pointerdown", () =>
        {
          rect.setFillStyle(this.color)
        })
        rect.on("pointerover", () =>
        {
          if (!painting) return
          rect.setFillStyle(this.color)
        })
      }
  }
}

const config = {
  width: width,
  height: height,
  backgroundColor: "#AAAAAA",
  parent: "phaser-game",
  scene: MainScene
}

let game = new Phaser.Game(config);

class ColorSelector extends Phaser.GameObjects.Container
{
  constructor(scene, x, y)
  {
    super(scene, x, y)
    this.scene = scene
    scene.add.existing(this)

    let l = squareSize * 3
    let w = (l + 4) * colors.length
    let h = l + 4

    let bgRectBorder = scene.add.rectangle(0, 0, w + 4, h + 4, 0xAAAAAA)
    let bgRect = this.scene.add.rectangle(0, 0, w, h, 0xffffff)


    this.add(bgRectBorder)
    this.add(bgRect)


    let colorRects = []
    for (let i = 0; i < colors.length; i++)
    {
      let x = (l + 4) * i - ((l + 4) * colors.length) / 2 + (l + 4) / 2
      let color = colors[i]
      let rect = scene.add.rectangle(x, 0, l, l, color)
      colorRects.push(rect)
      rect.setInteractive()

      rect.on("pointerdown", () =>
      {
        scene.color = color
        this.destroy()
      })
      this.add(rect)
    }

    bgRect.setInteractive()
    bgRect.on("pointerout", (pointer) =>
    {
      if (pointer.x - x < -w / 2
        | pointer.x - x > w / 2
        | pointer.y - y < -h / 2
        | pointer.y - y > h / 2)
        this.destroy()
    })
  }
}