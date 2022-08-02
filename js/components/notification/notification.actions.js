m.notification.acts({
    show_notification(_$, args) {
        let notification_element = document.createElement("div");
        notification_element.className = "notification";
        notification.innerHTML = `
          <div class="notification">
            <span class="icon">${args.icon || ""}</span>
            <h1>${args.message}</h1>
          </div>
        `;
        _$.me().appendChild(notification_element);
        setTimeout(() => { _$.act.hide_notification({ element: notification_element }) }, 2000);
    },

    hide_notification(_$, args) {
        const element = args.element;
        const parent = element.parentNode
        parent.removeChild(element);
    }
});
