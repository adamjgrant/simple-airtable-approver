m.notification.acts({
    show_notification(_$, args) {
        let notification_element = document.createElement("div");
        notification_element.className = "notification";
        notification_element.innerHTML = `
            <p class="icon">${args.icon || ""}</p>
            <h1 class="heading">${args.heading}</h1>
            <p class="message">${args.message}</p>
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
