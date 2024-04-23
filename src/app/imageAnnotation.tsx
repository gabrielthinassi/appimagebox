'use client'
import { Button } from '@/components/ui/button'
import { type MouseEvent, useState } from 'react'
import { PlusCircledIcon, MinusCircledIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface Box {
  startX: number
  startY: number
  width: number
  height: number
}

interface Props {
  imageUrl: string
}

const ImageAnnotation: React.FC<Props> = ({ imageUrl }) => {
  const [drawing, setDrawing] = useState(false)
  const [startX, setStartX] = useState<number | null>(null)
  const [startY, setStartY] = useState<number | null>(null)
  const [endX, setEndX] = useState<number | null>(null)
  const [endY, setEndY] = useState<number | null>(null)
  const [boxes, setBoxes] = useState<Box[]>([
    {
      startX: 370,
      startY: 193,
      width: 94,
      height: 37,
    },
    {
      startX: 553,
      startY: 268,
      width: 88,
      height: 39,
    },
  ])

  const handleMouseDown = (event: MouseEvent<HTMLImageElement>) => {
    event.preventDefault()
    const { offsetX, offsetY } = event.nativeEvent
    setDrawing(true)
    setStartX(offsetX)
    setStartY(offsetY)
    setEndX(offsetX)
    setEndY(offsetY)
  }

  const handleMouseMove = (event: MouseEvent<HTMLImageElement>) => {
    if (drawing) {
      const { offsetX, offsetY } = event.nativeEvent
      setEndX(offsetX)
      setEndY(offsetY)
    }
  }

  const handleMouseUp = () => {
    if (
      drawing &&
      startX !== null &&
      startY !== null &&
      endX !== null &&
      endY !== null
    ) {
      const newBox: Box = {
        startX: Math.min(startX, endX),
        startY: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
      }
      setDrawing(false)
      setBoxes([...boxes, newBox])
    }
    console.log('Bounding-Boxes: ', boxes)
  }

  return (
    <div>
      <div className="flex space-x-2 p-2">
        <div>
          <Button variant="outline" size="icon">
            <PlusCircledIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MinusCircledIcon className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-2">
              {boxes.map((box) => (
                <Badge key={box.startX}>
                  {'X: ' +
                    box.startX +
                    ' | H: ' +
                    box.height +
                    ' | Y: ' +
                    box.startY +
                    ' | W: ' +
                    box.width}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={imageUrl}
          alt="Imagem"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        {boxes.map((box, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: box.startX,
              top: box.startY,
              width: box.width,
              height: box.height,
              border: '2px solid red',
              pointerEvents: 'none', // Evita que os quadrados interceptem eventos de mouse
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageAnnotation
