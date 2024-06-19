import { MongoClient } from 'mongodb';
import { missingmodel } from '../../../databases/models/missingreport.model.js';
import { citizenModel } from "../../../databases/models/citizen.model.js";
import { foundChildmodel } from "../../../databases/models/foundchildren.model.js";
import { sendNotification } from './notifService.js';
import { userModel } from '../../../databases/models/user.model.js';
import { adminNotifModel } from '../../../databases/models/adminNotifi.model.js';

const client = new MongoClient(process.env.DB_ONLINE);
let changeStreamMissing;
export async function watchMissingChanges() {
  if (changeStreamMissing) {
      console.log('Change stream already initialized.');
      return;
  } 
  try {
      await client.connect();
      const db = client.db('safereturn');
      const collectionMissing = db.collection('missing reports');
      const pipelineMissing = [
          {
              $match: {
                  operationType: { $in: ['insert', 'update', 'replace'] }
              }
          }
      ];
      changeStreamMissing = collectionMissing.watch(pipelineMissing);
      changeStreamMissing.on('change', async(change) => {
          switch (change.operationType) {
              case 'insert':
                  console.log('Missing Document inserted:', change.fullDocument);
                    handleInsertionMissing(change.fullDocument);
                  break;
              case 'update':
                  console.log('Missing Document updated:', change.documentKey._id);
                  // addMissing(change.documentKey._id);
                  handleUpdateMissing(change.documentKey._id)
                  break;
              default:
                  console.log('Unsupported operation:', change.operationType);
        }
      });

      while (true) {
          await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 60 seconds
      }
  } catch (error) {
      console.error('Error watching changes:', error);
  } finally {
      client.close();
  }
}

// async function addMissing(_id) {
//   let report = await missingmodel.findOne({ _id: _id });
//   console.log('Missing Report Updated:', report);
// }
 async function handleInsertionMissing(insertedDoc) {
  console.log('Handling insertion:');
  try {
    // Check if the nationalID exists in the foundChildmodel
    const foundDoc = await foundChildmodel.findOne({ nationalID: insertedDoc.nationalID });
    if (!foundDoc) {
      console.log('NationalID of missingReport not found in foundChildmodel');
      return null;
    }
    console.log('National ID of missingReport found in foundmodel:', foundDoc);
    // Update the foundChildmodel
    const update = await foundChildmodel.findOneAndUpdate(
      { _id: foundDoc._id },
      {
        parentphone: insertedDoc.phoneNumber,
        parentName: `${insertedDoc.firstReporterName} ${insertedDoc.lastReporterName}`,
        updated: true
      },{ new: true });
    console.log('update:', update);
    const notifMessage = `A found Children table has new update by an insertion of a missing report  `;
    await adminNotifModel.insertMany({ message: notifMessage ,reportid:update._id ,page:"foundChildren.ejs",table:"/foundChildren"});
    // Get the child name from citizenModel
    const child = await citizenModel.findOne({ nationalID: insertedDoc.nationalID });
    const user = await userModel.findOne({ _id: insertedDoc.createdBy });
    console.log(user.deviceToken);
    sendNotification(
      user.deviceToken,
      child.name,
      user._id,
      insertedDoc._id,
      insertedDoc.email
    );

  } catch (error) {
    console.error('Error checking nationalID:', error);
    return null;
  }
}
 async function handleUpdateMissing(_id) {
  console.log('Handling Updating:', _id);
  try {
    // Find the missing report
    const missingReport = await missingmodel.findOne({ _id });
    // Check if the nationalID exists in the foundChildmodel
    const foundDoc = await foundChildmodel.findOne({ nationalID: missingReport.nationalID });
    if (!foundDoc) {
      console.log('NationalID not found in foundmodel');
      return;
    }
    console.log('National ID found in foundmodel');
    // Update the foundChildmodel
    const update = await foundChildmodel.findOneAndUpdate(
      { _id: foundDoc._id },
      {
        parentphone: missingReport.phoneNumber,
        parentName: `${missingReport.firstReporterName} ${missingReport.lastReporterName}`,
        updated: true
      },{ new: true }  );
    // Get the child name from citizenModel
    const child = await citizenModel.findOne({ nationalID: missingReport.nationalID });
    const user = await userModel.findOne({ _id: missingReport.createdBy });
    sendNotification(
      user.deviceToken,
      child.name,
      user._id,
      missingReport._id,
      missingReport.email
    );
  } catch (error) {
    console.error('Error checking nationalID:', error);
    return null;
  }
}