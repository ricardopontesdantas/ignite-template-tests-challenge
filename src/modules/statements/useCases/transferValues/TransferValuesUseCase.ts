import { inject, injectable } from "tsyringe"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementError } from "../createStatement/CreateStatementError"
import { ITransferStatementDTO } from "./ITransferValuesDTO";

@injectable()
class TransferValuesUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ sender_id, receiving_id, type, amount, description }: ITransferStatementDTO) {
    const senderUser = await this.usersRepository.findById(sender_id);
    const receiverUser = await this.usersRepository.findById(receiving_id);
    if (!senderUser) throw new CreateStatementError.UserNotFound();
    if (!receiverUser) throw new CreateStatementError.UserNotFound();
    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });
    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }
    await this.statementsRepository.create({
      user_id: sender_id,
      type,
      amount,
      description
    });
    const transfer = await this.statementsRepository.create({
      user_id: receiving_id,
      sender_id,
      type,
      amount,
      description
    });

    return transfer;
  }
}

export { TransferValuesUseCase }
