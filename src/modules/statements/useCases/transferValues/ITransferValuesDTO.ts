import { OperationType } from "../../entities/Statement"

interface ITransferStatementDTO {
  sender_id: string
  receiving_id: string
  type: OperationType
  amount: number
  description: string
}

export { ITransferStatementDTO }
