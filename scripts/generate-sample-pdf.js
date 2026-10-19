const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createSampleColoringBook() {
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesNormal = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Cover Page
  const coverPage = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = coverPage.getSize();

  // Background tint
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.97, 0.95),
  });

  // Border
  coverPage.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: height - 50,
    borderColor: rgb(0.17, 0.18, 0.26),
    borderWidth: 2,
  });

  coverPage.drawText('MANDALA STUDIO', {
    x: width / 2 - 130,
    y: height - 120,
    size: 26,
    font: timesRoman,
    color: rgb(0.17, 0.18, 0.26),
  });

  coverPage.drawText('The Serenity Collection', {
    x: width / 2 - 145,
    y: height - 160,
    size: 24,
    font: timesNormal,
    color: rgb(0.54, 0.49, 0.78),
  });

  coverPage.drawText('20 Ready-to-Print Meditative & Sacred Geometry Coloring Pages', {
    x: width / 2 - 180,
    y: height - 190,
    size: 12,
    font: helvetica,
    color: rgb(0.35, 0.35, 0.35),
  });

  coverPage.drawText('Relaxation • Mindfulness • Artistic Expression', {
    x: width / 2 - 120,
    y: 60,
    size: 11,
    font: helvetica,
    color: rgb(0.42, 0.56, 0.5),
  });

  // Pages with mandalas
  const sampleTitles = [
    'Lotus Blossom Harmony',
    'Sacred Sri Yantra Echo',
    'Celestial Sun & Moon',
    'Zen Circle of Calm',
    'Cosmic Kaleidoscope',
    'Kaleidoscopic Radial Balance'
  ];

  for (let i = 0; i < sampleTitles.length; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]);
    
    // Page border
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: rgb(0.85, 0.85, 0.85),
      borderWidth: 1,
    });

    page.drawText(sampleTitles[i], {
      x: 50,
      y: height - 65,
      size: 16,
      font: timesRoman,
      color: rgb(0.17, 0.18, 0.26),
    });

    page.drawText('Mandala Studio • Printable Digital Edition', {
      x: width - 230,
      y: height - 65,
      size: 9,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    });

    // Decorative center circle placeholder for coloring
    page.drawCircle({
      x: width / 2,
      y: height / 2,
      size: 180,
      borderColor: rgb(0.2, 0.2, 0.2),
      borderWidth: 2,
    });
    page.drawCircle({
      x: width / 2,
      y: height / 2,
      size: 120,
      borderColor: rgb(0.2, 0.2, 0.2),
      borderWidth: 1.5,
    });
    page.drawCircle({
      x: width / 2,
      y: height / 2,
      size: 60,
      borderColor: rgb(0.2, 0.2, 0.2),
      borderWidth: 1,
    });

    page.drawText(`Page ${i + 1} of 20`, {
      x: width / 2 - 25,
      y: 45,
      size: 10,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, '..', 'storage', 'private', 'products', 'serenity-mandala-coloring-book.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Printable coloring book PDF generated at: ${outputPath}`);
}

createSampleColoringBook().catch(console.error);
