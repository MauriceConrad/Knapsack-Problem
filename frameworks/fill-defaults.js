Object.prototype.fillDefaults = function(defaults) {
  var keys = Object.keys(defaults);
  for (var i = 0; i < keys.length; i++) {
    if (typeof defaults[keys[i]] == "object" && keys[i] in this && defaults[keys[i]] != null) {
      this[keys[i]] = this[keys[i]].fillDefaults(defaults[keys[i]]);
    }
    else if (!(keys[i] in this)) {
      this[keys[i]] = defaults[keys[i]];
    }
  }
  return this;
}
