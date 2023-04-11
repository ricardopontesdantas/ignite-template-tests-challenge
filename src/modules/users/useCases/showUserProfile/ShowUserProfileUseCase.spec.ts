import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository = new InMemoryUsersRepository()
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
let showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)

describe('Show User Profile', () => {
    it('should be able to show a user profile', async () => {
        const user = await createUserUseCase.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456'
        })

        const userProfile = await showUserProfileUseCase.execute(user.id as string)
        
        expect(userProfile.name).toEqual('John Doe')
        expect(userProfile.email).toEqual('john@example.com')
        expect(userProfile).toHaveProperty('id')
    })

    it('should not be able to show a user profile with a non-existing user', () => {
        expect(async () => {
            await showUserProfileUseCase.execute('non-existing-user')
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })
})