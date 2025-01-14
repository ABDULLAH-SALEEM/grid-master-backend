import * as fs from "fs";
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || "{}")
  ),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

class FirebaseService {
  async downloadFile(
    fileUrl: string,
    filename: string
  ): Promise<NodeJS.ReadableStream> {
    const tempFilePath = `/tmp/${filename}`;
    const file = bucket.file(this.getFileName(fileUrl));

    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(tempFilePath);
      file
        .createReadStream()
        .pipe(writeStream)
        .on("finish", () => resolve(fs.createReadStream(tempFilePath)))
        .on("error", reject);
    });
  }

  private getFileName(fileUrl: string): string {
    const urlParts = fileUrl.split("/");
    return decodeURIComponent(urlParts[urlParts.length - 1].split("?")[0]);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    await bucket.file(this.getFileName(fileUrl)).delete();
  }
}

export default new FirebaseService();
