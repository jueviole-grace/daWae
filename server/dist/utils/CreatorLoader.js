"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const createUserLoader = () => new dataloader_1.default();
exports.createUserLoader = createUserLoader;
//# sourceMappingURL=CreatorLoader.js.map