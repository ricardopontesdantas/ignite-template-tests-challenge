import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferValuesUseCase } from "./TransferValuesUseCase";

enum OperationType {
  TRANSFER = 'transfer'
}

class TransferValuesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { user_id:  receiving_id} = request.params;
    const { amount, description } = request.body;
    const transferValuesUseCase = container.resolve(TransferValuesUseCase)
    const type = OperationType.TRANSFER
    const transfer = await transferValuesUseCase.execute({ sender_id, receiving_id, type, amount, description });

    return response.status(201).json(transfer);
  }
}

export { TransferValuesController }
