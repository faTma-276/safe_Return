

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
    private_key:"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDTlZrNtic2H6cu\n0GC4hEU6mCN+32LU58AVxKywt2HFdVzpzkZuLNFe86mpljy+9ceWrAhAQa8bMmdk\nXuyEjlAdluvZqRCRVWMSQ9PuPalq0EP3y6NsigcMjnuytv5JUIa9YPCyh/q0IB/H\nbHLmu4nOSeCgDJmgA4ZYQuyeBSPietNyZhnOeb6CQfYtlDxTliwUe/3xe96wjkOO\nVP6sUNZmxN1MvKcY63wPLfPX0OvmLkufi3h5jSqxC6SwyHsp7MdDMLHo4i7DetIE\nhkH/gLMRPr+LOuUcHDpHJu+0jK/MjqTKpVPdTub+vKCNgRNZWiJQ0GXYbMrbwF7A\nMa0gsEWzAgMBAAECggEAXPKdvLzGYPpqwR/9PVGt792hyjxr+EeOlIF/s2n743h5\nRqS9P+0kVOgJolxDd0gVU9VjEodIW1Q7I1an5Ft4SmdgWI/ynUW7beyqD0C7ShcP\npK2qryW7jwKQyKOm9aIQbuVFF8iwk6yBCWRU3ZOJKDxAF08xtZ+WxvMvawOrDfRG\nrYEv6apjSqb5IQ1pO+6XW5wUc6XfwLkVMU9bac7mz5DKPAGT2e6ctBgyw4vn8yIu\nl5y4nCpKgQKJNCC5OCDFlymhonFe2g0hFfUNyjpp6DLmeYN/mDLBGfaPsX190/UO\nI/1DzzCTAcFgixPXiEgKP23PTMSF35yY/Fn+W69CYQKBgQDrCJ5NMmD58V4cXias\nwXuBZc7pSud4UAhJHc52+9UTDrL+Uk5AdHD2IyQJg41AhBCj2R9dSNc79Vr+GUzm\nsq/XC1x5H+2IBQ5Aq1JIZf2PFhDoxLBhsiXiNDiX7sQjBG1FgcrNZltsfpI40jyj\nqMljNsKqxREVkXB1d8//Wxzm6QKBgQDmdXvHLZWn8T27nOYiK3BfuJ9QujFHCVI6\nTFkad7/1giZy5ekFxxUBtbfxBKhLqSlcEhTSEpOfETi7TduZ74dd3+BhAvnME9cw\ns2bpFbIf4qpkS+vDkDZj6WQFt4uzBaw6evTPzTe2u2H+xD6rOrJ6Wo42nZgviTW1\nzrsJbuHeOwKBgG9YveZEn7zJpJQ75oahgyliWgwb+Fz/TW2WOWIVHHTS2emyhG/0\nui9hpoj7UcfmyRtWmY1QHOfC7UDEK7J/pN5z+3NGtPljq8TnZSv3ZZCMG6aqyAUA\nqQHpS4ZvD2ynhD0RqEp224kizZMtxpyiMgZWwxK0GcvmAykjgd6wA5lBAoGBALDw\nMIl7ETTw/jGmQ/amHVAQwpjLa3wbxvsllR/CIyqOs5BxvpgGArXeXAx7Q+9bQHsF\nEuE7DAYLxd/g5iLpCahkc7RoAXvTG9uzUebRFoJul94LgEcU2P2auoW9J0/aoiIA\nNye4avcsJQ/igi8bEN7p2dhK5QZSNV+SCn4ymM3zAoGAKds1djBVpUvB9UZcjYj6\nbkBa5B8eed9stFUQKHKk7Nw4bKWqEJOwlJ1kDHrvus0Ymxa62duf/d/9jKRtcoJy\nywVuorrXjNculr6dozFSdxTls09l2Ry2876IlgDoDJDcdWPuXq+cUrzdwurJ/lTq\nvAIYSb4tD3VTcbQFdumPdEU=\n-----END PRIVATE KEY-----\n",
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
      // Construct the notification message
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
      //Save the notification to the userNotifiModel
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

