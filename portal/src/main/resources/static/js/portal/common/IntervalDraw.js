export default class IntervalDraw {
  constructor() {
    this.intervalID = 0;
    this.timeunit = 15;
  }

  stop() {
    clearInterval(this.intervalID);
  }

  start(unit, callback) {
    this.intervalID = setInterval(() => callback(false, unit), unit);
  }

  // TODO
  getObjects(timepicker, callback) {
    const picker = document.querySelectorAll('.selectpicker')[timepicker];
    if (picker && !isNaN(parseInt(picker.value))) {
      this.timeunit = parseInt(picker.value);
    }
    this.stop();
    callback(true, this);
    // console.log('stop interval ID :', this.intervalID);
    if (this.timeunit !== 'off') {
      this.start(1000 * this.timeunit, callback);
      // console.log('new interval ID :', this.intervalID);
    }
  }

  get id() {
    return this.intervalID;
  }

  get unit() {
    return this.timeunit;
  }
}