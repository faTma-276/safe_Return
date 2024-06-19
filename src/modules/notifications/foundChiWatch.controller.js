import { MongoClient } from 'mongodb';

import { missingmodel } from '../../../databases/models/missingreport.model.js';
import { foundChildmodel } from '../../../databases/models/foundchildren.model.js';
import { citizenModel } from '../../../databases/models/citizen.model.js';
import { userModel } from '../../../databases/models/user.model.js';
import { sendNotification } from './notifService.js';
import { adminNotifModel } from '../../../databases/models/adminNotifi.model.js';

export async function watchFoundChanges() {
        const client = new MongoClient(process.env.DB_ONLINE);
    
        try {
        await client.connect();
        const db = client.db("safereturn");
        const collectionFound = db.collection("found children");
    
        const pipelinefound = [
                {
                    $match: {
                    operationType: { $in: ['insert'] }   //, 'update', 'replace'
                    }
                }
        ];
    
        while (true) {
            const changeStreamfound = collectionFound.watch(pipelinefound);
    
            changeStreamfound.on("change", (change) => {
                if (change.operationType === "insert") {
                    console.log("Document inserted:", change.fullDocument);
                    handleInsertionFound(change.fullDocument)
                    return; // Exit the switch statement
                }
                console.log("Unsupported operation:", change.operationType);
            });
    
            await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 60 seconds
    
            changeStreamfound.close();
        }
        } catch (error) {
        console.error("Error watching changes:", error);
        } finally {
        client.close();
        }
    }
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
                    user.deviceToken,
                    child.name,
                    user._id,
                    missingDoc._id,
                    missingDoc.email
                ); 
            }
        } catch (error) {
            console.error('Error checking nationalID:', error);
            return null; 
        }
    }
