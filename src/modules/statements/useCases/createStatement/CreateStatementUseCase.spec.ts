import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryUsersRepository = new InMemoryUsersRepository()
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
let inMemoryStatementsRepository = new InMemoryStatementsRepository()
let createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
    it('should be able to create a new statement', async () => {
        const user = await createUserUseCase.execute({
            name: 'user test',
            email: 'user@mail',
            password: 'test'
        })

        const deposit = {
            user_id: user.id as string,
            amount: 100,
            description: 'deposit test',
            type: OperationType.DEPOSIT
        }

        const statementOperation = await createStatementUseCase.execute(deposit)

        expect(statementOperation).toHaveProperty('id')
    })
})