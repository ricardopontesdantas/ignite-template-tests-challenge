import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let inMemoryUsersRepository = new InMemoryUsersRepository()
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

describe('Create User', () => {
    it('should be able to create a new user', async () => {
        const user = await createUserUseCase.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456'
        })

        expect(user).toHaveProperty('id')
    })

    it('should not be able to create a new user if email already exists', async () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: 'John Doe',
                email: 'john@example.com',
                password: '123456'
            })
        }).rejects.toBeInstanceOf(CreateUserError)
    })
})