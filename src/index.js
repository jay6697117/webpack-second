import "../public/index.less";

class Animal {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

const vm  = new Vue({
  el:'#wrap',
  data() {
    return {
      msg:'hello world'
    }
  },
})
console.log('vm :>> ', vm);

const dog = new Animal("dog");
console.log("dog66 :>> ", dog);
