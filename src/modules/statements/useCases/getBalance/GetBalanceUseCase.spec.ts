import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let inMemoryUsersRepository = new InMemoryUsersRepository()
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
let inMemoryStatementsRepository = new InMemoryStatementsRepository()
let getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)

describe('Get Balance', () => {
    it('should be able to get balance', async () => {
        const user = await createUserUseCase.execute({
            name: 'user test',
            email: 'mail@example.com',
            password: 'test'
        })

        const balance = await getBalanceUseCase.execute({ user_id: user.id as string })
        
        expect(balance).toHaveProperty('statement')
        expect(balance).toHaveProperty('balance')
        expect(balance.statement.length).toEqual(0)
        expect(balance.balance).toEqual(0)
    })

    it('should not be able to get balance with a non-existing user', async () => {
        expect(async () => {
            await getBalanceUseCase.execute({ user_id: 'non-existing user' })
        }).rejects.toBeInstanceOf(GetBalanceError)
    })
})