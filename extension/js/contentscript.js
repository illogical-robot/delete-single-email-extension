// Code for triggering clicks on items loaded through AJAX
// Source: https://stackoverflow.com/a/15512019
function triggerMostButtons (jNode) {
    triggerMouseEvent (jNode, "mouseover");
    triggerMouseEvent (jNode, "mousedown");
    triggerMouseEvent (jNode, "mouseup");
    triggerMouseEvent (jNode, "click");
}

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

// Function for deleting the message
function deleteMail() {
    // Find out what element is currently in focus
    try {
        var focusedElement = document.activeElement;
        if (focusedElement.getAttribute('contenteditable') || focusedElement.tagName === "INPUT" || focusedElement.tagName === "TEXTAREA") {
            // Don't delete the email if the user is using an input element or an editable element (aka typing an email or doing a search)
            return
        }
    } catch (err) {
        console.log("Error finding focused element: " + err)
    }
    // Simulate click on dropdown menu
    triggerMostButtons(document.querySelector('div[data-message-id] div[data-tooltip="More"]'));
    // Simulate click on 'Delete this message' menu item
    var deleteMenuItem = document.querySelector('div[class="b7 J-M"] #tm');
    // This needs to be triggered twice for some reason
    triggerMostButtons(deleteMenuItem);
    triggerMostButtons(deleteMenuItem);
    // Restore focus to original element
    try {
        focusedElement.focus();
    } catch (err) {
        console.log("Error restoring element focus: " + err)
    }
}

// Set listener for shortcut
chrome.storage.sync.get({
    data: ["shiftKey", "53"],
    secondary: ["shiftKey", "54"],
    secondaryEnabled: false
}, function(items) {
    console.log("Primary delete shortcut: " + items.data[0] + " + " + items.data[1]);
    document.addEventListener('keydown', function doc_keyUp(e) {
        if ((items.data[0] == "noKey") && (e.keyCode == items.data[1])) {
            deleteMail();
        } else if ((e[items.data[0]]) && (e.keyCode == items.data[1])) {
            deleteMail();
        }
    });
    // Enable secondary shortcut if switched on in settings
    if (items.secondaryEnabled) {
        console.log("Secondary delete shortcut: " + items.secondary[0] + " + " + items.secondary[1]);
        document.addEventListener('keydown', function doc_keyUp(e) {
            if ((items.secondary[0] == "noKey") && (e.keyCode == items.secondary[1])) {
                deleteMail();
            } else if ((e[items.secondary[0]]) && (e.keyCode == items.secondary[1])) {
                deleteMail();
            }
        });
    } else {
        console.log("Secondary delete shortcut not enabled.")
    }
});