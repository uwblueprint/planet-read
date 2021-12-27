import { useLazyQuery } from "@apollo/client";
import { saveAs } from "file-saver";
import { File, GET_FILE } from "../APIClients/queries/FileQueries";

// Retrieved from: https://stackoverflow.com/a/16245768
const b64toBlob = (
  b64Data: string,
  contentType = "",
  sliceSize = 512,
): Blob => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

const getMIMETypeFromExtension = (ext: string) => {
  switch (ext) {
    case "txt":
      return "text/plain;charset=utf-8";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "jpeg":
      return "image/jpeg";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
};

/*
 * A hook that retrieves a file through GraphQL and downloads the file.
 *
 * @param id - The file id
 * @param filename - The filename to save as
 *
 * @returns downloadFile - A function used to download the file
 */
/* eslint-disable-next-line import/prefer-default-export */
export const useFileDownload = (id: number | null, filename: string) => {
  const [getFile] = useLazyQuery(GET_FILE, {
    variables: { id },
    onCompleted: (data: { fileById: File }) => {
      const { ext, file } = data.fileById;
      const blob = b64toBlob(file, getMIMETypeFromExtension(ext));
      saveAs(blob, `${filename}.${ext}`);
    },
  });

  const downloadFile = id ? getFile : () => {};
  return [downloadFile];
};
