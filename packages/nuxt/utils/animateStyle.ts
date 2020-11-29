const animateStyle = function (
  styleObject: any,
  initialValue: number,
  desiredValue: number,
  step: number,
  style: string,
  unit: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (
      (step < 0 && initialValue < desiredValue) ||
      (step > 0 && initialValue > desiredValue) ||
      step === 0
    ) {
      reject(new Error('Invalid inputs, animateStyle will run forever.'));
    }

    styleObject[style] = `${initialValue}${unit}`;

    const animate = function () {
      initialValue += step;

      if (desiredValue > initialValue && step > 0) {
        styleObject[style] = `${initialValue}${unit}`;
        window.requestAnimationFrame(animate);
      } else if (desiredValue < initialValue && step < 0) {
        styleObject[style] = `${initialValue}${unit}`;
        window.requestAnimationFrame(animate);
      } else {
        styleObject[style] = `${desiredValue}${unit}`;
        resolve();
      }
    };

    window.requestAnimationFrame(animate);
  });
};

export default animateStyle;
