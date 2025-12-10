import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { PDFParse } from 'pdf-parse' // or the correct import path for your PDFparse library




async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

test('PDF file validate content', async ({ page }) => {
  // Navigate to the URL
  const parse= new PDFParse({url:'https://www.princexml.com/samples/invoice-colorful/invoicesample.pdf'});
  const result = await parse.getText();
  console.log(result.text);  
  // Use regex to capture an 8-digit invoice number followed by newline
  const invoiceRegex = /Invoice Number:\s*#(\d{8})/m;
  const match = result.text.match(invoiceRegex);
  expect(match).not.toBeNull();
  // exact expected value
  expect(match![1]).toBe('20130304');
});


test('Download PDF file and validate content', async ({ page }) => {
  // Navigate to the URL
  await page.goto('https://demo.automationtesting.in/FileDownload.html');
  // Trigger the download
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator("//a[@type='button']").first().click()
  ]);

  // Option A - save to disk then read into a Buffer (simpler)
  /* const downloadsDir = path.join(__dirname, '..', 'downloads');
  fs.mkdirSync(downloadsDir, { recursive: true });
  const filePath = path.join(downloadsDir, download.suggestedFilename());
  await download.saveAs(filePath);
  const pdfBuffer = fs.readFileSync(filePath);
  console.log('Buffer length (from disk):', pdfBuffer.length); */

  

  const stream = await download.createReadStream().then(stream =>{
    return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (err) => reject(err));
    });
  });

  const parse= new PDFParse({data:'stream'});
  const result = await parse.getText();
  // Use regex to capture an 8-digit invoice number followed by newline
  const invoiceRegex = /Invoice Number:\s*#(\d{8})/m;
  const match = result.text.match(invoiceRegex);
  expect(match![1]).toBe('20130304');
});

test('Download and save file with diagnostics', async ({ page}) => {
  await page.goto('https://demo.automationtesting.in/FileDownload.html');

  // Prepare download listener before clicking
  const downloadPromise = page.waitForEvent('download');

  // Trigger download (adjust selector to your button/link)
  await page.locator("//a[@type='button']").first().click();

  const download = await downloadPromise;
  console.log('download url:', download.url());
  console.log('suggestedFilename:', download.suggestedFilename());
  console.log('download failure (if any):', download.failure ? download.failure() : 'none');

  // Get Playwright's temporary path (useful to inspect what's actually downloaded)
  try {
    const tempPath = await download.path();
    console.log('temporary download path:', tempPath);
  } catch (e) {
    console.log('download.path() not available:', (e as Error).message);
  }

  // Save to an absolute path and verify
  const downloadsDir = path.resolve(process.cwd(), 'test-downloads');
  await ensureDir(downloadsDir);
  const filename = download.suggestedFilename() || `download-${Date.now()}.bin`;
  const target = path.join(downloadsDir, filename);

  try {
    await download.saveAs(target);
    console.log('Saved to:', target);
  } catch (err) {
    console.error('saveAs failed:', (err as Error).message);
    throw err;
  }

  // Verify file exists and has content
  expect(fs.existsSync(target)).toBeTruthy();
  const size = fs.statSync(target).size;
  console.log('saved file size:', size);
  expect(size).toBeGreaterThan(0);
});