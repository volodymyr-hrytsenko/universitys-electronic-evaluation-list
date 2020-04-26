
let dataRecord = Object.create({}, {
    name: {
      writable: true,
      configurable: true,
      value: 'Василь'
    },
    year_birth: {
      writable: true, //дозвіл на зміну
      configurable: true, //дозвіл на видалення
      enumerable: true, //видимість для циклу for in
      value: '1977'
    },
  
    val: {
      configurable: false,
      get: function () {
        return this.name;
      },
      set: function (value) {
        this.name = value;
      }
    },
    year: {
      configurable: false,
      get: function () {
        return this.year_birth;
      },
      set: function (value) {
        this.year_birth = value;
      }
    }
  });
  dataRecord.name = "vovan";

  console.log(dataRecord.val);