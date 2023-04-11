import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let inMemoryUsersRepository = new InMemoryUsersRepository()
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
let authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)

describe('Authenticate User', () => {
    it('shoud be able to authenticate a user', async () => {
        const user = await createUserUseCase.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456'
        })

        const userWithToken = await authenticateUserUseCase.execute({
            email: 'john@example.com',
            password: '123456'
        })
        
        expect(userWithToken).toHaveProperty('user')
        expect(userWithToken).toHaveProperty('token')
    })

    it('shoud not be able to authenticate a user with a non-existing email', async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: 'non-existing@example.com',
                password: '123456'
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it('shoud not be able to authenticate a user with a wrong password', async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: 'john@example.com',
                password: 'wrong-password'
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})