import { Request, Response } from 'express';
import { ExampleService } from '../services/example.service';

export class ExampleController {
  private exampleService: ExampleService;

  constructor() {
    this.exampleService = new ExampleService();
  }

  public getExample = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.exampleService.getExampleData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
}
