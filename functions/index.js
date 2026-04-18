const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const fetch = require("node-fetch"); // requires node-fetch v2 for commonjs
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// 1. onComplaintCreated — triggers on new complaint document
exports.onComplaintCreated = onDocumentCreated("COMPLAINTS/{complaintId}", async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const complaintId = data.id;

    try {
        // Call FastAPI backend to classify the complaint
        const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${backendUrl}/classify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ complaintId: complaintId, text: data.text })
        });

        if (!response.ok) {
            console.error(`Classification failed for ${complaintId}: ${response.statusText}`);
            return;
        }

        const classification = await response.json();

        // Update the complaint document with AI-generated data
        await snap.ref.update({
            category: classification.category,
            severity: classification.severity,
            department: classification.department,
            summary: classification.summary,
            language: classification.language,
        });

        // Optional: Send FCM push notification down the line
        // Example: admin.messaging().sendToTopic(...)
        
    } catch (error) {
        console.error(`Error processing complaint ${complaintId}:`, error);
    }
});

// 2. onStatusUpdated — triggers on complaint status field change
exports.onStatusUpdated = onDocumentUpdated("COMPLAINTS/{complaintId}", async (event) => {
    const newValue = event.data.after.data();
    const previousValue = event.data.before.data();

    // Check if status changed
    if (newValue.status === previousValue.status) return;

    // Write an entry to AUDIT_LOGS collection
    await db.collection("AUDIT_LOGS").add({
        action: "STATUS_UPDATE",
        complaintId: event.params.complaintId,
        previousValue: previousValue.status,
        newValue: newValue.status,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // If submitterToken exists, send a push notification
    if (newValue.submitterToken) {
        const message = {
            notification: {
                title: "Complaint Status Updated",
                body: `Your complaint (${event.params.complaintId}) is now: ${newValue.status}`
            },
            token: newValue.submitterToken
        };
        try {
            await admin.messaging().send(message);
        } catch (err) {
            console.error("Error sending push notification:", err);
        }
    }
});

// 3. scheduleNightlyVerification — runs nightly via Cloud Scheduler
exports.scheduleNightlyVerification = onSchedule("every day 00:00", async (event) => {
    console.log("Running nightly complaint verification...");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoTimestamp = admin.firestore.Timestamp.fromDate(thirtyDaysAgo);

    const complaintsSnapshot = await db.collection("COMPLAINTS")
        .where("timestamp", ">=", thirtyDaysAgoTimestamp)
        .get();

    const batch = db.batch();
    
    complaintsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.text && data.hash) {
            // Re-hash the stored text
            const rehashed = crypto.createHash("sha256").update(data.text).digest("hex");
            
            // If any mismatch found: flag the complaint with tampered: true
            if (rehashed !== data.hash) {
                console.warn(`TAMPERING DETECTED for complaint ${doc.id}`);
                batch.update(doc.ref, { tampered: true });
                
                // TODO: Send alert email to admin
            }
        }
    });

    await batch.commit();
    console.log("Nightly verification complete.");
});
