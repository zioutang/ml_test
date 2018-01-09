var jsonfile = require('jsonfile');

class Random {

  constructor() {
    this.numOfValue = 100; // the large it is the more accurate of the random drafting.
    this.numOfThreads = 5; // five copies
    this.list = [];
    this.weight = {
      1: 10,
      2: 5,
      3: 3,
      4: 1,
      5: 1,
    }
    this.lastOneHundred = [];
  }
  setweight() { // create the list that reflect the weight of each number
    for (let key in this.weight) {
      let w = this.weight[key];
      while (w > 0) {
        this.list.push(parseInt(key));
        w--;
      }
    }
  }
  getRandom() { // randomly draft a number of the list
    let n = this.list.length;
    let index = Math.floor(Math.random() * n);
    return this.list[index];
  }
  storeOneHundred() { // draft 100 random nums and store in an array. the most recent comes the last.
    let n = this.numOfValue;
    while (n > 0) {
      let num = this.getRandom();
      this.lastOneHundred.push(num);
      n--;
    }
  }
  getFreq() { // display each num and its frequency
    let map = {};
    this.lastOneHundred.forEach(item => {
      if (map.hasOwnProperty(item)) {
        map[item]++
      } else {
        map[item] = 1;
      }
    })
    for (let key in map) {
      map[key] = map[key] / this.lastOneHundred.length;
    }
    console.log(map);
  }
  getMostRecent() { // get the most recent num and its time stamp
    return {
      value: this.lastOneHundred.pop(),
      time: new Date()
    }
  }
  write(file) { // writing in files in JS is asynchronous
    let data = this.getMostRecent();
    jsonfile.writeFile(file, data, err => {
      // console.log(err);
    })
    console.log(`write successfully in the file: ${file} at: `, data.time);
  }
  writeInThreads() {
    let threads = [];
    let n = 1;
    while (n <= this.numOfThreads) {
      threads.push(this.write(`data/thread_${n}.json`));
      n++;
    }
    Promise.all(threads); // using promise to handle asynchronous call to make sure they are called one by one
  }

}

let rand = new Random();
rand.setweight();
rand.storeOneHundred();
rand.getFreq();
rand.write('data/data.json');
rand.writeInThreads();
