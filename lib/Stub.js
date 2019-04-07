"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStub(name) {
    return { __stubName: name || "<generic stub>" };
}
exports.createStub = createStub;
function assign(stub, replacement) {
    if (!isUnassignedStub(stub)) {
        throw new Error("stub has already been assigned");
    }
    delete stub.__stubName;
    Object.assign(stub, replacement);
    Object.setPrototypeOf(stub, Object.getPrototypeOf(replacement));
    return stub;
}
exports.assign = assign;
function isUnassignedStub(object) {
    return (object.__stubName !== undefined);
}
exports.isUnassignedStub = isUnassignedStub;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3R1Yi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TdHViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0EsU0FBZ0IsVUFBVSxDQUFzQixJQUFhO0lBQzNELE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxJQUFJLGdCQUFnQixFQUFTLENBQUM7QUFDekQsQ0FBQztBQUZELGdDQUVDO0FBRUQsU0FBZ0IsTUFBTSxDQUNwQixJQUFhLEVBQ2IsV0FBYztJQUVkLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDbkQ7SUFDRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDakMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVhELHdCQVdDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsTUFBaUI7SUFDaEQsT0FBTyxDQUFFLE1BQW9CLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCw0Q0FFQyJ9