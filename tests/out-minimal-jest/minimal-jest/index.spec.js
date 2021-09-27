"use strict";
var ref = require("./index"), add = ref.add;
describe("add", function() {
    it("should return 2 when it gives 1,1", function() {
        expect(add(1, 1)).toBe(2);
    });
});
