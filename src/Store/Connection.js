export default class Connection {

    constructor(adapter)
    {
        this.adapter = adapters;
        this.updateQueue = [];
        this.paused = false;
    }

    processQueue() {
        const nextMessage = this.updateQueue.shift();
        if (nextMessage === null) {
            return;
        }
        nextMessage.execute();
    }

    addToQueue(...queueMessage) {
        this.updateQueue.push(queueMessage);
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    load(Model) {
        this.addToQueue(this.adapter.load(Model));
        setTimeout(this.processQueue, 1);
    }
}