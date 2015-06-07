var TrainTypes = require('../constants/TrainTypes');

var addType = function(train) {
  if (train.id >= 400) {
    // Weekend trains? :O
    train.type = TrainTypes.LOCAL;
  } else if (train.id >= 300) {
    train.type = TrainTypes.BABY_BULLET;
  } else if (train.id >= 200) {
    train.type = TrainTypes.LIMITED_STOP;
  } else {
    train.type = TrainTypes.LOCAL;
  }
};

module.exports = {
  addType: addType
};
