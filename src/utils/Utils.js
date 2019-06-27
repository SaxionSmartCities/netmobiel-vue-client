module.exports = {
  getIcon: function(mode) {
    switch (mode) {
      case 'WALK':
        return 'directions_walk'
      case 'CAR':
      case 'NETMOBIEL':
        return 'directions_car'
      case 'TRAIN':
        return 'train'
      case 'BUS':
        return 'directions_bus'
      case 'RAIL':
        return 'directions_railway'
      case 'WAIT':
        return 'timelapse'
      case 'FINISH':
        return 'outlined_flag'
      default:
        return 'warning'
    }
  },
}
