class ChatUpdater {
    constructor (mode) {
        this.timer = null;
        this.chatID = null;
        this.userID = null;
        this.chatTag = null;
        this.mode = mode;
        this.onNewMessages = null;
        this.lastMsgID = 0;
        this.onSend = this.send.bind (this);

        this.timerHandler = () => {
            Request.fetchJson ('requests/getmsg.php', {
                convID: this.chatID,
                startAfter: this.lastMsgID,
            })
            .then (response => {
                if (response.ok) {
                    response.json ().then (data => {
                        if (data.result === 200 && data.messages && data.messages.length > 0) {
                            data.messages.forEach (message => {
                                if (message.id > this.lastMsgID)
                                    this.lastMsgID = message.id;
                            });

                            if (this.onNewMessages) this.onNewMessages (this.mode, data);
                        }
                    });
                }
            });
        };
    }

    start (userID, chatTag, onNewMessages) {
        this.userID = userID;
        this.chatTag = chatTag;
        this.onNewMessages = onNewMessages;

        const instance = this;

        Request.fetchJson ('requests/initconv.php', {
            tag: this.chatTag,
            mode: this.mode,
            user: this.userID,
        })
        .then (response => {
            if (response.ok) {
                response.json ().then (data => {
                    if (data.result === 200) {
                        instance.chatID = data.convID;
    
                        setInterval (instance.timerHandler.bind (instance), POLL_INTERVAL);
                    }
                });
            }
        });
    }

    send (text) {
        Request.fetchJson ('requests/sendmsg.php', {
            convID: this.chatID,
            mode: this.mode,
            text: text,
        });
    }
}

ChatUpdater.Mode = {
    PASSENGER: 1,
    DRIVER: 2,
};