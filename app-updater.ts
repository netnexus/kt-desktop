import {dialog} from 'electron';
import {autoUpdater} from 'electron-updater';

autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.autoDownload = true;

// reference to menu item for manual update check
let updateMenuItem;

// do not display messages when false
let showAlreadyUpToDateMessage = false;

autoUpdater.on('error', (error) => {
    // dialog.showErrorBox('Fehler: ', error == null ? 'unknown' : (error.stack || error).toString())
    console.error(error);
});

autoUpdater.on('update-available', () => {
    if (!showAlreadyUpToDateMessage) {
        return;
    }
    dialog.showMessageBox({
        title: 'Update verfügbar',
        message: 'Der Download eines Updates wurde im Hintergrund gestartet.',
    });
});

autoUpdater.on('update-not-available', () => {
    if (!showAlreadyUpToDateMessage) {
        return;
    }
    dialog.showMessageBox({
        title: 'Keine Updates',
        message: 'Sie haben bereits die aktuellste Version installiert.',
    });
    updateMenuItem.enabled = true;
    updateMenuItem = null;
    showAlreadyUpToDateMessage = false;
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        title: 'Update installieren',
        message: 'Es ist ein Update verfügbar. Zur Installation muss die Anwendung neu gestartet werden.',
        buttons: ['Ja, direkt installieren', 'Später']
    }, (buttonIndex) => {
        if (buttonIndex === 0) {
            setImmediate(() => autoUpdater.quitAndInstall());
        }
    });
});

// export this to MenuItem click callback
export function checkForUpdates(menuItem) {
    updateMenuItem = menuItem;
    updateMenuItem.enabled = false;
    showAlreadyUpToDateMessage = true;
    autoUpdater.checkForUpdates();
}

// just start the update check and download process
autoUpdater.checkForUpdates();
