const Users = require('./users-model.js');
const db = require('../database/dbConfig');

beforeEach(async () => {
    await db('users').truncate()
});

describe('auth-router.js', () => {
    describe('POST /register', () => {
        it('should insert a new user', async () => {
            const initial = await db('users');
            await Users.add({ username: "asdfjkl", password: "password" });
            const users = await db('users');
            expect(users).toHaveLength(initial.length + 1);
        });
        it('should insert the correct username', async () => {
            const user = await Users.add({ username: "jimmy", password: "password" });
            expect(user.username).toBe("jimmy");
        });
    });
    describe('POST /login', () => {
        it('should find a user by username', async ()=>{
            await Users.add({ username: 'jeff', password: 'password' });
            await Users.findBy({ username: 'jeff' }).first().then(user => {
                expect(user).toEqual({ id: 1, username: 'jeff', password: 'password' })
            })
        });
        it('should resolve to 500 status code if user does not exist', async ()=>{
            await Users.add({ username: 'jeff', password: 'password' });
            await Users.findBy({ username: 'bignut' }).first().catch(err => {
                expect(err.status).toEqual(500)
            })
        });
    });
});