import { Trainer, TrainingData } from './Trainer';

const Client = {
  _trainer: null,

  _socket: null,

  /** @type {{[key: string]: Function[]}} */
  _listeners: {},

  init() {
    this._socket = io();
    this._socket.on('receive init data', ({ inputData, outputData, offset }) => {
      this._trainer = new Trainer(new TrainingData(inputData, outputData, offset));
    });
  },

  /**
   * @returns {Trainer}
   */
  get trainer() {
    return this._trainer;
  },

  on(name, fn) {
    this._socket.on(name, fn);

    return {
      remove: (function (name, fn) {
        Client._socket.off(name, fn);
      }).bind(name, fn)
    };
  },

  send(msg, ...data) {
    this._socket.emit(msg, ...data);
  },

  Arena: {
    join(arenaId) {
      Client._socket.emit('join arena', arenaId);
    },

    startTraining(arenaId) {
      Client._socket.emit('request start training', arenaId);
    }
  }
};

export default Client;