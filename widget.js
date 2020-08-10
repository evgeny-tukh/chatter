class ChatWidget {
    constructor (config) {
        this.config = config;
        this.mode = config.mode ? config.mode : ChatUpdater.Mode.PASSENGER;
        this.updater = new ChatUpdater (this.mode);
        this.coollapsed = true;
        this.icon = null;
        this.host = null;
        this.msgHost = null;
    }

    processIconClick () {
        this.collapsed = !this.collapsed;

        this.update ();
    }

    update () {
        this.icon.className = `chatIcon ${this.collapsed ? '' : 'hidden'}`;
        this.host.className = `chatHost ${this.collapsed ? 'hidden' : ''}`;
    }

    switchChat () {
        this.collapsed = !this.collapsed;

        this.update ();
    }

    onSend () {
        if (this.msg.value.length > 0) {
            this.updater.onSend (this.msg.value);
    
            this.msg.value = '';
        }
    }

    onNewMessages (myMode, data) {
        if (data.messages) {
            data.messages.forEach (message => {
                this.createMessageDiv (myMode, message.mode, message.text, message.time)
            });
        }

        if (this.config.onNewMessages) this.config.onNewMessages (myMode, data);
    }
    
    formatTime (timestamp) {
        let result = '';
        const time = new Date (timestamp * 1000);
        const hours = time.getHours ();
        const minutes = time.getMinutes ();
        const seconds = time.getSeconds ();
    
        result += (hours < 10 ? '0' : '') + hours;
        result += ':';
        result += (minutes < 10 ? '0' : '') + minutes;
        result += ':';
        result += (seconds < 10 ? '0' : '') + seconds;
    
        return result;
    }
    
    createMessageDiv (myMode, mode, text, timestamp) {
        const msgDiv = document.createElement ('div');
        const header = document.createElement ('span');
        const textHost = document.createElement ('span');
        let senderName;

        if (mode === myMode) {
            // I am sending
            senderName = this.config.myName ? this.config.myName : 'me';
        } else {
            // He has sent
            senderName = this.config.hisName ? this.config.hisName : (mode === ChatUpdater.Mode.PASSENGER ? 'customer' : 'driver');
        }
    
        header.className = (mode === myMode) ? 'sender' : 'recipient';
        header.innerText = `${senderName} ${formatTime (timestamp)}: `;
    
        textHost.innerText = text;
    
        msgDiv.className = 'message';
        msgDiv.appendChild (header);
        msgDiv.appendChild (textHost);
        this.msgHost.appendChild (msgDiv);
    
        this.msgHost.scrollTop = this.msgHost.scrollHeight - this.msgHost.clientHeight;
    }
    
    attach (parent) {
        const newDiv = () => { return document.createElement ('div'); };

        if (!parent) parent = document.getElementsByTagName ('body')[0];

        this.icon = newDiv ();
        this.host = newDiv ();

        const iconImg = document.createElement ('img');

        iconImg.src = 'res/chat_t.svg';

        this.icon.className = 'chatIcon';
        this.icon.id = 'chatIcon';
        this.icon.onclick = this.processIconClick.bind (this);

        if (this.config.iconStyle) this.icon.style = this.config.iconStyle;
        if (this.config.chatHostStyle) this.host.style = this.config.chatHostStyle;

        this.icon.appendChild (iconImg);

        this.host.className = 'chatHost';
        this.host.id = 'chatHost';

        const caption = newDiv ();

        caption.className = 'caption';
        caption.innerText = 'Chat';

        const closeIcon = newDiv ();

        closeIcon.className = 'closeIcon';
        closeIcon.onclick = this.switchChat.bind (this);
        closeIcon.innerText = '✖';

        caption.appendChild (closeIcon);

        this.msgHost = newDiv ();

        this.msgHost.id = 'mmsgHost';
        this.msgHost.className = 'messageHost';

        this.msg = document.createElement ('textarea');
        
        this.msg.className = 'answerBox';
        this.msg.id = 'msg';
        this.msg.placeholder = 'Enter message text';
        this.msg.autofocus = true;

        const sendButton = newDiv ();

        sendButton.className = 'sendButton';
        sendButton.innerText = '✉';
        sendButton.onclick = this.onSend.bind (this);

        this.host.appendChild (caption);
        this.host.appendChild (this.msgHost);
        this.host.appendChild (this.msg);
        this.host.appendChild (sendButton);

        parent.appendChild (this.icon);
        parent.appendChild (this.host);

        this.update ();
    }

    start () {
        this.updater.start (this.config.userID, this.config.chatTag, this.onNewMessages.bind (this));
    }
}