const authService = (database) => {
    const createUser = async (user) => {
        const data = [user.name, user.email, user.password, "shopper"];
        await database.none(
            "insert into user_signup (username, email, password, role) values ($1, $2, $3, $4)",
            data
        );
    };

    const getUsers = async () => await database.manyOrNone("select * from user_signup");

    const checkUser = async ({usernameOrEmail}) => {
        const checksEmail = usernameOrEmail.includes("@");

        if (!checksEmail) {
            const data = [
                usernameOrEmail
            ];
            const filter = `where username = $1`;
            const query = `select * from user_signup ${filter}`;
            
            return await database.manyOrNone(query, data);
        };

        if (checksEmail) {
            const data = [
                usernameOrEmail
            ];
            const filter = `where email = $1`;
            const query = `select * from user_signup ${filter}`;

            return await database.manyOrNone(query, data);
        };
    };

    return {
        createUser,
        getUsers,
        checkUser
    };
};

export default authService;
