function getPositionAtCenter (element) {
  const { top, left, width, height } = element.getBoundingClientRect()

  return {
    x: left + width / 2,
    y: top + height / 2
  }
}

function getDistanceBetweenElements (a, b) {
  const aPosition = getPositionAtCenter(a)
  const bPosition = getPositionAtCenter(b)

  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y)
}

export { getDistanceBetweenElements }
