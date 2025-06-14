// utils/inAppUpdate.js

import InAppUpdates, { IAUUpdateKind } from 'react-native-in-app-updates';

export const checkAndStartUpdate = async () => {
  try {
    const inAppUpdates = new InAppUpdates(true); // true = fallback to Play Store

    const result = await inAppUpdates.checkUpdate();

    if (result.shouldUpdate) {
      await inAppUpdates.startUpdate({
        updateType: IAUUpdateKind.IMMEDIATE, // Use FLEXIBLE if needed
      });
    }
  } catch (error) {
    console.log('In-app update failed:', error);
  }
};
