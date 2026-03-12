**Call Push Notification (Frontend Guide - বাংলা)**
- লক্ষ্য: কল আসলে অ্যাপ ওপেন না থাকলেও ইনকামিং কল UI দেখানো।
- Backend থেকে এখন Android‑এর জন্য FCM data‑only push যাবে, iOS VoIP এখনো নেই।

**১) Device Token Update (অবশ্যই লাগবে)**
- API: `PATCH /api/v1/auth/device-token`
- Body (Android উদাহরণ):
```json
{
  "fcmToken": "YOUR_FCM_TOKEN",
  "deviceType": "android"
}
```
- iOS পরে: `voipToken` পাঠাতে হবে (CallKit/VoIP push যুক্ত হলে)।

**২) Call Create Flow (Backend 이미 আছে)**
- API: `POST /api/v1/calls`
- Backend এই কল create হলে receiver‑দের কাছে push যাবে।
- Backend payload থেকে `roomId` = Agora channel name।

**৩) Android‑এ Incoming Call UI**
- FCM থেকে data‑only push আসবে:
  - `type: "incoming_call"`
  - `callId`
  - `channel` (এটাই roomId)
  - `agoraToken`
  - `callerName`
  - `callType` (AUDIO/VIDEO)
  - `mode` (ONE_TO_ONE/GROUP)
- Flutter background handler‑এ এই data ধরতে হবে।
- ইনকামিং কল দেখাতে:
  - Full‑screen notification অথবা Call UI (Android foreground service + action buttons)।
  - Accept/Decline বাটন ক্লিক করলে socket/API এ call accept/decline trigger করবে।

**৪) App Open থাকলে**
- Socket events আগেই আছে (callInvite/callAccept/callDecline/callEnd)।
- UI‑তে কল স্ক্রিন দেখাতে socket payload ব্যবহার হবে।

**৫) টেস্টিং**
- Android device‑এ valid `fcmToken` সেট আছে কিনা যাচাই করুন।
- `POST /api/v1/calls` কল করে দেখুন push আসে কিনা।
- `incoming_call` data আসলে UI trigger হচ্ছে কিনা চেক করুন।

**৬) iOS নোট**
- iOS‑এ CallKit UI দেখাতে **APNs VoIP push** লাগবে।
- Backend‑এ `voipToken` save হবে, এরপর APNs ইন্টিগ্রেশন দরকার।

**৭) Common Issues**
- Push না এলে আগে দেখুন `fcmToken` ঠিকমতো update হয়েছে কিনা।
- Data‑only push হলে notification block ব্যবহার করবেন না।
- `agoraToken`/`channel` mismatch হলে call join হবে না।
