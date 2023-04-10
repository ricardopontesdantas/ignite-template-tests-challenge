import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
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
    it('should be able to create a new deposit statement', async () => {
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

    it('should be able to create a new withdraw statement', async () => {
        const user = await createUserUseCase.execute({
            name: 'user test 2',
            email: 'user2@mail',
            password: 'test'
        })

        const deposit = {
            user_id: user.id as string,
            amount: 200,
            description: 'deposit test',
            type: OperationType.DEPOSIT
        }

        const withdraw = {
            user_id: user.id as string,
            amount: 100,
            description: 'withdraw test',
            type: OperationType.WITHDRAW
        }

        await createStatementUseCase.execute(deposit)
        const statementOperation = await createStatementUseCase.execute(withdraw)

        expect(statementOperation).toHaveProperty('id')
    })

    it('should not be able to create a new withdraw statement if balance is less than the amount', async () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: 'user test 3',
                email: 'user3@mail',
                password: 'test'
            })
    
            const withdraw = {
                user_id: user.id as string,
                amount: 100,
                description: 'withdraw test',
                type: OperationType.WITHDRAW
            }
    
            await createStatementUseCase.execute(withdraw)
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })

    it('should not be able to create a new statement with an non-existing user', () => {
        expect(async () => {
            const deposit = {
                user_id: 'non-existing user',
                amount: 200,
                description: 'deposit test',
                type: OperationType.DEPOSIT
            }

            await createStatementUseCase.execute(deposit)
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })
})