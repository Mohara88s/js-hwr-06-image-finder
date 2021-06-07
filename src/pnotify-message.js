// import pnotify styles and js
import '../node_modules/@pnotify/core/dist/BrightTheme.css';
import '../node_modules/@pnotify/core/dist/PNotify.css';
import '../node_modules/@pnotify/mobile/dist/PNotifyMobile.css';
import { error } from '../node_modules/@pnotify/core/dist/PNotify.js';
export default function pnotifyMassage(message) {
    error({
            title: `${message}`,
            delay: 1500,
        });
}