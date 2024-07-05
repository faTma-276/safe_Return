
import { missingmodel } from '../../../databases/models/missingreport.model.js';
import { citizenModel } from "../../../databases/models/citizen.model.js";
import { foundChildmodel } from "../../../databases/models/foundchildren.model.js";
import { sendNotification } from './notifService.js';
import { userModel } from '../../../databases/models/user.model.js';
import { adminNotifModel } from '../../../databases/models/adminNotifi.model.js';

//handleInsertionMissing
export async function handleInsertionMissing(insertedDoc) {
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
  //
//handleUpdateMissing
export async function handleUpdateMissing(insertedDoc) {
    console.log('Handling Updating:', insertedDoc);
    try {
      // Find the missing report
    //   const missingReport = await missingmodel.findOne({ _id });
      // Check if the nationalID exists in the foundChildmodel
      const foundDoc = await foundChildmodel.findOne({ nationalID: insertedDoc.nationalID });
      if (!foundDoc) {
        console.log('NationalID not found in foundmodel');
        return;
      }
      console.log('National ID found in foundmodel');
      // Update the foundChildmodel
      const update = await foundChildmodel.findOneAndUpdate(
        { _id: foundDoc._id },
        {
          parentphone: insertedDoc.phoneNumber,
          parentName: `${insertedDoc.firstReporterName} ${insertedDoc.lastReporterName}`,
          updated: true
        },{ new: true }  );
        const notifMessage = `A found Children table has new update by an insertion of a missing report  `;
      await adminNotifModel.insertMany({ message: notifMessage ,reportid:update._id ,page:"foundChildren.ejs",table:"/foundChildren"});
      
      // Get the child name from citizenModel
      const child = await citizenModel.findOne({ nationalID: insertedDoc.nationalID });
      const user = await userModel.findOne({ _id: insertedDoc.createdBy });
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
  // handleInsertionFound
export async function handleInsertionFound(insertedDoc) {
    try {
        // Check if nationalID exists in misingmodel 
        const missingDoc = await missingmodel.findOne({ nationalID: insertedDoc.nationalID });
        if (!missingDoc) {
            console.log('NationalID not found in foundmodel');
            return null;
        } else {
            console.log('National ID found in missingmodel:', missingDoc);
            // update foundChildmodel
            const update = await foundChildmodel.findOneAndUpdate({ _id: insertedDoc._id },
                {
                    parentphone: missingDoc.phoneNumber,
                    parentName: `${missingDoc.firstReporterName} ${missingDoc.lastReporterName}`,
                    updated: true
                }, { new: true }
            );
            console.log('update:',update)
            const notifMessage = `Found Children table has new update : ${update._id} `;
            await adminNotifModel.insertMany({ message: notifMessage ,reportid:update._id ,page:"foundChildren.ejs",table:'/foundChildren'});
            const child = await citizenModel.findOne({ nationalID: missingDoc.nationalID });
            const user = await userModel.findOne({ _id: missingDoc.createdBy });
            console.log("user:",user); console.log(child.name)
            sendNotification(
                user.deviceToken,child.name,user._id,missingDoc._id,missingDoc.email
            ); 
        }
    } catch (error) {
        console.error('Error checking nationalID:', error);
        return null; 
    }
}