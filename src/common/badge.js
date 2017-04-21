function calculateWidth(text, font, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  return ctx.measureText(text).width;
}

function fitText(text, { canvas, start, padding, style }) {
  let iteration = start;
  while (
    calculateWidth(text, style(iteration), canvas) >
    canvas.width - padding
  ) {
    iteration -= 2;
    if (iteration <= 8) break;
  }
  return [
    calculateWidth(text, style(iteration), canvas),
    iteration,
    style(iteration)
  ];
}

export default function renderBadge(
  { firstName, lastName, type, badge },
  canvas
) {
  // const canvas = document.createElement('canvas');
  canvas.width = badge.width;
  canvas.height = badge.height;

  //Print first name
  (() => {
    if (!firstName) return;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let fontHeight = 0;
    let size = 90;
    const padding = 5;
    [width, fontHeight, ctx.font] = fitText(firstName, {
      canvas,
      padding,
      start: size,
      style: size => `600 ${size}px Helvetica Neue`
    });
    ctx.fillText(
      firstName,
      (canvas.width - width) / 2 - padding / 2,
      canvas.height / 2 + fontHeight / 4 - 25
    );
  })();

  //Print last name
  (() => {
    if (!lastName) return;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let fontHeight = 0;
    let size = 40;
    const padding = 5;
    [width, fontHeight, ctx.font] = fitText(lastName, {
      canvas,
      padding,
      start: size,
      style: size => `200 ${size}px Helvetica Neue`
    });
    ctx.fillText(
      lastName,
      (canvas.width - width) / 2 - padding / 2,
      canvas.height / 2 + fontHeight / 2 + 20
    );
  })();

  //Print Type
  (() => {
    if (!type) return;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let fontHeight = 0;
    let size = 20;
    const padding = 5;
    [width, fontHeight, ctx.font] = fitText(type, {
      canvas,
      padding,
      start: size,
      style: size => `200 ${size}px Helvetica Neue`
    });
    ctx.fillText(
      type,
      canvas.width - width - padding / 2,
      canvas.height - fontHeight / 2
    );
  })();

  return canvas;
}

// const badge = renderBadge({
//     firstName: "Daniel",
//     lastName: "Cousineau",
//     type: "Organizer",
//     badge: {
//         width: 300,
//         height: 150
//     }
// });
