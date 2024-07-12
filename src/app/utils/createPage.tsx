import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

export default async function createPdf() {
    const page1 = PDFPage
        .create()
        .setMediaBox(200, 200)
        .drawText('You can add text and rectangles to the PDF!', {
            x: 5,
            y: 235,
            color: '#007386',
        })
        .drawRectangle({
            x: 25,
            y: 25,
            width: 150,
            height: 150,
            color: '#FF99CC',
        })
        .drawRectangle({
            x: 75,
            y: 75,
            width: 50,
            height: 50,
            color: '#99FFCC',
        });

    const pages = [page1]
    // Create a new PDF in your app's private Documents directory
    const docsDir = PDFLib.getDocumentsDirectory();
    const pdfPath = `${docsDir}/sample.pdf`;
    PDFDocument
        .create(pdfPath)
        .addPages(pages)
        .write() // Returns a promise that resolves with the PDF's path
        .then(path => {
            console.log('PDF created at: ' + path);
            // Do stuff with your shiny new PDF!
        });
    return
}