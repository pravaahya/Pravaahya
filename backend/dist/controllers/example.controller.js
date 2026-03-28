"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleController = void 0;
const example_service_1 = require("../services/example.service");
class ExampleController {
    exampleService;
    constructor() {
        this.exampleService = new example_service_1.ExampleService();
    }
    getExample = async (req, res) => {
        try {
            const data = await this.exampleService.getExampleData();
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };
}
exports.ExampleController = ExampleController;
