import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, initializeApp } from 'firebase/app' 
import * as admin from 'firebase-admin'
@Injectable()
export class FirebaseService {
    public fb: FirebaseApp
    private readonly storage: admin.storage.Storage;
    constructor(
        private configService: ConfigService
    ){
      const credentials = JSON.parse(this.configService.get<string>('FIREBASE_CREDENTIALS'));
        admin.initializeApp({
            credential: admin.credential.cert(credentials),
            storageBucket: configService.get<string>('storageBucket')
        })
        this.storage = admin.storage();
    }

    async uploadFile(name: string, file: Express.Multer.File): Promise<string> {
        const bucket = admin.storage().bucket();
        const fileName = name;
        const fileUpload = bucket.file(fileName);

        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        return new Promise((resolve, reject) => {
          blobStream.on('error', (error) => reject(error));
          blobStream.on('finish', async () => { 
            await fileUpload.makePublic();
            const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`
            resolve(url);
          });
          blobStream.end(file.buffer);
        });
    }
}
