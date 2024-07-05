

import dotenv from 'dotenv'
dotenv.config()
import admin from 'firebase-admin';
import { userNotifModel } from '../../../databases/models/userNotificaion.model.js';
import { missingmodel } from '../../../databases/models/missingreport.model.js';
import { sendNotifiEmail } from '../../emails/user.email.js';

const serviceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key:"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5c68my/RYnduo\n/1UkOlxddAPVwN4Pe5teFSnmBmpflqBOBsZE48JjSO/KEP2kYN3S82HIZrftPW1h\n8kXmGQDy/6kQMkjTeF6BfRTUH+1tmaZUNiE4OVNrIvjBJSjSRuilmfg9r4uBREbY\nnMm40fWjlxwrFJ3Y7wD6aVTaPD+L/nMftdwaCW3iDtr1FZoP/fF6PTsToI9yYAEo\n5yJkfQ00TFX+crRBsq+h84QStd++etLMsVDidr2+QbGhIzPgFFO8Rbo/JQ6bkzKH\nnsO1nFxYG8RrEvXeAi5FmGP8/lFslHhl2d7YzJoQJ06bIzn9y/SPSf00p/YP6rVX\nV4Pn8fwvAgMBAAECggEAPffdAB7IwE/HVZo0Tg2+TW/11BhFW3EXQoHZ5UYhh11i\npY/38o8Upm55ydCRoLrJhLLU6s0ACqMrCL6XAsM6IPiy+nmDAj7HfYdZTWR5xtS/\n0oXf5dSp/jPKYWfUUydkl+lyHNKq0AALmFgTw9FMvmRBAlg6QoHilspZky7soQ9K\n2wwLCTALNiVDCyGIMCfeI2k6uQ9xWaJK6TuOlqbTvG8m7eC4WQAqz914yXppym5B\n33lXIboaXs9DDZGPfJ19K99+Q2lawSqnqYZfMIn1HbbFmDBWXfo66Gz0+oAFOfhj\nxS16t+wFTeaqfVW3LD+9p/UGAtri4bVz5T3o8j07mQKBgQD/g3/eA0OV70Ia5IOG\nL/K5a/Hu04ZbMFyASllATeuU/qOHmHatagM7md48eZTiRQXo+6FUm2E26DoxEOJe\nrShNo8dbeF7ST7MvJEEgpIlbuSuGx5devjhbASG3u8VwYPfOznghgDu3K8uMTRKn\nrg++YbIH14NJ+gH/EKYlfp755QKBgQC5zgv0R0Ad2kTCBijmEMpk8Tp5bdH0dudP\n9rxFc3POs3sDG77EsSAotlrT5wpj4YVSlfqA+G5JuLoIsiWtHJshnBqbHB21yOgm\nyJDjsLMr7LCtsCHW5rvqW/lK5RTUiYGjXZhVUshOXAGZ1YPFVsAPCxybCVCzL6iD\n1lSeLcXsgwKBgQDJgAd/qu1KuYNVN+6tDPUK2yDQ6gkjsrDQD1HxT0HAn0uRLGAz\nA86G2yISaQNLqYkuofopgduZdGwns5wBc+a7y7P046lLi8TQIXQm7PrR1eaIhLBP\n7Az/X5Yakj7zD9V9RwAf00PEgQolm8Zha/hIeDzwyDlmRn36i0Orf/6ZLQJ/O4PE\nUHqCDw3a+EsAzrCSI8Mg98Q1fBiZ/wMJSzWv4oWa4WQBtv8FTgUbEsTujw+tpMZl\nduocaYDCFgb6CnkfN6TI4OYgnhm8Qq/7uPLgcTFfZkMEk9FUX70WHOdDxNBGtg1E\nvg/GGVNfL+c0TgF7g1YL050oPD0HvTLp58DBpQKBgQC1fS6DunZY5IzWqJGvJW3t\nsvdLBoixD18CcaeHU4kviw4sirMVVKVtotbRZ6u8JIm0taL3BEYKkAYxg1EjpAu0\n6OxJwl0qizXRlHBymD3GHyF4ucN7prFWXGpi8/TN0lvHNuUEhXDrtuR6rdA6Dvur\n6igWXoNDyP9yA1Bfjmh1cA==\n-----END PRIVATE KEY-----\n",
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
    
};
// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}
export  async function sendNotification (deviceToken, childName, userId,MissingReportId,email) {
    try {
      sendNotifiEmail({ email: email,childName:childName });
      await missingmodel.findOneAndDelete({createdBy:userId,_id:MissingReportId})
        const message = {
          token: deviceToken,
          notification: {
            title: "Child Found",
            body: `We have found your child ${childName} . We will contact you as soon as possible using your data registered in the form. Please Stay tuned for our call to facilitate the communication process and ensure the safe return of your child.`,
          },
        };
      //Send the notification
        const response =  await admin.messaging().send(message);
        console.log('Notification sent successfully:', response);
        console.log(message.notification);
        console.log(' save notification to database');
        const notifi = await userNotifModel.insertMany({
            title: message.notification.title,
            body: message.notification.body,
            recievedId: userId,
        });
        console.log('Notification saved:', notifi); 
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

