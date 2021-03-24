/**
 * Immitates download of the json file in order to save it
 * @param {Document} document - Global document
 * @param {object} obj - Object to be converted to json
 * @param {string} fileName - Name of the saved file
 */
export default function saveJsonFile(document, obj, fileName) {
  const fakeLink = document.createElement('a');

  const file = new File(
    [JSON.stringify(obj, null, 2)],
    fileName,
    { type: 'application/json' },
  );
  
  fakeLink.href = window.URL.createObjectURL(file);
  fakeLink.setAttribute('download', fileName);
  fakeLink.click();
}