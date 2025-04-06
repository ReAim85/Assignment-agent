import { jsPDF } from "jspdf";

export const downloadpfd = async (screenshots) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;
  let y = margin;

  for (let i = 0; i < screenshots.length; i++) {
    const s = screenshots[i];

    const img = await new Promise((resolve) => {
      const image = new Image();
      image.src = s.base64?.screenshot;
      image.onload = () => resolve(image);
    });

    const imgAspectRation = img.width / img.height;
    const imageWidth = pageWidth - margin * 2;
    const imageHeight = imageWidth / imgAspectRation;

    if (y + imageHeight > pageHeight) {
      pdf.addPage();
      y = margin;
    }

    pdf.addImage(
      s.base64?.screenshot,
      "PNG",
      margin,
      y,
      imageWidth,
      imageHeight
    );
    y += imageHeight + margin;
  }
  pdf.save("screenshots.pdf");
};
