import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "../getStatementOperation/GetStatementOperationUseCase"

let inMemoryUsersRepository = new InMemoryUsersRepository()
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
let inMemoryStatementsRepository = new InMemoryStatementsRepository()
let createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
let getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe('Get Statement Operation', () => {
    it('should be able to get a statement operation', async () => {
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

        const statement = await getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: statementOperation.id as string })

        expect(statement).toHaveProperty('id')
        expect(statement.amount).toEqual(100)
    })
})