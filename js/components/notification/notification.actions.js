m.notification.acts({
    show_notification(_$, args) {
        let notification_element = document.createElement("div");
        notification_element.className = "notification";
        notification_element.innerHTML = `
            <span class="icon">${args.icon || ""}</span>
            <h1>${args.heading}</h1>
            <p>${args.message}</p>
        `;
        _$.me().appendChild(notification_element);
        setTimeout(() => { _$.act.hide_notification({ element: notification_element }) }, args.delay || 3000);
    },

    hide_notification(_$, args) {
        const element = args.element;
        const parent = element.parentNode
        parent.removeChild(element);
    }
});
